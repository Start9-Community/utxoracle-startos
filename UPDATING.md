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

   Never patch the script; adapt `docker_entrypoint.sh` instead. After updating, confirm upstream still reads `bitcoin.conf` for `rpcconnect`/`rpcport`/`rpccookiefile` and still writes an `UTXOracle_*.html` file; if those conventions change, adjust `docker_entrypoint.sh`.

   The entrypoint strips the upstream "Live Updating Oracle" promo and its YouTube `<iframe>` from the result page. Re-check the served page for external URLs (`grep -E 'https?://' index.html`) and adjust the `sed` in `docker_entrypoint.sh` if upstream changes the markup.

2. Bump the `python:*-slim` base image in `Dockerfile` only if a newer Python is required.
