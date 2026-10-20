#!/usr/bin/env bash
# Installs Node 22 LTS into /opt/node22 from nodejs.org (checksum verified) without touching the
# system Node, so other apps on the server keep their version.
set -euo pipefail
VERSION="${NODE_VERSION:-v22.23.3}" DEST=/opt/node22
if [ -x "$DEST/bin/node" ] && [ "$("$DEST/bin/node" -v)" = "$VERSION" ]; then echo "Node $VERSION already in $DEST"; exit 0; fi
case "$(uname -m)" in x86_64) ARCH=x64;; aarch64) ARCH=arm64;; *) echo "Unsupported CPU $(uname -m)"; exit 1;; esac
FILE="node-$VERSION-linux-$ARCH.tar.xz" TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
curl -fsSL "https://nodejs.org/dist/$VERSION/$FILE" -o "$TMP/$FILE"
curl -fsSL "https://nodejs.org/dist/$VERSION/SHASUMS256.txt" -o "$TMP/SHASUMS256.txt"
(cd "$TMP" && grep " $FILE\$" SHASUMS256.txt | sha256sum -c -)
rm -rf "$DEST" && mkdir -p "$DEST" && tar -xJf "$TMP/$FILE" -C "$DEST" --strip-components=1
echo "Installed $("$DEST/bin/node" -v) in $DEST"
