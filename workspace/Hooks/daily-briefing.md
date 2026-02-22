# 🔗 HOOK: Briefing Diário Automático

**Trigger:** Todo dia às 08:00 (cron)  
**Ação:** Gerar e enviar briefing completo do dia  
**Agente responsável:** Chiara (Orquestradora)

---

## Fluxo

```
08:00 — Cron dispara
      ↓
Chiara acorda → verifica saúde do sistema
      ↓
Checar agenda do dia (Google Calendar)
      ↓
Checar emails não lidos importantes
      ↓
Verificar tarefas pendentes no dashboard
      ↓
Verificar status dos agentes
      ↓
Compilar briefing
      ↓
Enviar para Sergio via Telegram
      ↓
Postar resumo no grupo Team AI-Dev
```

---

## Configuração (crontab)

```bash
# Adicionar ao crontab do sistema
0 8 * * * bash /workspace/Scripts/daily-briefing.sh
```

---

## Template do briefing

```
🌅 *BOM DIA, SERGIO!*
📅 [DIA DA SEMANA], [DATA]

━━━━━━━━━━━━━━━━━━━━
📆 *AGENDA DE HOJE*
[eventos do dia]

━━━━━━━━━━━━━━━━━━━━
📬 *EMAILS IMPORTANTES* (últimas 12h)
[emails não lidos prioritários]

━━━━━━━━━━━━━━━━━━━━
✅ *TAREFAS PARA HOJE*
[tarefas do dashboard com prazo hoje]

━━━━━━━━━━━━━━━━━━━━
🤖 *STATUS DOS AGENTES*
• Chiara: ✅ Online
• David: ✅ Online  
• Lia: ✅ Online
• Mila: ✅ Online

━━━━━━━━━━━━━━━━━━━━
⚠️ *ALERTAS*
[problemas detectados, se houver]
```
