#!/bin/bash
# =============================================================
# send-email.sh — Enviar email via Gmail API
# Referenciado em: Commands/send-email.md
# Uso: bash send-email.sh --to "email" --subject "assunto" --body "corpo"
# =============================================================

set -e

# Verificar variáveis de ambiente
: "${GMAIL_CLIENT_ID:?GMAIL_CLIENT_ID não configurado}"
: "${GMAIL_CLIENT_SECRET:?GMAIL_CLIENT_SECRET não configurado}"  
: "${GMAIL_REFRESH_TOKEN:?GMAIL_REFRESH_TOKEN não configurado}"
: "${GMAIL_USER:?GMAIL_USER não configurado}"

# Defaults
TO=""
SUBJECT=""
BODY=""
CC=""
ATTACHMENT=""
FORMAT="text"

# Parse argumentos
while [[ $# -gt 0 ]]; do
  case $1 in
    --to) TO="$2"; shift 2 ;;
    --subject) SUBJECT="$2"; shift 2 ;;
    --body) BODY="$2"; shift 2 ;;
    --cc) CC="$2"; shift 2 ;;
    --attachment) ATTACHMENT="$2"; shift 2 ;;
    --format) FORMAT="$2"; shift 2 ;;
    *) echo "Argumento desconhecido: $1"; exit 1 ;;
  esac
done

# Validar obrigatórios
[[ -z "$TO" ]] && { echo "❌ --to é obrigatório"; exit 1; }
[[ -z "$SUBJECT" ]] && { echo "❌ --subject é obrigatório"; exit 1; }
[[ -z "$BODY" ]] && { echo "❌ --body é obrigatório"; exit 1; }

echo "📧 Enviando email para: $TO"
echo "📌 Assunto: $SUBJECT"

# Obter access token
ACCESS_TOKEN=$(curl -s -X POST https://oauth2.googleapis.com/token \
  -d "client_id=$GMAIL_CLIENT_ID" \
  -d "client_secret=$GMAIL_CLIENT_SECRET" \
  -d "refresh_token=$GMAIL_REFRESH_TOKEN" \
  -d "grant_type=refresh_token" | jq -r '.access_token')

# Montar email em base64
EMAIL_CONTENT="To: $TO\nSubject: $SUBJECT\nContent-Type: text/plain\n\n$BODY"
[[ -n "$CC" ]] && EMAIL_CONTENT="To: $TO\nCc: $CC\nSubject: $SUBJECT\nContent-Type: text/plain\n\n$BODY"

EMAIL_B64=$(echo -e "$EMAIL_CONTENT" | base64 -w 0)

# Enviar
RESPONSE=$(curl -s -X POST \
  "https://gmail.googleapis.com/gmail/v1/users/me/messages/send" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"raw\": \"$EMAIL_B64\"}")

MSG_ID=$(echo "$RESPONSE" | jq -r '.id // "erro"')

if [[ "$MSG_ID" != "erro" && "$MSG_ID" != "null" ]]; then
  echo "✅ Email enviado com sucesso! Message-ID: $MSG_ID"
  # Registrar em MEMORY.md
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) | email_sent | to=$TO | subject=$SUBJECT | id=$MSG_ID" >> /workspace/MEMORY.md
else
  echo "❌ Falha ao enviar email: $(echo "$RESPONSE" | jq -r '.error.message')"
  exit 1
fi
