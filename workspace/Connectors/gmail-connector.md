# 🔌 CONNECTOR: Gmail API

**Serviço:** Google Gmail  
**Autenticação:** OAuth 2.0  
**Script base:** `Scripts/gmail-auth.sh`

---

## Variáveis de ambiente necessárias

```bash
GMAIL_CLIENT_ID=seu_client_id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=seu_client_secret
GMAIL_REFRESH_TOKEN=seu_refresh_token
GMAIL_USER=seu_email@gmail.com
```

## Setup inicial

```bash
# 1. Criar projeto no Google Cloud Console
# https://console.cloud.google.com/

# 2. Ativar Gmail API

# 3. Criar credenciais OAuth 2.0

# 4. Obter refresh token
bash /workspace/Scripts/gmail-auth.sh --setup

# 5. Testar conexão
bash /workspace/Scripts/gmail-auth.sh --test
```

## Endpoints principais

| Operação | Endpoint |
|---|---|
| Listar emails | `GET /gmail/v1/users/me/messages` |
| Ler email | `GET /gmail/v1/users/me/messages/{id}` |
| Enviar email | `POST /gmail/v1/users/me/messages/send` |
| Labels | `GET /gmail/v1/users/me/labels` |

## Limites
- 10.000 requisições/dia (quota padrão)
- 500 MB máximo por mensagem
