#!/usr/bin/env bash
# Baut die Seite und überträgt sie per rsync auf den Server.
#
# Aufruf:
#   ./deploy.sh            Seite bauen und hochladen
#   ./deploy.sh --dry-run  nur anzeigen, was sich ändern würde
set -euo pipefail

HOST="milos"
ZIEL="/opt/www/profile/"

cd "$(dirname "$0")"

RSYNC_OPTIONEN=(-avz --delete)
if [[ "${1:-}" == "--dry-run" ]]; then
  RSYNC_OPTIONEN+=(--dry-run)
  echo "Testlauf: Es wird nichts übertragen."
fi

if [[ ! -x .venv/bin/zensical ]]; then
  echo "Fehler: .venv/bin/zensical fehlt. Zuerst die Umgebung einrichten (siehe README.md)." >&2
  exit 1
fi

echo "Baue die Seite ..."
rm -rf site
.venv/bin/zensical build

echo "Übertrage nach ${HOST}:${ZIEL} ..."
rsync "${RSYNC_OPTIONEN[@]}" site/ "${HOST}:${ZIEL}"

echo "Fertig."
