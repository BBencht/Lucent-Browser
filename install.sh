#!/bin/bash
set -e

echo "🫧 Installing Lucent Browser..."

ARCH=$(uname -m)
VERSION="1.1.0"
if [ "$ARCH" = "arm64" ]; then
  FILE_URL="https://github.com/BBencht/Lucent-Browser/releases/download/v${VERSION}/Lucent.Browser-${VERSION}-arm64-mac.zip"
else
  FILE_URL="https://github.com/BBencht/Lucent-Browser/releases/download/v${VERSION}/Lucent.Browser-${VERSION}-mac.zip"
fi

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

echo "⬇️  Downloading Lucent Browser ($ARCH)..."
curl -sL --progress-bar "$FILE_URL" -o "$TMP_DIR/lucent.zip"

echo "📦 Extracting to /Applications..."
rm -rf "/Applications/Lucent Browser.app"
unzip -q "$TMP_DIR/lucent.zip" -d "/Applications"

echo "🛡️  Clearing macOS Gatekeeper quarantine..."
xattr -cr "/Applications/Lucent Browser.app" || true

echo "✨ Lucent Browser installed successfully!"
echo "🚀 Launching Lucent Browser..."
open "/Applications/Lucent Browser.app"
