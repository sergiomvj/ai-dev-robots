#!/bin/bash
# =============================================================
# send-telegram.sh — Enviar mensagem via Telegram Bot API
# Referenciado em: Commands/send-telegram.md
# Uso: bash send-telegram.sh --to sergio --message "texto"
# =============================================================

set -e

: "${TELEGRAM_BOT_TOKEN:?TELEGRAM_BOT_TOKEN não configurado}"

# IDs pré-configurados
SERGIO_ID=861952660
GROUP_ID="${TELEGRAM_GROUP_ID:-}"

# Defaults
CHAT_ID=""
MESSAGE=""
FILE=""
PARSE_MODE="Markdown"
SILENT=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --to)
      case "$2" in
        sergio) CHAT_ID=$SERGIO_ID ;;
        group)  CHAT_ID=$GROUP_ID ;;
        *)      CHAT_ID="$2" ;;
      esac
      shift 2 ;;
    --chat-id) CHAT_ID="$2"; shift 2 ;;
    --message) MESSAGE="$2"; shift 2 ;;
    --file) FILE="$2"; shift 2 ;;
    --silent) SILENT=true; shift ;;
    --format) PARSE_MODE="$2"; shift 2 ;;
    *) echo "Argumento desconhecido: $1"; exit 1 ;;
  esac
done

[[ -z "$CHAT_ID" ]] && { echo "❌ --to ou --chat-id é obrigatório"; exit 1; }
[[ -z "$MESSAGE" ]] && { echo "❌ --message é obrigatório"; exit 1; }

BASE_URL="https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN"

if [[ -n "$FILE" && -f "$FILE" ]]; then
  # Enviar arquivo
  RESPONSE=$(curl -s -X POST "$BASE_URL/sendDocument" \
    -F "chat_id=$CHAT_ID" \
    -F "document=@$FILE" \
    -F "caption=$MESSAGE" \
    -F "parse_mode=$PARSE_MODE" \
    $([ "$SILENT" = true ] && echo "-F disable_notification=true"))
else
  # Enviar texto
  RESPONSE=$(curl -s -X POST "$BASE_URL/sendMessage" \
    -H "Content-Type: application/json" \
    -d "{
      \"chat_id\": $CHAT_ID,
      \"text\": $(echo "$MESSAGE" | jq -Rs .),
      \"parse_mode\": \"$PARSE_MODE\",
      \"disable_notification\": $SILENT
    }")
fi

OK=$(echo "$RESPONSE" | jq -r '.ok')
if [[ "$OK" == "true" ]]; then
  MSG_ID=$(echo "$RESPONSE" | jq -r '.result.message_id')
  echo "✅ Mensagem enviada! ID: $MSG_ID"
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) | telegram_sent | chat=$CHAT_ID | msg_id=$MSG_ID" >> /workspace/MEMORY.md
else
  echo "❌ Erro: $(echo "$RESPONSE" | jq -r '.description')"
  exit 1
fi
