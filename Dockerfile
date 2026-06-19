FROM python:3.11-slim

# UTXOracle itself is pure Python stdlib and talks to Bitcoin Core over JSON-RPC.
# curl is only used by the entrypoint's RPC readiness probe.
RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Vendored verbatim from https://utxo.live/oracle/UTXOracle.py — see UPDATING.md.
COPY utxoracle.py /app/utxoracle.py

ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod +x /usr/local/bin/docker_entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
