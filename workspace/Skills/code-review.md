# 🔍 SKILL: Code Review Automatizado
> **Analisa código em busca de bugs, más práticas e sugestões de melhoria.**

---

## Parâmetros

- **Arquivo ou diretório** — caminho do código a revisar
- **Linguagem** — auto-detectada ou especificada
- **Nível** — `basic`, `standard`, `strict`

## Como usar

```bash
# Revisar arquivo único
bash /workspace/Scripts/code-review.sh --file src/app.js --level standard

# Revisar diretório completo
bash /workspace/Scripts/code-review.sh --dir ./src --lang javascript

# Revisar PR antes de merge
bash /workspace/Scripts/code-review.sh --pr 42 --repo fbrapps/dashboard
```

## O que é verificado
- ✅ Bugs potenciais e erros de lógica
- ✅ Segurança (injeção SQL, XSS, exposição de credenciais)
- ✅ Performance (loops desnecessários, queries N+1)
- ✅ Padrões de código (naming, estrutura, comentários)
- ✅ Cobertura de testes ausente

## Formato de saída
```json
{
  "score": 87,
  "issues": [
    {"severity": "high", "line": 42, "message": "SQL injection risco"},
    {"severity": "low", "line": 15, "message": "Variável não utilizada"}
  ],
  "suggestions": ["Adicionar tratamento de erro no bloco try/catch"]
}
```

## Responsável primário
David Novaes (Senior Programmer)
