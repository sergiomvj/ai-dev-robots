# 🔧 MCP: GitHub

**Nome:** `@modelcontextprotocol/server-github`  
**Função:** Integração completa com GitHub via MCP  
**Status:** Disponível

---

## Instalação

```bash
npm install -g @modelcontextprotocol/server-github
```

## Configuração

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_seu_token"
      }
    }
  }
}
```

## Capacidades

- ✅ Listar repositórios (100+ repos fbrapps)
- ✅ Criar/atualizar arquivos
- ✅ Criar branches e PRs
- ✅ Gerenciar issues
- ✅ Verificar workflows de CI/CD
- ✅ Ler conteúdo de arquivos

## Ferramentas disponíveis

| Tool | Descrição |
|---|---|
| `create_or_update_file` | Criar/editar arquivo no repo |
| `search_repositories` | Buscar repositórios |
| `create_issue` | Criar issue |
| `create_pull_request` | Abrir PR |
| `fork_repository` | Forkar repositório |
| `get_file_contents` | Ler arquivo |

## Uso principal
Utilizado primariamente pelo agente **David Novaes** para gestão dos 100+ repositórios da organização fbrapps.
