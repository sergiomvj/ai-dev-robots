#!/bin/bash
# =============================================================
# heartbeat.sh — Enviar heartbeat de agente para o dashboard
# Uso: bash heartbeat.sh --agent "chiara" --status "active"
# Executar via cron a cada 5 minutos
# =============================================================

: "${DASHBOARD_API_URL:=http://localhost:3001}"
: "${DASHBOARD_JWT_TOKEN:?DASHBOARD_JWT_TOKEN não configurado}"

AGENT_NAME=""
STATUS="active"
TASK_COUNT=0
NOTES=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --agent) AGENT_NAME="$2"; shift 2 ;;
    --status) STATUS="$2"; shift 2 ;;
    --tasks) TASK_COUNT="$2"; shift 2 ;;
    --notes) NOTES="$2"; shift 2 ;;
    *) shift ;;
  esac
done

[[ -z "$AGENT_NAME" ]] && { echo "❌ --agent é obrigatório"; exit 1; }

TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

PAYLOAD=$(jq -n \
  --arg agent "$AGENT_NAME" \
  --arg status "$STATUS" \
  --argjson tasks "$TASK_COUNT" \
  --arg notes "$NOTES" \
  --arg ts "$TIMESTAMP" \
  '{agent: $agent, status: $status, active_tasks: $tasks, notes: $notes, timestamp: $ts}')

RESPONSE=$(curl -s -X POST "$DASHBOARD_API_URL/api/agents/$AGENT_NAME/heartbeat" \
  -H "Authorization: Bearer $DASHBOARD_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

OK=$(echo "$RESPONSE" | jq -r '.success // false')
if [[ "$OK" == "true" ]]; then
  echo "💓 [$TIMESTAMP] Heartbeat enviado: $AGENT_NAME ($STATUS)"
else
  echo "⚠️ Heartbeat falhou: $(echo "$RESPONSE" | jq -r '.error // "erro desconhecido"')"
fi
