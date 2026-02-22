# 🐙 /github

**Categoria:** Desenvolvimento  
**Conector necessário:** `Connectors/github-connector.md`  
**Tempo estimado:** 30 segundos a 5 minutos

---

## Descrição
Centraliza as operações mais comuns no GitHub: criar branches, commits, pull requests, issues e sincronização de repositórios. Obrigatório seguir o protocolo de verificação antes de qualquer push.

---

## ⚠️ REGRA DE OURO
> **Nunca reportar como concluído sem verificar que o repositório existe e o push foi aceito.**  
> Sempre execute o passo de verificação ao final.

---

## Operações disponíveis

### 1. Clonar repositório
```bash
bash /workspace/Scripts/github-ops.sh clone \
  --repo "fbrapps/nome-do-repo" \
  --dir "/workspace/repos/nome-do-repo"
```

### 2. Criar branch e commitar
```bash
bash /workspace/Scripts/github-ops.sh commit \
  --repo "fbrapps/nome-do-repo" \
  --branch "feature/nova-funcionalidade" \
  --message "feat: adiciona nova funcionalidade X" \
  --files "src/arquivo.js"
```

### 3. Criar Pull Request
```bash
bash /workspace/Scripts/github-ops.sh pr \
  --repo "fbrapps/nome-do-repo" \
  --from "feature/nova-funcionalidade" \
  --to "main" \
  --title "Feature: Nova funcionalidade X" \
  --body "Descrição das mudanças"
```

### 4. Listar repositórios
```bash
bash /workspace/Scripts/github-ops.sh list-repos --org "fbrapps"
```

### 5. Verificar status (SEMPRE executar por último)
```bash
bash /workspace/Scripts/github-ops.sh verify \
  --repo "fbrapps/nome-do-repo" \
  --branch "feature/nova-funcionalidade" \
  --last-commit "abc123"
```

---

## Protocolo de verificação obrigatório

Após qualquer operação de escrita, execute:
```bash
# 1. Confirmar que o commit existe remotamente
gh api repos/fbrapps/REPO/commits/BRANCH --jq '.sha'

# 2. Registrar no MEMORY.md
echo "$(date) | github | OPERAÇÃO | REPO | STATUS" >> /workspace/MEMORY.md
```
