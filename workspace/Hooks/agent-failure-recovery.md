# 🔗 HOOK: Recuperação de Falha de Agente

**Trigger:** Agente não envia heartbeat por mais de 10 minutos  
**Ação:** Alerta imediato + tentativa de recuperação  
**Agente responsável:** Chiara (Orquestradora)

---

## Fluxo

```
Heartbeat ausente por 10min
      ↓
Chiara detecta ausência
      ↓
Tentar ping ao agente
      ↓ FALHA
Registrar incidente no dashboard
      ↓
Notificar Sergio com alerta CRÍTICO
      ↓
Reatribuir tarefas ativas do agente
      ↓
Tentar restart automático (3 tentativas)
      ↓ SUCESSO → Notificar recuperação
      ↓ FALHA → Escalar para intervenção manual
```

---

## Configuração

```json
{
  "hook_id": "agent-failure-recovery",
  "trigger": {
    "type": "heartbeat_missing",
    "threshold_minutes": 10,
    "agents": ["david", "lia", "mila"]
  },
  "actions": [
    {"step": 1, "action": "log_incident", "severity": "critical"},
    {"step": 2, "action": "notify_telegram", "chat": "SERGIO_ID",
     "message": "🚨 AGENTE {agent} NÃO RESPONDE há {minutes}min!"},
    {"step": 3, "action": "reassign_tasks", "to": "chiara"},
    {"step": 4, "action": "restart_agent", "max_attempts": 3, "interval": 60}
  ]
}
```

---

## Níveis de severidade

| Tempo sem heartbeat | Severidade | Ação |
|---|---|---|
| 5 min | ⚠️ Warning | Log interno |
| 10 min | 🔴 Critical | Alerta Telegram + reassign |
| 30 min | 🆘 Emergency | Escalar para Sergio |
