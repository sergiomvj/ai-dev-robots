# 🔌 CONNECTOR: Telegram Bot API

**Serviço:** Telegram  
**Bot:** @openclaw_bot (Team AI-Dev Facebrasil)  
**Endpoint:** `https://api.telegram.org/bot{TOKEN}`

---

## Variáveis de ambiente

```bash
TELEGRAM_BOT_TOKEN=8130441639:AAGGAoQuKZ8md22IHIpp__6LcgsP_G7emKM
TELEGRAM_SERGIO_ID=861952660
TELEGRAM_GROUP_ID=-1001234567890  # Atualizar com ID real do grupo
```

## Envio básico

```bash
# Mensagem simples
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
  -d "chat_id=$TELEGRAM_SERGIO_ID" \
  -d "text=Mensagem de teste" \
  -d "parse_mode=Markdown"

# Enviar documento
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendDocument" \
  -F "chat_id=$TELEGRAM_SERGIO_ID" \
  -F "document=@/path/to/file.pdf" \
  -F "caption=Relatório em anexo"
```

## Script wrapper

```bash
bash /workspace/Scripts/send-telegram.sh \
  --to sergio \
  --message "✅ Tarefa concluída"
```

## Parse Mode: Markdown

```
*negrito* _itálico_ `código`
[Link](https://url.com)
```

## Receber mensagens (webhook)

```bash
# Configurar webhook
curl "https://api.telegram.org/bot$TOKEN/setWebhook?url=https://dashboard.fbrapps.com/webhook/telegram"
```
