#!/bin/zsh
# Doppelklick startet die App im Browser auf diesem Mac.
cd "$(dirname "$0")"
( sleep 1; open "http://localhost:8123" ) &
echo "Bonjour laeuft auf http://localhost:8123"
echo "Zum Beenden dieses Fenster schliessen oder Strg+C druecken."
python3 -m http.server 8123
