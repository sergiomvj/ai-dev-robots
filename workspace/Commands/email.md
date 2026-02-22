# 📧 /email

**Categoria:** Comunicação  
**Conector necessário:** `Connectors/gmail-connector.md` ou `Connectors/smtp-connector.md`  
**Tempo estimado:** 1–3 minutos

---

## Descrição
Envia um email via Gmail API ou SMTP. Ideal para notificações, relatórios automáticos ou comunicação com clientes.

---

## Parâmetros necessários

| Parâmetro | Obrigatório | Descrição |
|---|---|---|
| `TO` | ✅ | Endereço de destino |
| `SUBJECT` | ✅ | Assunto do email |
| `BODY` | ✅ | Corpo da mensagem (texto ou HTML) |
| `CC` | ❌ | Cópia para outros destinatários |
| `ATTACHMENT` | ❌ | Caminho do arquivo a anexar |

---

## Como usar

### Passo 1 — Verificar conector
```bash
cat /workspace/Connectors/gmail-connector.md
# Confirme que GMAIL_CLIENT_ID e GMAIL_CLIENT_SECRET estão configurados
```

### Passo 2 — Executar o script
```bash
bash /workspace/Scripts/send-email.sh \
  --to "destinatario@email.com" \
  --subject "Assunto do email" \
  --body "Corpo da mensagem"
```

### Passo 3 — Confirmar envio
```bash
# O script retorna o ID da mensagem enviada
# Ex: Message-ID: <abc123@gmail.com>
# Guarde esse ID para rastreamento
```

---

## Exemplo completo
```bash
bash /workspace/Scripts/send-email.sh \
  --to "cliente@empresa.com" \
  --cc "sergio@fbrapps.com" \
  --subject "Relatório Semanal - Semana 8" \
  --body "Olá, segue em anexo o relatório desta semana." \
  --attachment "/tmp/relatorio.pdf"
```

---

## Possíveis erros

| Erro | Causa | Solução |
|---|---|---|
| `auth_error` | Token expirado | Renovar token via `Scripts/refresh-gmail-token.sh` |
| `quota_exceeded` | Limite diário atingido | Aguardar ou usar SMTP alternativo |
| `invalid_recipient` | Email inválido | Validar endereço antes de enviar |

---

## Notas
- Limite diário Gmail API: 10.000 mensagens
- Para HTML, adicione `--format html` ao comando
