# 🔌 CONNECTOR: OpenRouter API

**Serviço:** OpenRouter (multi-LLM gateway)  
**Modelos ativos:** Gemini 2.5 Flash Lite, Kimi K2.5  
**Endpoint:** `https://openrouter.ai/api/v1`

---

## Variáveis de ambiente

```bash
OPENROUTER_API_KEY=sk-or-seu_token_aqui
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

## Modelos configurados

| Alias | Model ID | Uso |
|---|---|---|
| Gemini | `google/gemini-2.5-flash-lite` | Primário (rápido) |
| Kimi | `moonshotai/kimi-k2.5` | Fallback |

## Como usar

```python
import openai

client = openai.OpenAI(
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1"
)

response = client.chat.completions.create(
    model="google/gemini-2.5-flash-lite",
    messages=[{"role": "user", "content": "Olá!"}]
)
```

```bash
# Via curl
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "google/gemini-2.5-flash-lite", "messages": [{"role": "user", "content": "test"}]}'
```

## Fallback automático

```json
{
  "model": "google/gemini-2.5-flash-lite",
  "route": "fallback",
  "models": ["google/gemini-2.5-flash-lite", "moonshotai/kimi-k2.5"]
}
```
