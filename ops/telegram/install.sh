#!/usr/bin/env bash
# Installs the Perfit Telegram bot as a systemd service:
#   - CrowdSec block alerts (who, when, why)
#   - "check2" -> server status, "blocks2" -> recent blocks
#
#   sudo bash ops/telegram/install.sh
#
# Token and chat id live in /etc/perfit-telegram.env (created on first run).
# Fill it in, then run this script again to start the bot.
#
#   journalctl -u perfit-telegram-bot -f     # logs
set -euo pipefail

[ "$(id -u)" -eq 0 ] || { echo "Run as root: sudo $0"; exit 1; }
HERE="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE=/etc/perfit-telegram.env
APP_DIR=/opt/perfit-telegram

command -v python3 >/dev/null || { echo "python3 is required"; exit 1; }
command -v cscli >/dev/null || echo "WARNING: cscli not found; block alerts need CrowdSec (ops/crowdsec/install.sh)."

if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" <<'EOF'
# Telegram bot for this server.
BOT_TOKEN=PUT_BOT_TOKEN_HERE
CHAT_ID=PUT_CHAT_ID_HERE
# 1 = answer check2/blocks2. Set 0 if another server already receives this
# bot's messages (Telegram allows only one receiver per bot).
LISTEN_COMMANDS=1
EOF
  chmod 600 "$ENV_FILE"
  echo "Created $ENV_FILE — put the bot token and chat id in it, then run this script again."
  exit 0
fi
chmod 600 "$ENV_FILE"
if grep -qE "PUT_BOT_TOKEN_HERE|PUT_CHAT_ID_HERE" "$ENV_FILE"; then
  echo "Fill in BOT_TOKEN and CHAT_ID in $ENV_FILE first, then run this script again."
  exit 1
fi

install -d "$APP_DIR"
install -m 755 "$HERE/perfit_bot.py" "$APP_DIR/perfit_bot.py"

# pm2 is often installed under nvm, outside systemd's default PATH.
EXTRA_PATH=""
PM2_BIN="$(command -v pm2 || true)"
[ -n "$PM2_BIN" ] && EXTRA_PATH="$(dirname "$(readlink -f "$PM2_BIN")"):$(dirname "$PM2_BIN"):"

cat > /etc/systemd/system/perfit-telegram-bot.service <<EOF
[Unit]
Description=Perfit Telegram bot (CrowdSec alerts, check2 status)
After=network-online.target crowdsec.service
Wants=network-online.target

[Service]
ExecStart=/usr/bin/python3 $APP_DIR/perfit_bot.py
Restart=always
RestartSec=10
Environment=HOME=/root
Environment=PM2_HOME=/root/.pm2
Environment=PATH=${EXTRA_PATH}/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
MemoryMax=80M

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable perfit-telegram-bot >/dev/null
systemctl restart perfit-telegram-bot
sleep 4
if systemctl is-active --quiet perfit-telegram-bot; then
  echo "Bot running. You should get a 'Perfit bot started' message in Telegram; send check2 to test."
else
  echo "Bot failed to start:"; journalctl -u perfit-telegram-bot -n 30 --no-pager; exit 1
fi
