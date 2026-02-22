# 🔧 MCP: Filesystem

**Nome:** `@modelcontextprotocol/server-filesystem`  
**Função:** Acesso controlado ao sistema de arquivos  
**Status:** Disponível

---

## Instalação

```bash
npm install -g @modelcontextprotocol/server-filesystem
```

## Configuração no openclaw.yaml

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/workspace",
        "/home/agents"
      ]
    }
  }
}
```

## Capacidades

- ✅ Ler arquivos
- ✅ Escrever arquivos
- ✅ Listar diretórios
- ✅ Criar/deletar arquivos
- ❌ Acesso fora dos diretórios configurados

## Diretórios permitidos

| Diretório | Agentes com acesso |
|---|---|
| `/workspace` | Todos |
| `/workspace/Scripts` | David, Chiara |
| `/backups` | Chiara apenas |

## Segurança
Sempre configure apenas os diretórios mínimos necessários. Nunca exponha `/` ou `/etc`.
