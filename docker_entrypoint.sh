#!/bin/sh
#
# Thin StartOS wrapper around the unmodified upstream UTXOracle.py.
# It supplies the node connection (a bitcoin.conf pointing at the StartOS
# Bitcoin Core service), runs the script, and serves the HTML it produces.

set -eu

DATADIR="/app/datadir"             # ephemeral data dir we hand to UTXOracle.py
# RPC host/port are supplied by StartOS (main.ts resolves Bitcoin Core's bound
# RPC interface over the internal bridge); loopback is a placeholder until then.
RPC_HOST="${RPC_HOST:-127.0.0.1}"
RPC_PORT="${RPC_PORT:-8332}"
COOKIE="/mnt/bitcoind/.cookie"

webserver_pid=""

terminate() {
    [ -n "$webserver_pid" ] && kill "$webserver_pid" 2>/dev/null || true
    exit 143
}
trap terminate TERM INT

cd /app

# UTXOracle reads RPC settings from a standard bitcoin.conf in its data dir.
mkdir -p "$DATADIR"
cat > "$DATADIR/bitcoin.conf" <<EOF
rpcconnect=${RPC_HOST}
rpcport=${RPC_PORT}
rpccookiefile=${COOKIE}
EOF

# The run mode, provided by StartOS via the daemon env (defaults to today).
argument="${UTXORACLE_MODE:-rb}"

write_status_page() {
    cat > /app/index.html <<EOF
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="15">
  <title>$1</title>
  <style>
    body { background: #111; color: #eee; font-family: sans-serif; margin: 3rem; line-height: 1.5; }
    main { max-width: 42rem; }
  </style>
</head>
<body><main><h1>$1</h1><p>$2</p>
<p>This page refreshes automatically. Check the StartOS logs for detailed progress.</p>
</main></body></html>
EOF
}

start_webserver() {
    printf "\n [i] Starting web server ...\n"
    # Empty favicon so browsers don't log a 404 for /favicon.ico
    [ -f /app/favicon.ico ] || : > /app/favicon.ico
    python3 -m http.server 80 --directory /app &
    webserver_pid=$!
}

wait_for_node() {
    while true; do
        if [ -f "$COOKIE" ] && curl -fs --max-time 10 \
            --user "$(cat "$COOKIE")" \
            --data-binary '{"jsonrpc":"1.0","id":"utxoracle","method":"getblockchaininfo","params":[]}' \
            "http://${RPC_HOST}:${RPC_PORT}/" 2>/dev/null \
            | grep -qE '"initialblockdownload": *false'; then
            return 0
        fi
        echo "Waiting for Bitcoin Core RPC to be ready and synced..."
        sleep 10
    done
}

run_utxoracle() {
    case "$argument" in
        rb|-rb)
            echo "running utxoracle.py -rb (recent blocks)"
            set -- -rb ;;
        [0-9][0-9][0-9][0-9]/[0-9][0-9]/[0-9][0-9])
            echo "running utxoracle.py -d $argument"
            set -- -d "$argument" ;;
        *)
            echo "running utxoracle.py (yesterday)"
            set -- ;;
    esac
    # BROWSER=/bin/true neutralizes the script's webbrowser.open() call headlessly.
    BROWSER=/bin/true python3 /app/utxoracle.py -p "$DATADIR" "$@"
}

rm -f /tmp/utxoracle_exit_code
rm -f /app/UTXOracle_*.html
write_status_page "UTXOracle is running" "Waiting for Bitcoin Core and computing the price."
start_webserver
wait_for_node

set +e
run_utxoracle
exit_code=$?
set -e
echo "$exit_code" > /tmp/utxoracle_exit_code

if [ "$exit_code" -eq 0 ]; then
    result="$(ls -t /app/UTXOracle_*.html 2>/dev/null | head -1)"
    if [ -n "$result" ]; then
        # Strip the upstream "Live Updating Oracle" promo and its autoplay YouTube
        # iframe so a self-hosted instance makes NO external (Google/YouTube)
        # requests. The iframe is the page's only external resource. See UPDATING.md.
        sed -e '/<h2 style="margin-top:10px/,/<\/iframe>/d' \
            -e '/<iframe/,/<\/iframe>/d' \
            "$result" > /app/index.html
    fi
else
    write_status_page "UTXOracle failed" "UTXOracle exited with code ${exit_code} before producing a result."
fi

wait "$webserver_pid"
