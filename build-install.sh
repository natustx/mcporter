#!/usr/bin/env bash
# build-install.sh - Build mcporter standalone binary via Bun
set -euo pipefail

cd "$(dirname "$0")"

BIN_DIR="$HOME/prj/util/bin"

echo "==> Building mcporter..."

# Check for bun
if ! command -v bun &>/dev/null; then
    echo "Error: bun is required but not installed."
    echo "Install via: curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Install dependencies
pnpm install --frozen-lockfile

# Build standalone binary via Bun compile
pnpm build:bun

# Install binary
mkdir -p "$BIN_DIR"
cp dist-bun/mcporter "$BIN_DIR/mcporter"
chmod +x "$BIN_DIR/mcporter"

echo ""
echo "==> mcporter installed successfully!"
echo "    Binary: $BIN_DIR/mcporter"
echo "    Version: $("$BIN_DIR/mcporter" --version 2>/dev/null || echo 'unknown')"
