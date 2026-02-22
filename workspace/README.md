# 📁 Workspace Compartilhada dos Agentes

Esta pasta contém recursos compartilhados por **todos os agentes** do sistema.  
Cada subpasta tem uma função específica e bem definida. Todos os agentes têm acesso de leitura.  
Apenas o Orquestrador (Chiara) tem permissão de escrita.

---

## 📂 Estrutura de Pastas

### `/Commands`
Comandos pré-formatados em Markdown para ações recorrentes e importantes.  
Cada arquivo é um guia passo-a-passo que o agente pode seguir como um roteiro.  
Use quando precisar realizar uma ação padronizada (ex: enviar email, checar agenda).

### `/Skills`
Descreve habilidades específicas que um agente pode dominar ou consultar.  
Cada arquivo tem um cabeçalho padrão curto descrevendo o que a skill faz.  
Use para ampliar as capacidades do agente sem repetir instruções longas.

### `/Hooks`
Define encadeamentos de ações — "quando acontecer X, faça Y".  
Permite que os agentes reajam automaticamente a eventos do sistema.  
Use para automações condicionais e fluxos reativos.

### `/Scripts`
Repositório central de todos os scripts utilizados nos workspaces dos agentes.  
Scripts referenciados em qualquer arquivo de workspace devem estar aqui.  
Nomeie com prefixo do agente quando for específico (ex: `david_git_sync.sh`).

### `/Connectors`
Arquivos de configuração e autenticação para APIs externas.  
Cada conector descreve como se conectar a um serviço (ex: Gmail, Notion, GitHub).  
Nunca exponha credenciais reais nos arquivos — use variáveis de ambiente.

### `/MCP`
Model Context Protocol — servidores e ferramentas MCP disponíveis para os agentes.  
Cada arquivo descreve um MCP, seus parâmetros e como ativá-lo.  
Use para expandir as capacidades dos agentes com ferramentas externas.

---

## 📋 Convenções

- Todos os arquivos devem ser `.md` (Markdown), `.sh` (Scripts) ou `.json` (Configs)
- Use nomes descritivos em `kebab-case`
- Inclua sempre uma seção **## Descrição** e **## Como usar** nos arquivos `.md`
- Scripts devem ter comentários explicativos no início

---

## 🔒 Permissões

| Papel | Leitura | Escrita |
|---|---|---|
| Chiara (Orquestradora) | ✅ | ✅ |
| David (Dev) | ✅ | Scripts apenas |
| Lia (Frontend) | ✅ | Scripts apenas |
| Mila (Marketing) | ✅ | ❌ |

---

*Última atualização: Fevereiro 2026*
