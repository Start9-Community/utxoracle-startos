# Updating UTXOracle for StartOS

## Determining the upstream version

`utxoracle.py` is vendored **verbatim** from upstream — a single self-contained Python script with no third-party dependencies:

```bash
curl -fsSL https://utxo.live/oracle/UTXOracle.py
```

The version is named in the banner near the top of the file (currently "Version 9.1 RPC Only").

## Applying the bump

1. Re-download and replace `utxoracle.py` verbatim:

   ```bash
   curl -fsSL https://utxo.live/oracle/UTXOracle.py -o utxoracle.py
   ```

   This package does **not** patch the script — it is a thin wrapper. `docker_entrypoint.sh` supplies a `bitcoin.conf` (RPC host/port from the `RPC_HOST`/`RPC_PORT` env vars StartOS injects — `startos/main.ts` resolves Bitcoin Core's bound RPC interface over the internal bridge — plus the cookie path) pointing at the StartOS Bitcoin Core service and serves the HTML the script produces, so the upstream script runs unmodified. After updating, confirm upstream still reads `bitcoin.conf` for `rpcconnect`/`rpcport`/`rpccookiefile` and still writes an `UTXOracle_*.html` file; if those conventions change, adjust `docker_entrypoint.sh` (never the script).

   **Privacy:** the entrypoint also strips the upstream "Live Updating Oracle" promo and its autoplay YouTube `<iframe>` from the result page so a self-hosted instance makes no external (Google/YouTube) requests — that iframe is the page's only external resource. After updating, re-check the served page for external URLs (`grep -E 'https?://' index.html`) and adjust the `sed` in `docker_entrypoint.sh` if upstream changes the markup. Ideally, ask upstream for a `--private`/`--no-embed` flag so this strip becomes unnecessary.

2. Bump the `python:*-slim` base image in `Dockerfile` only if a newer Python is required.

3. Update `startos/versions/current.ts` with the new ExVer package version and release notes.

4. If the update changes persistent data or config format, move the previous `current.ts` into a version-named file and add it to `startos/versions/index.ts` so migrations remain available.
