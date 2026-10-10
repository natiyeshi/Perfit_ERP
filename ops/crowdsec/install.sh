#!/usr/bin/env bash
# Installs CrowdSec on the Perfit API server so IPs that behave like bots or
# attackers are blocked at the firewall automatically.
#
#   sudo ./install.sh [trusted-ip ...]
#
# trusted-ip: addresses that must never be blocked (office IP, monitoring /
# benchmark servers...). Your current SSH IP and this server's own addresses
# are added automatically. Safe to re-run.
#
# What it sets up:
#   - crowdsec agent reading nginx's access/error logs and the SSH auth log
#   - detections from the CrowdSec hub: vulnerability scanners, sensitive file
#     probes (.env, .git...), path traversal, known CVE exploits, bad bots,
#     crawlers, SSH brute force (plus the community blocklist of known
#     attackers)
#   - a Perfit-specific rule: repeated failed logins on /api/v1/auth/sign-in
#   - crowdsec-firewall-bouncer: turns decisions into iptables blocks
#
# It does not touch ufw or nginx config. Uses ~60-150 MB RAM.
#
# Day-to-day:
#   cscli decisions list                 # who is blocked right now
#   cscli alerts list                    # what was detected
#   cscli decisions delete --ip <ip>     # unblock someone
#   cscli decisions add --ip <ip> --duration 24h --reason "manual"   # block by hand
#   cscli metrics                        # are logs being read/parsed?

set -euo pipefail

[ "$(id -u)" -eq 0 ] || { echo "Run as root: sudo $0 $*"; exit 1; }
command -v apt-get >/dev/null || { echo "This script supports Debian/Ubuntu (apt) only."; exit 1; }

ACCESS_LOG=/var/log/nginx/access.log
ERROR_LOG=/var/log/nginx/error.log
for f in "$ACCESS_LOG" "$ERROR_LOG"; do
  [ -r "$f" ] || { echo "Missing $f — is nginx logging there?"; exit 1; }
done

say() { printf '\n\033[1m== %s\033[0m\n' "$*"; }

# --- trusted IPs (never blocked) ---------------------------------------------
TRUSTED=("127.0.0.1" "::1" "$@")
SSH_IP="${SSH_CLIENT:-}"; SSH_IP="${SSH_IP%% *}"
[ -n "${SSH_IP:-}" ] && TRUSTED+=("$SSH_IP")
for ip in $(hostname -I 2>/dev/null); do TRUSTED+=("$ip"); done
mapfile -t TRUSTED < <(printf '%s\n' "${TRUSTED[@]}" | awk 'NF && !seen[$0]++')
say "Trusted (never blocked): ${TRUSTED[*]}"
[ -z "${SSH_IP:-}" ] && echo "WARNING: couldn't detect your SSH IP — pass it as an argument so you can't block yourself."

# --- install crowdsec ---------------------------------------------------------
if ! command -v cscli >/dev/null; then
  say "Adding the CrowdSec package repository"
  curl -fsSL https://install.crowdsec.net | sh
  apt-get update -qq
fi

# CrowdSec's local API listens on 127.0.0.1:8080 by default; pick another port
# if something already uses 8080 so the service can start.
LAPI_PORT=8080
if ss -ltn 2>/dev/null | awk '{print $4}' | grep -qE '[:.]8080$' && ! pgrep -x crowdsec >/dev/null; then
  for p in 8081 8082 8090 18080; do
    ss -ltn | awk '{print $4}' | grep -qE "[:.]$p\$" || { LAPI_PORT=$p; break; }
  done
  echo "Port 8080 is busy; CrowdSec's local API will use 127.0.0.1:$LAPI_PORT"
fi

say "Installing crowdsec"
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq crowdsec || true  # may fail to start if 8080 is busy; fixed below

if [ "$LAPI_PORT" != "8080" ]; then
  sed -i "s|listen_uri: 127.0.0.1:8080|listen_uri: 127.0.0.1:$LAPI_PORT|" /etc/crowdsec/config.yaml
  sed -i "s|http://127.0.0.1:8080|http://127.0.0.1:$LAPI_PORT|" /etc/crowdsec/local_api_credentials.yaml
fi

# --- detections ---------------------------------------------------------------
say "Installing detection collections"
cscli hub update >/dev/null
cscli collections install \
  crowdsecurity/nginx \
  crowdsecurity/linux \
  crowdsecurity/base-http-scenarios \
  crowdsecurity/http-cve \
  crowdsecurity/whitelist-good-actors >/dev/null
cscli hub upgrade >/dev/null || true

# Read nginx logs (only if the installer's auto-detection didn't already).
if ! grep -rqs "$ACCESS_LOG" /etc/crowdsec/acquis.yaml /etc/crowdsec/acquis.d/ 2>/dev/null; then
  mkdir -p /etc/crowdsec/acquis.d
  cat > /etc/crowdsec/acquis.d/perfit-nginx.yaml <<EOF
filenames:
  - $ACCESS_LOG
  - $ERROR_LOG
labels:
  type: nginx
EOF
fi

# Perfit login brute force: 8+ failed sign-ins from one IP within ~a minute
# (bucket of 7 leaking 1 per 10s). Real users mistyping a password don't hit this.
mkdir -p /etc/crowdsec/scenarios
cat > /etc/crowdsec/scenarios/perfit-login-bf.yaml <<'EOF'
type: leaky
name: perfit/login-bf
description: "Repeated failed logins on the Perfit API"
filter: "evt.Meta.log_type == 'http_access-log' && evt.Meta.http_verb == 'POST' && evt.Meta.http_path startsWith '/api/v1/auth/sign-in' && evt.Meta.http_status in ['400', '401', '403', '404']"
groupby: evt.Meta.source_ip
capacity: 7
leakspeed: 10s
blackhole: 5m
labels:
  service: http
  type: bruteforce
  remediation: true
EOF

# Never block our own / trusted addresses.
mkdir -p /etc/crowdsec/parsers/s02-enrich
{
  echo "name: perfit/trusted-ips"
  echo "description: \"Never block Perfit's own servers and admins\""
  echo "whitelist:"
  echo "  reason: \"perfit trusted ip\""
  echo "  ip:"
  for ip in "${TRUSTED[@]}"; do
    [[ "$ip" == */* ]] && continue
    echo "    - \"$ip\""
  done
  echo "  cidr:"
  echo "    - \"127.0.0.0/8\""
  for ip in "${TRUSTED[@]}"; do
    [[ "$ip" == */* ]] && echo "    - \"$ip\""
  done
} > /etc/crowdsec/parsers/s02-enrich/perfit-trusted-ips.yaml

say "Checking configuration"
crowdsec -c /etc/crowdsec/config.yaml -t
systemctl enable crowdsec >/dev/null
systemctl restart crowdsec
sleep 3
systemctl is-active --quiet crowdsec || { echo "crowdsec failed to start:"; journalctl -u crowdsec -n 30 --no-pager; exit 1; }

# --- firewall bouncer (does the actual blocking) ------------------------------
say "Installing the firewall bouncer (iptables)"
if ! dpkg -s crowdsec-firewall-bouncer-iptables >/dev/null 2>&1 && ! dpkg -s crowdsec-firewall-bouncer-nftables >/dev/null 2>&1; then
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq crowdsec-firewall-bouncer-iptables
fi
BOUNCER_CFG=/etc/crowdsec/bouncers/crowdsec-firewall-bouncer.yaml
if [ -f "$BOUNCER_CFG" ] && [ "$LAPI_PORT" != "8080" ]; then
  sed -i "s|http://127.0.0.1:8080|http://127.0.0.1:$LAPI_PORT|" "$BOUNCER_CFG"
fi
systemctl enable crowdsec-firewall-bouncer >/dev/null
systemctl restart crowdsec-firewall-bouncer
sleep 3
systemctl is-active --quiet crowdsec-firewall-bouncer || { echo "bouncer failed to start:"; journalctl -u crowdsec-firewall-bouncer -n 30 --no-pager; exit 1; }

# --- end-to-end check: block a test IP and confirm it reaches the firewall ----
say "Self-test"
TEST_IP=203.0.113.77   # TEST-NET-3, never a real host
cscli decisions add --ip "$TEST_IP" --duration 2m --reason "install self-test" >/dev/null
sleep 12
if iptables-save 2>/dev/null | grep -q "crowdsec" && (ipset list 2>/dev/null | grep -q "$TEST_IP" || iptables-save | grep -q "$TEST_IP"); then
  echo "OK: a test decision reached the firewall."
else
  echo "WARNING: test decision not seen in iptables/ipset yet. Check: systemctl status crowdsec-firewall-bouncer"
fi
cscli decisions delete --ip "$TEST_IP" >/dev/null || true

say "Status"
cscli bouncers list
echo
cscli metrics 2>/dev/null | sed -n '/Acquisition Metrics/,/^$/p' | head -12
echo
echo "Installed. CrowdSec is now reading nginx + SSH logs and blocking IPs that misbehave."
echo "  cscli decisions list            # currently blocked IPs"
echo "  cscli alerts list               # detections"
echo "  cscli decisions delete --ip X   # unblock"
