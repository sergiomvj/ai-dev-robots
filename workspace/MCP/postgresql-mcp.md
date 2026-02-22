# 🔧 MCP: PostgreSQL

**Nome:** `@modelcontextprotocol/server-postgres`  
**Função:** Acesso direto ao banco PostgreSQL via MCP  
**Status:** Disponível

---

## Instalação

```bash
npm install -g @modelcontextprotocol/server-postgres
```

## Configuração

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost:5432/openclaw_db"
      }
    }
  }
}
```

## Capacidades

- ✅ Executar queries SELECT
- ✅ Listar tabelas e schemas
- ✅ Descrever estrutura de tabelas
- ⚠️ INSERT/UPDATE/DELETE (requer confirmação)
- ❌ DROP TABLE (bloqueado por padrão)

## Tabelas principais

| Tabela | Descrição |
|---|---|
| `agents` | Registro dos agentes |
| `tasks` | Tarefas e status |
| `projects` | Projetos ativos |
| `memory_logs` | Histórico de ações |
| `heartbeats` | Logs de heartbeat |

## Uso pelo agente David

```sql
-- Ver tarefas pendentes
SELECT * FROM tasks WHERE status = 'pending' ORDER BY priority DESC;

-- Registrar conclusão
UPDATE tasks SET status = 'done', completed_at = NOW() WHERE id = $1;
```
