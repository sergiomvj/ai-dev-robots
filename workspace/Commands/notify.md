# 💬 /notify

**Categoria:** Comunicação  
**Conector necessário:** `Connectors/telegram-connector.md`  
**Tempo estimado:** 5 segundos

---

## Descrição
Envia mensagens, alertas e relatórios via Telegram. Suporta texto simples, Markdown, e envio de arquivos. Principal canal de comunicação entre agentes e o Sergio.

---

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|---|---|---|
| `--chat-id` | ✅ | ID do chat ou grupo |
| `--message` | ✅ | Texto da mensagem |
| `--format` | ❌ | `text` ou `markdown` (padrão: markdown) |
| `--file` | ❌ | Caminho de arquivo para enviar |
| `--silent` | ❌ | Envia sem notificação sonora |

---

## IDs configurados

```bash
SERGIO_ID=861952660
TEAM_GROUP_ID=-1001234567890  # Grupo "Team AI-Dev Facebrasil"
```

---

## Como usar

### Notificação simples para Sergio
```bash
bash /workspace/Scripts/send-telegram.sh \
  --chat-id $SERGIO_ID \
  --message "✅ Tarefa concluída: Deploy realizado com sucesso"
```

### Alerta no grupo da equipe
```bash
bash /workspace/Scripts/send-telegram.sh \
  --chat-id $TEAM_GROUP_ID \
  --message "⚠️ *ALERTA*: Erro detectado no servidor. Chiara assumindo controle."
```

### Enviar arquivo/relatório
```bash
bash /workspace/Scripts/send-telegram.sh \
  --chat-id $SERGIO_ID \
  --file "/tmp/relatorio-semana8.pdf" \
  --message "📊 Relatório semanal em anexo"
```

---

## Templates de mensagem

```bash
# Heartbeat padrão
"🤖 [AGENTE] — Heartbeat OK | $(date '+%H:%M') | Tarefas ativas: N"

# Conclusão de tarefa
"✅ [TAREFA] concluída por [AGENTE] em [TEMPO]"

# Erro crítico
"🚨 ERRO CRÍTICO em [SISTEMA]: [DESCRIÇÃO]. Ação requerida."
```
