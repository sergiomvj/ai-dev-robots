# 🔗 HOOK: Email → Criar Tarefa

**Trigger:** Novo email recebido com tag `[TAREFA]` no assunto  
**Ação:** Criar tarefa no dashboard e notificar no Telegram  
**Agente responsável:** Chiara (Orquestradora)

---

## Fluxo

```
EMAIL RECEBIDO
      ↓
Verificar assunto contém "[TAREFA]" ?
      ↓ SIM
Extrair: título, prazo, prioridade, agente responsável
      ↓
Criar tarefa via API do dashboard
      ↓
Notificar Sergio no Telegram
      ↓
Notificar agente responsável no grupo
      ↓
Registrar em MEMORY.md
```

---

## Configuração

```json
{
  "hook_id": "email-to-task",
  "trigger": {
    "type": "email_received",
    "filter": {
      "subject_contains": "[TAREFA]",
      "from": "*"
    }
  },
  "actions": [
    {
      "step": 1,
      "action": "parse_email",
      "extract": ["title", "deadline", "priority", "assignee"]
    },
    {
      "step": 2,
      "action": "create_task",
      "api": "POST /api/tasks",
      "map": {"title": "email.title", "assignee": "email.assignee"}
    },
    {
      "step": 3,
      "action": "notify_telegram",
      "template": "📌 Nova tarefa criada: {title} → @{assignee}"
    }
  ]
}
```

---

## Formato do email para ativar o hook

```
Assunto: [TAREFA] Nome da tarefa
Para: agentes@fbrapps.com

PRIORIDADE: alta
RESPONSÁVEL: David
PRAZO: 2026-03-01

Descrição detalhada da tarefa aqui.
```
