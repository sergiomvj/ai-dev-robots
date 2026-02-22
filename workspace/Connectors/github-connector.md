# 🔌 CONNECTOR: GitHub API

**Serviço:** GitHub  
**Autenticação:** Personal Access Token (PAT)  
**Organização:** fbrapps (100+ repositórios)

---

## Variáveis de ambiente necessárias

```bash
GITHUB_TOKEN=ghp_seu_token_aqui
GITHUB_ORG=fbrapps
GITHUB_USER=seu_usuario
```

## Setup

```bash
# 1. Gerar token em: https://github.com/settings/tokens
# Permissões necessárias: repo, workflow, read:org

# 2. Configurar git globalmente
git config --global user.email "agente@fbrapps.com"
git config --global user.name "AI Agent"

# 3. Autenticar CLI
echo $GITHUB_TOKEN | gh auth login --with-token

# 4. Testar
gh api /user
```

## Endpoints mais usados

```bash
# Listar repos da organização
gh api /orgs/$GITHUB_ORG/repos --paginate

# Criar PR
gh pr create --title "título" --body "descrição" --base main

# Verificar status de CI
gh run list --repo $GITHUB_ORG/repo-name

# Criar issue
gh issue create --title "bug" --body "descrição"
```

## Protocolo anti-alucinação

```bash
# SEMPRE verificar que o repo existe antes de reportar conclusão
gh api /repos/$GITHUB_ORG/REPO_NAME --silent && echo "EXISTS" || echo "NOT FOUND"
```
