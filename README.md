<p align="center">
  <img src="icon.svg" alt="UTXOracle Logo" width="21%">
</p>

# UTXOracle on StartOS

> Everything not listed in this document should behave the same as upstream
> UTXOracle. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[UTXOracle](https://utxo.live/oracle/) estimates the price of Bitcoin from the blockchain itself, with no exchange, no API and no price feed — it reads the transaction output values in recent blocks and derives a consensus price from their distribution. This package runs it against your own node and serves the chart it produces.

- **Upstream project:** <https://utxo.live/oracle/>
- **Wrapper repo:** <https://github.com/Start9-Community/utxoracle-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One image, built here around the unmodified upstream script.

| Property      | Value                                          |
| ------------- | ---------------------------------------------- |
| Image         | Built from this repo's `Dockerfile`            |
| Architectures | x86_64, aarch64                                |
| Command       | A shell wrapper: run the script, then serve it |

| Subcontainer    | Purpose                                  |
| --------------- | ---------------------------------------- |
| `utxoracle-sub` | The only daemon — the one to `attach` to |

**The upstream script is vendored unmodified.** The wrapper's whole job is to supply the node connection, run the script once, and serve the HTML it writes — which is why the daemon runs with `runAsInit`, since it supervises both the script and the web server.

**The wrapper writes a standard Bitcoin configuration for the script to read**, because that is how UTXOracle expects to find a node. It **omits the address entirely while StartOS has not resolved one**, rather than writing a placeholder, and waits — the service restarts with the real address as soon as the dependency resolves.

## Volume and Data Layout

One volume, and it holds almost nothing.

| Volume                | Mount Point     | Purpose                 |
| --------------------- | --------------- | ----------------------- |
| `startos`             | — not mounted   | The package's own store |
| Bitcoin's `main` (ro) | `/mnt/bitcoind` | The node's RPC cookie   |

**UTXOracle keeps no state.** Its data directory is inside the container and discarded on every restart, because every run recomputes from the chain. The only persisted thing is which price to compute.

**Only Bitcoin's volume is mounted into the container**, read-only, and only for the cookie.

## File Models

One model, holding one value.

| File         | Format | Modelled                | Written by |
| ------------ | ------ | ----------------------- | ---------- |
| `store.json` | JSON   | Yes — `FileHelper.json` | The action |

**Which price to compute**: today's, yesterday's, or a specific date. It is read reactively, so changing it restarts the service and recomputes.

Bitcoin's address is resolved at start rather than stored — see [Dependencies](#dependencies).

## Dependencies

One, and it is required.

| Dependency | Required | Health checks required      | Mounted                              | Why              |
| ---------- | -------- | --------------------------- | ------------------------------------ | ---------------- |
| Bitcoin    | Yes      | `bitcoind`, `sync-progress` | `main`, read-only at `/mnt/bitcoind` | The chain itself |

**A synced node is required, not merely a running one** — a price derived from a partial chain is not a price.

**Authentication is the node's cookie**, read straight off the mount. No RPC user is created and no password is stored, and because the cookie is read from the mount rather than copied, **a cookie rotated on the node's restart is picked up without this service noticing.**

The node's address is resolved over the internal bridge, reactively: installing, removing, or re-porting Bitcoin heals this service with one restart, while a Bitcoin **update** causes none.

## Network Access and Interfaces

One interface.

| Interface | Id   | Type | Port | Description               |
| --------- | ---- | ---- | ---- | ------------------------- |
| Web UI    | `ui` | ui   | 80   | The generated price chart |

Bound on the `ui-multi` MultiHost over HTTP and not masked.

**There is no login**, and nothing to protect: the page is a chart generated from public blockchain data. It exposes nothing about your node or your wallet.

## Installation and First-Run Flow

Install does nothing: no seeding, no task, no credential.

**Bitcoin must be installed and synced** before UTXOracle can run — it is a required dependency with both of its checks demanded.

The first start computes today's price, which takes a while: the script reads and analyses the recent blocks before it writes anything. **The web interface comes up first and the result appears when the computation finishes**, which is why there are two health checks rather than one.

## Actions

One action.

### Configure

Chooses which price to estimate on the next run.

- **Today** — from the most recent blocks. This is the default and works on a **pruned** node.
- **Yesterday** — the consensus price for the previous full UTC day.
- **A specific date** — any UTC date from the earliest the method supports.
- **What it changes:** the mode in the store.
- **Cost:** the service restarts and recomputes.
- **Repeat safety:** idempotent, pre-filled with the current selection.
- **A historical date needs an unpruned node.** A pruned node no longer has those blocks, so the run fails rather than producing a wrong answer.

The date is entered as a calendar date and converted to the format the script expects; the earliest selectable date is enforced by the form.

## Tasks

None. This package raises no tasks, so the service is never held on a prompt and its ordinary controls are always available.

## Health Checks

Two checks, and the second is the interesting one.

| Check      | Displayed as           | Method                            | Grace |
| ---------- | ---------------------- | --------------------------------- | ----- |
| `primary`  | "Web Interface"        | Port 80 is listening              | 30s   |
| `complete` | "UTXOracle Completion" | The script's recorded exit status | —     |

**The completion check reports on the computation, not the server.** The wrapper records the script's exit code when it finishes; until then the check reports that it is still running, and afterwards it reports success or the failure code.

That is what makes a failed run visible. Without it, a script that exited with an error would leave a green web check in front of a page that never updated.

The completion check polls on a schedule that backs off while loading, so a long computation is not hammered.

## Backups and Restore

The `startos` volume is copied — `sdk.Backups.ofVolumes('startos')` — which is the one stored setting.

**There is nothing else to keep.** Every result is recomputed from the chain, so a restored instance simply runs again and produces the same answer, given the same node.

## Limitations and Differences

1. **A synced Bitcoin node is required**, and both of its health checks must pass.
2. **Historical dates require an unpruned node.** Today's price works on a pruned one.
3. **Every run recomputes from scratch** — there is no cache and no history of past results.
4. **One price at a time.** The mode is a single selection, not a series.
5. **The first result takes minutes**, and the interface is up before it exists.
6. **The licence is UTXOracle's own**, not a standard open-source licence.
7. **No authentication**, which is fine — the page contains only public data.

---

## Quick Reference for AI Consumers

```yaml
package_id: utxoracle
image: built from ./Dockerfile # vendored, unmodified upstream UTXOracle.py
architectures:
  - x86_64
  - aarch64
subcontainers:
  - utxoracle-sub # runAsInit: true — the wrapper supervises the script and the web server
volumes:
  startos: null # store.json only, not mounted; bitcoind's main is ro at /mnt/bitcoind
file_models:
  - store.json # mode: 'rb' (today) | 'yesterday' | 'YYYY/MM/DD'
startos_managed_env_vars:
  - UTXORACLE_MODE
  - RPC_HOST # omitted entirely while unresolved
  - RPC_PORT # omitted entirely while unresolved
dependencies:
  - bitcoind # required, kind: running, healthChecks: [bitcoind, sync-progress], cookie auth
interfaces:
  ui: { type: ui, port: 80 } # no auth; the page is public chain-derived data
actions:
  - configure
tasks: []
health_checks:
  - primary # displayed "Web Interface"; 30s grace
  - complete # displayed "UTXOracle Completion"; reads the script's recorded exit code
```
