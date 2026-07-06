<p align="center">
  <img src="icon.svg" alt="UTXOracle Logo" width="21%">
</p>

# UTXOracle on StartOS

> **Upstream docs:** <https://utxo.live/oracle/>
>
> Everything not listed in this document should behave the same as upstream
> UTXOracle. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

UTXOracle estimates the price of bitcoin by analyzing patterns in local
on-chain transaction data. This StartOS package runs UTXOracle against the
Bitcoin Core service on the same server and serves the generated result page
through a web interface.

## Image and Container Runtime

This package is a thin wrapper around upstream UTXOracle. The image is
`python:3.11-slim` with `utxoracle.py` vendored **verbatim** from
<https://utxo.live/oracle/UTXOracle.py> (see `UPDATING.md`) plus the StartOS
entrypoint. UTXOracle talks to Bitcoin Core over JSON-RPC using only the Python
standard library — there is no `bitcoin-cli` and no raw block-file access.

The entrypoint writes a `bitcoin.conf` pointing at the StartOS Bitcoin Core
service, shows a temporary status page, starts the web server, waits for Bitcoin
Core RPC readiness, runs the unmodified script, and serves the HTML chart it
produces as `index.html`. If UTXOracle exits with an error, the web server keeps
running and the status page is replaced with a failure page.

Supported architectures are declared in `startos/manifest/index.ts`.

## Volume and Data Layout

The package keeps no state of its own inside the container — the result page is
recomputed on each run. Its only persistence is the run-mode setting, stored by
StartOS in `store.json` on the `startos` volume (read in `startos/main.ts`, not
mounted into the container).

The Bitcoin Core dependency volume is mounted read-only at `/mnt/bitcoind` so
UTXOracle can read the RPC cookie (`/mnt/bitcoind/.cookie`) for authentication.
All block data is fetched over JSON-RPC from the local Bitcoin Core service; the
package does not read raw block files.

## Installation and First-Run Flow

Install Bitcoin Core on the same StartOS server before starting UTXOracle.
The entrypoint generates the `bitcoin.conf` that points UTXOracle at the local
Bitcoin Core service; no RPC username or password is generated or stored by this
package (it uses Bitcoin Core's cookie).

When the service starts, the web interface becomes available first with a
temporary status page. The final UTXOracle result page appears after block
analysis completes.

## Configuration Management

The run mode (`rb` for today, `yesterday`, or a `YYYY/MM/DD` date) lives in
`store.json` on the `startos` volume. `startos/main.ts` reads it and passes it to
the container as the `UTXORACLE_MODE` environment variable. Set it through the
Configure action. The Bitcoin Core RPC connection is separate: `startos/main.ts`
resolves Bitcoin Core's bound RPC interface over the internal StartOS bridge and
passes its host and port to the container as the `RPC_HOST`/`RPC_PORT`
environment variables, which the entrypoint writes into a `bitcoin.conf` at
startup (falling back to loopback until the address resolves).

## Network Access and Interfaces

| Interface | Protocol | Purpose |
| --- | --- | --- |
| Web Interface | HTTP | Serves the temporary status page and generated UTXOracle result page. |

The interface port is declared in `startos/interfaces.ts`.

## Actions

| Action | Availability | Purpose |
| --- | --- | --- |
| Configure | Any status | Selects which price UTXOracle estimates on its next run. |

The Configure action offers three choices: **Today** (the most recent 144-block
window price), **Yesterday** (the previous full UTC day), or **Specific Date** (a
UTC date from 2023-12-15 onward, chosen with a date picker). The selection is
stored in `store.json` on the `startos` volume and applied on the service's next
run.

## Backups and Restore

Backups include the `startos` volume (the run-mode setting). Restore uses the
standard StartOS SDK backup flow for that volume. The Bitcoin Core dependency
volume is not backed up by this package.

## Health Checks

| Health Check | Purpose |
| --- | --- |
| Web Interface | Confirms the HTTP server is listening. |
| UTXOracle Completion | Reports loading while UTXOracle is still running, success after a clean run, and failure after a nonzero exit. |

## Dependencies

Bitcoin Core is required. The dependency version range and required health
checks are declared in `startos/dependencies.ts`.

UTXOracle uses Bitcoin Core for JSON-RPC calls with RPC cookie authentication.
The Bitcoin Core dependency volume is mounted read-only solely to read the
cookie file.

## Limitations and Differences

1. UTXOracle connects only to the Bitcoin Core service on the same StartOS
   server.
2. The web interface is a static HTTP server that serves the generated
   UTXOracle result page.
3. UTXOracle does not store Bitcoin Core RPC usernames or passwords.
4. The result page updates when the service is run again; this package does not
   provide a live streaming price feed.

## What Is Unchanged from Upstream

`utxoracle.py` is the upstream script, vendored verbatim and unmodified. This
package adds only the StartOS wrapper around it: the Docker image, the entrypoint
that supplies `bitcoin.conf` and serves the output, dependency wiring, and the
Configure action.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Quick Reference for AI Consumers

```yaml
package_id: utxoracle
architectures:
  - x86_64
  - aarch64
volumes:
  startos: store.json (run mode; not mounted into the container)
dependency_mounts:
  bitcoind_main: /mnt/bitcoind
ports:
  web: http
dependencies:
  - bitcoind
startos_managed_env_vars:
  - UTXORACLE_MODE
  - RPC_HOST
  - RPC_PORT
actions:
  - configure
health_checks:
  - primary
  - complete
```
