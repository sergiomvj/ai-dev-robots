# 📊 /report

**Categoria:** Produtividade / Gestão  
**Conector necessário:** Depende do destino (Gmail, Telegram, Notion)  
**Tempo estimado:** 2–10 minutos

---

## Descrição
Gera relatórios padronizados de atividades, progresso de projetos ou análises. Pode ser enviado por email, Telegram ou salvo no Notion.

---

## Tipos de relatório

| Tipo | Descrição |
|---|---|
| `daily` | Resumo das atividades do dia |
| `weekly` | Relatório semanal consolidado |
| `project` | Status de um projeto específico |
| `error` | Log de erros e incidentes |
| `performance` | Métricas de performance dos agentes |

---

## Como usar

### Relatório diário (automático, todo dia às 18h via Hook)
```bash
bash /workspace/Scripts/generate-report.sh --type daily
```

### Relatório de projeto
```bash
bash /workspace/Scripts/generate-report.sh \
  --type project \
  --project "dashboard-openclaw" \
  --output telegram
```

### Relatório semanal com envio por email
```bash
bash /workspace/Scripts/generate-report.sh \
  --type weekly \
  --output email \
  --to "sergio@fbrapps.com"
```

---

## Estrutura padrão do relatório

```markdown
# 📊 [TIPO] — [PERÍODO]
**Gerado por:** [AGENTE]  
**Data:** [DATA]

## ✅ Concluído
- Item 1
- Item 2

## 🔄 Em progresso
- Item em andamento (X% concluído)

## ⚠️ Bloqueios / Problemas
- Problema identificado: descrição

## 📈 Métricas
- Tarefas concluídas: N
- Tempo médio por tarefa: Xmin
- Taxa de sucesso: X%

## 🎯 Próximos passos
- Próxima ação planejada
```
