# 📬 /inbox

**Categoria:** Comunicação  
**Conector necessário:** `Connectors/gmail-connector.md`  
**Tempo estimado:** 30 segundos

---

## Descrição
Verifica emails não lidos na caixa de entrada. Pode filtrar por remetente, assunto ou label. Ideal para monitoramento e triagem automática.

---

## Parâmetros opcionais

| Parâmetro | Padrão | Descrição |
|---|---|---|
| `--limit` | 10 | Número máximo de emails a retornar |
| `--from` | — | Filtrar por remetente |
| `--subject` | — | Filtrar por palavra no assunto |
| `--label` | INBOX | Label do Gmail (INBOX, SENT, etc.) |
| `--unread-only` | true | Mostrar apenas não lidos |

---

## Como usar

### Verificar inbox não lida (padrão)
```bash
bash /workspace/Scripts/check-email.sh
```

### Verificar emails de um remetente específico
```bash
bash /workspace/Scripts/check-email.sh --from "cliente@empresa.com"
```

### Buscar por assunto
```bash
bash /workspace/Scripts/check-email.sh --subject "urgente" --limit 5
```

### Ver todos os emails (incluindo lidos)
```bash
bash /workspace/Scripts/check-email.sh --unread-only false --limit 20
```

---

## Formato de saída
```json
{
  "total_unread": 3,
  "emails": [
    {
      "id": "msg_abc123",
      "from": "cliente@empresa.com",
      "subject": "Urgente: problema no sistema",
      "date": "2026-02-22T09:15:00Z",
      "snippet": "Bom dia, estamos enfrentando..."
    }
  ]
}
```

---

## Ações após verificar
- Para responder: use `Commands/reply-email.md`
- Para arquivar: use `Commands/archive-email.md`
- Para criar tarefa a partir do email: use `Hooks/email-to-task.md`
