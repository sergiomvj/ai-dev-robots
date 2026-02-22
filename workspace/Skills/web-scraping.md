# 🕷️ SKILL: Web Scraping com Firecrawl
> **Extrai conteúdo estruturado de qualquer página web usando o Firecrawl local.**

---

## Parâmetros

- **URL alvo** — página a ser raspada
- **Modo** — `scrape` (página única) ou `crawl` (site completo)
- **Formato** — `markdown`, `html`, `json`

## Como usar

```bash
# Scrape de página única
curl -X POST http://localhost:3002/v1/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://exemplo.com", "formats": ["markdown"]}'

# Crawl de site completo (até 10 páginas)
curl -X POST http://localhost:3002/v1/crawl \
  -H "Content-Type: application/json" \
  -d '{"url": "https://exemplo.com", "limit": 10}'
```

## Casos de uso
- Monitorar preços de concorrentes
- Extrair dados de portais de notícias
- Coletar leads de páginas públicas
- Verificar conteúdo de páginas para análise

## Limitações
- Não funciona em páginas com login sem autenticação configurada
- Sites com proteção anti-bot podem bloquear requisições
- Respeite robots.txt e termos de uso dos sites

## Dependências
- Firecrawl rodando em `localhost:3002`
- Conector: `Connectors/firecrawl-connector.md`
