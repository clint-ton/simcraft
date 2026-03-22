FROM rust:1.88-bookworm AS builder

WORKDIR /build

# Copy workspace files
COPY Cargo.toml ./
COPY core/ core/
COPY server/ server/
# Create stub desktop crate so workspace resolves
RUN mkdir -p desktop/src && echo "fn main() {}" > desktop/src/main.rs
COPY desktop/Cargo.toml desktop/Cargo.toml

RUN cargo build --release -p simhammer-server

# --- Fetch game data from Raidbots ---
FROM debian:bookworm-slim AS fetcher

RUN apt-get update && apt-get install -y --no-install-recommends curl jq ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /data
RUN curl -sL -o metadata.json https://www.raidbots.com/static/data/live/metadata.json \
    && for f in $(jq -r '.files[]' metadata.json); do \
         echo "Downloading $f"; \
         curl -sL -o "$f" "https://www.raidbots.com/static/data/live/$f"; \
       done

# --- Build SimulationCraft from source ---
FROM debian:bookworm-slim AS simc-builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    libcurl4-openssl-dev \
    libssl-dev \
    git \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

RUN git clone --depth 1 https://github.com/simulationcraft/simc.git /tmp/simc \
    && cd /tmp/simc/engine \
    && make -j$(nproc) OPENSSL=0 \
    && cp simc /usr/local/bin/simc \
    && rm -rf /tmp/simc

# --- Runtime ---
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /build/target/release/simhammer-server /usr/local/bin/simhammer-server
COPY --from=simc-builder /usr/local/bin/simc /usr/local/bin/simc

# Download Raidbots game data files via metadata.json
COPY --from=fetcher /data /app/data

WORKDIR /app
ENV DATA_DIR=/app/data
ENV SIMC_PATH=/usr/local/bin/simc
ENV PORT=8000

EXPOSE 8000

CMD ["simhammer-server"]
