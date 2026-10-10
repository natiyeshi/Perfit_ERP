#!/usr/bin/env python3
"""Perfit server Telegram bot (stdlib only, Python 3.8+).

- Sends a message when CrowdSec blocks an IP: who, when, why, for how long.
- Replies to "check2" with a server status summary.

Config: /etc/perfit-telegram.env
  BOT_TOKEN=123:abc
  CHAT_ID=123456789          # only this chat gets alerts and may send commands
  LISTEN_COMMANDS=1          # 0 = alerts only (if another server already polls this bot)
"""
import json
import os
import shutil
import socket
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

ENV_FILE = "/etc/perfit-telegram.env"
STATE_FILE = "/var/lib/perfit-telegram/state.json"
DECISION_POLL_S = 20
API_URL = "http://127.0.0.1:4040/api/v1/health-probe"  # any path; a 404 JSON means the API is up


def load_env():
    env = {}
    with open(ENV_FILE) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env


ENV = load_env()
TOKEN = ENV["BOT_TOKEN"]
CHAT_ID = str(ENV["CHAT_ID"])
LISTEN = ENV.get("LISTEN_COMMANDS", "1") == "1"
HOST = socket.gethostname()


def log(*a):
    print(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), *a, flush=True)


def tg(method, params, timeout=70):
    data = urllib.parse.urlencode(params).encode()
    req = urllib.request.Request(f"https://api.telegram.org/bot{TOKEN}/{method}", data=data)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())


def send(text):
    for attempt in range(3):
        try:
            tg("sendMessage", {"chat_id": CHAT_ID, "text": text, "parse_mode": "HTML",
                               "disable_web_page_preview": "true"}, timeout=20)
            return
        except Exception as e:  # network blip / rate limit
            log("send failed:", e)
            time.sleep(3 * (attempt + 1))


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def run(cmd, timeout=20):
    try:
        return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout).stdout
    except Exception:
        return ""


# --- state (which decisions were already reported, block history) -------------

def load_state():
    try:
        with open(STATE_FILE) as f:
            return json.load(f)
    except Exception:
        return {"seen": [], "history": []}


def save_state(state):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    tmp = STATE_FILE + ".tmp"
    with open(tmp, "w") as f:
        json.dump(state, f)
    os.replace(tmp, STATE_FILE)


# --- CrowdSec blocks -------------------------------------------------------------

def local_decisions():
    """Active decisions made on this server (not the community blocklist)."""
    out = run(["cscli", "decisions", "list", "-o", "json"])
    try:
        alerts = json.loads(out) or []
    except Exception:
        return []
    rows = []
    for a in alerts:
        src = a.get("source") or {}
        for d in a.get("decisions") or []:
            rows.append({
                "id": d.get("id"),
                "ip": d.get("value"),
                "type": d.get("type"),
                "duration": (d.get("duration") or "").split(".")[0],
                "scenario": d.get("scenario") or a.get("scenario"),
                "origin": d.get("origin"),
                "country": src.get("cn") or "",
                "as_name": src.get("as_name") or "",
                "events": a.get("events_count"),
                "at": a.get("created_at") or a.get("start_at") or "",
            })
    return rows


def fmt_block(d):
    where = ", ".join(x for x in (d["country"], d["as_name"]) if x)
    when = d["at"].replace("T", " ").replace("Z", " UTC")[:23] if d["at"] else "now"
    reason = d["scenario"] or "manual"
    lines = [f"🚫 <b>Blocked</b> <code>{esc(d['ip'])}</code>" + (f" ({esc(where)})" if where else ""),
             f"Reason: {esc(reason)}" + (f" ({d['events']} events)" if d.get("events") else ""),
             f"When: {esc(when)}",
             f"For: {esc(d['duration'])}"]
    if d["origin"] == "cscli":
        lines[0] = lines[0].replace("Blocked", "Blocked manually")
    return "\n".join(lines)


def check_new_blocks(state, notify=True):
    seen = set(state["seen"])
    new = [d for d in local_decisions() if d["id"] not in seen and d["type"] == "ban"]
    if not new:
        return
    if notify:
        for i in range(0, len(new), 10):  # one message per 10 blocks
            send(f"<b>{esc(HOST)}</b>\n\n" + "\n\n".join(fmt_block(d) for d in new[i:i + 10]))
    now = time.time()
    state["seen"] = (state["seen"] + [d["id"] for d in new])[-5000:]
    state["history"] = [h for h in state["history"] if now - h["t"] < 7 * 86400]
    state["history"] += [{"t": now, "ip": d["ip"], "scenario": d["scenario"]} for d in new]
    save_state(state)


# --- check2: server status -------------------------------------------------------

def cpu_percent():
    def snap():
        with open("/proc/stat") as f:
            v = [int(x) for x in f.readline().split()[1:]]
        return sum(v), v[3] + v[4]  # total, idle+iowait
    t1, i1 = snap()
    time.sleep(0.5)
    t2, i2 = snap()
    return 0 if t2 == t1 else round(100 * (1 - (i2 - i1) / (t2 - t1)))


def meminfo():
    m = {}
    with open("/proc/meminfo") as f:
        for line in f:
            k, v = line.split(":")
            m[k] = int(v.split()[0]) * 1024
    return m


def gi(n):
    return f"{n / 1024 ** 3:.1f}Gi"


def svc(name):
    return run(["systemctl", "is-active", name]).strip() == "active"


def api_health():
    t = time.time()
    try:
        urllib.request.urlopen(API_URL, timeout=5)
        ok = True
    except urllib.error.HTTPError as e:
        ok = e.code < 500  # the API answers unknown paths with 404/401: it is up
    except Exception:
        ok = False
    return ok, round((time.time() - t) * 1000)


def status_text():
    m = meminfo()
    used = m["MemTotal"] - m["MemAvailable"]
    swap_used = m.get("SwapTotal", 0) - m.get("SwapFree", 0)
    disk = shutil.disk_usage("/")
    lines = [f"🖥 <b>Server Status</b> ({esc(HOST)})", "",
             f"CPU: {cpu_percent()}%",
             f"RAM: {round(100 * used / m['MemTotal'])}% ({gi(used)} / {gi(m['MemTotal'])})"]
    if m.get("SwapTotal"):
        lines.append(f"Swap: {round(100 * swap_used / m['SwapTotal'])}% ({gi(swap_used)} / {gi(m['SwapTotal'])})")
    lines.append(f"Disk: {round(100 * disk.used / disk.total)}% ({disk.free // 1024 ** 3}G free)")
    lines.append(f"Nginx: {'✅ Running' if svc('nginx') else '❌ Down'}")
    ok, ms = api_health()
    lines.append(f"API: {'✅ Responding' if ok else '❌ Not responding'} ({ms} ms)")

    try:
        apps = json.loads(run(["pm2", "jlist"]) or "[]")
    except Exception:
        apps = []
    if apps:
        lines += ["", "PM2:"]
        for a in apps:
            env = a.get("pm2_env", {})
            st = env.get("status", "?")
            up = ""
            if env.get("pm_uptime") and st == "online":
                up = ", up " + str(timedelta(seconds=int(time.time() - env["pm_uptime"] / 1000)))
            mem = a.get("monit", {}).get("memory", 0)
            lines.append(f"{'✅' if st == 'online' else '❌'} {esc(a.get('name'))}: {st}{up}, "
                         f"{mem // 1024 ** 2} MB, {env.get('restart_time', 0)} restarts")

    if shutil.which("docker"):
        out = run(["docker", "ps", "-a", "--format", "{{.Names}}|{{.Status}}"])
        if out.strip():
            lines += ["", "Docker:"]
            for row in out.strip().splitlines():
                name, st = row.split("|", 1)
                healthy = st.startswith("Up") and "unhealthy" not in st
                lines.append(f"{'✅' if healthy else '❌'} {esc(name)}: {esc(st)}")

    cs_ok = svc("crowdsec")
    fw_ok = svc("crowdsec-firewall-bouncer")
    active = len(local_decisions())
    day = sum(1 for h in load_state()["history"] if time.time() - h["t"] < 86400)
    lines += ["", f"CrowdSec: {'✅' if cs_ok else '❌'} engine, {'✅' if fw_ok else '❌'} firewall",
              f"Blocked now: {active} IPs, last 24h: {day}"]
    return "\n".join(lines)


def recent_blocks_text():
    hist = load_state()["history"][-15:]
    if not hist:
        return "No blocks recorded yet."
    rows = [f"{datetime.fromtimestamp(h['t'], timezone.utc).strftime('%m-%d %H:%M')}  "
            f"<code>{esc(h['ip'])}</code>  {esc((h['scenario'] or 'manual').split('/')[-1])}"
            for h in reversed(hist)]
    return "🚫 <b>Last blocks</b> (UTC)\n\n" + "\n".join(rows)


# --- main loop -------------------------------------------------------------------

def main():
    state = load_state()
    # First run: record what is already blocked without flooding the chat.
    check_new_blocks(state, notify=bool(state["seen"]))
    send(f"✅ Perfit bot started on <b>{esc(HOST)}</b>. Send <code>check2</code> for status, "
         f"<code>blocks2</code> for recent blocks.")

    offset = None
    if LISTEN:
        try:  # skip commands sent while the bot was down
            r = tg("getUpdates", {"offset": -1, "timeout": 0}, timeout=20)
            if r.get("result"):
                offset = r["result"][-1]["update_id"] + 1
        except Exception as e:
            log("initial getUpdates failed:", e)

    last_check = 0.0
    while True:
        if time.time() - last_check >= DECISION_POLL_S:
            try:
                check_new_blocks(state)
            except Exception as e:
                log("decision check failed:", e)
            last_check = time.time()

        if not LISTEN:
            time.sleep(DECISION_POLL_S)
            continue
        try:
            params = {"timeout": DECISION_POLL_S, "allowed_updates": json.dumps(["message"])}
            if offset is not None:
                params["offset"] = offset
            r = tg("getUpdates", params)
            for u in r.get("result", []):
                offset = u["update_id"] + 1
                msg = u.get("message") or {}
                if str(msg.get("chat", {}).get("id")) != CHAT_ID:
                    continue  # ignore everyone else
                text = (msg.get("text") or "").strip().lower().lstrip("/")
                if text == "check2":
                    send(status_text())
                elif text == "blocks2":
                    send(recent_blocks_text())
        except urllib.error.HTTPError as e:
            if e.code == 409:
                log("409 Conflict: another server is already receiving this bot's messages. "
                    "Set LISTEN_COMMANDS=0 or use a separate bot for perfit. Retrying in 60s.")
                time.sleep(60)
            else:
                log("getUpdates HTTP error:", e.code)
                time.sleep(10)
        except Exception as e:
            log("getUpdates failed:", e)
            time.sleep(10)


if __name__ == "__main__":
    main()
