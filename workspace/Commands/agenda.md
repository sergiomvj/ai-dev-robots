# 📅 /agenda

**Categoria:** Produtividade  
**Conector necessário:** `Connectors/google-calendar-connector.md`  
**Tempo estimado:** 15–30 segundos

---

## Descrição
Consulta eventos do Google Calendar para um período específico. Útil para planejamento de tarefas, evitar conflitos de horário e gerar briefings diários.

---

## Parâmetros

| Parâmetro | Padrão | Descrição |
|---|---|---|
| `--period` | today | Período: `today`, `tomorrow`, `week`, `custom` |
| `--start` | — | Data início (formato: YYYY-MM-DD) |
| `--end` | — | Data fim (formato: YYYY-MM-DD) |
| `--calendar` | primary | ID do calendário |
| `--format` | summary | Saída: `summary`, `full`, `json` |

---

## Como usar

### Ver agenda de hoje
```bash
bash /workspace/Scripts/check-agenda.sh
```

### Ver agenda da semana
```bash
bash /workspace/Scripts/check-agenda.sh --period week
```

### Ver agenda de período personalizado
```bash
bash /workspace/Scripts/check-agenda.sh \
  --period custom \
  --start 2026-03-01 \
  --end 2026-03-07
```

### Saída em JSON (para processamento)
```bash
bash /workspace/Scripts/check-agenda.sh --format json
```

---

## Exemplo de saída (summary)
```
📅 AGENDA — Domingo, 22 Fev 2026

09:00 - 10:00  Reunião de planejamento semanal (Google Meet)
11:30 - 12:00  Call com cliente FaceBrasil
14:00 - 15:30  Revisão de código com David
18:00          Lembrete: Backup semanal VPS

Total: 4 eventos
```

---

## Integração com outros comandos
- Combine com `Hooks/before-meeting.md` para preparar briefings automáticos
- Combine com `Commands/send-telegram.md` para notificações de lembretes
- Use com `Hooks/daily-briefing.md` para o relatório matinal automático
