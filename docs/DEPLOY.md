# Deploy OpenClaw Dashboard na VPS

## Pré-requisitos
- Ubuntu 22.04 LTS
- Docker + Docker Compose instalados
- Acesso SSH à VPS
- Domínio apontando para o IP da VPS (ex: `dashboard.fbrapps.com`)

---

## 1. Clonar o repositório na VPS

```bash
ssh user@vps-ip
git clone git@github.com:seu-usuario/1-AI-Dev-Files.git /opt/openclaw
cd /opt/openclaw
```

## 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
nano .env
```

Preencha **todas** as variáveis:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | String aleatória forte (min 32 chars) |
| `JWT_EXPIRES_IN` | Tempo de expiração (ex: `7d`) |
| `ADMIN_EMAIL` | Email de login do admin |
| `ADMIN_PASSWORD` | Senha do admin |
| `WORKSPACE_PATH` | Path da workspace no VPS |
| `NEXT_PUBLIC_APP_URL` | URL pública do dashboard |

## 3. Build da imagem Docker

```bash
docker build -t openclaw-dashboard .
```

## 4. Criar o banco PostgreSQL (se não existir)

```bash
docker run -d \
  --name openclaw-postgres \
  --restart unless-stopped \
  -e POSTGRES_DB=openclaw \
  -e POSTGRES_USER=openclaw \
  -e POSTGRES_PASSWORD=SUA_SENHA \
  -v openclaw_pgdata:/var/lib/postgresql/data \
  postgres:15-alpine
```

## 5. Executar migrações e seed

```bash
docker run --rm \
  --env-file .env \
  --network host \
  openclaw-dashboard \
  npx prisma migrate deploy

docker run --rm \
  --env-file .env \
  --network host \
  openclaw-dashboard \
  npm run db:seed
```

## 6. Rodar o container da aplicação

```bash
docker run -d \
  --name openclaw-dashboard \
  --restart unless-stopped \
  --env-file .env \
  -p 3000:3000 \
  -v /home/openclaw/workspace:/home/openclaw/workspace:ro \
  openclaw-dashboard
```

## 7. Configurar Nginx como reverse proxy

```nginx
server {
    listen 80;
    server_name dashboard.fbrapps.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name dashboard.fbrapps.com;

    ssl_certificate /etc/letsencrypt/live/dashboard.fbrapps.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dashboard.fbrapps.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Instalar certbot e gerar certificado
apt install certbot python3-certbot-nginx -y
certbot --nginx -d dashboard.fbrapps.com
```

## 8. Atualizar o deploy (após mudanças)

```bash
git pull
docker build -t openclaw-dashboard .
docker stop openclaw-dashboard && docker rm openclaw-dashboard
# Repetir o comando do passo 6
```

---

## Estrutura de Arquivos no VPS

```
/opt/openclaw/          ← código da aplicação
/home/openclaw/workspace/
  ├── Commands/
  ├── Skills/
  ├── Hooks/
  ├── Scripts/
  ├── Connectors/
  └── MCP/
/backups/               ← arquivos de backup do PostgreSQL
```
