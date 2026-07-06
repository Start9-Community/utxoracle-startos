# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `utxoracle`.** Depends (hard-required) on `bitcoind` for local JSON-RPC and chain data; mounts only Bitcoin's `main` volume read-only for the RPC cookie and keeps no state of its own. Exports a single `ui` interface on port 80. The run mode is chosen with the `configure` action and passed to `utxoracle.py` via the `UTXORACLE_MODE` env var.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach utxoracle -n utxoracle-sub -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `utxoracle-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
