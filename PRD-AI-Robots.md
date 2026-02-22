# PRD — OpenClaw Dashboard (Next.js)
**Versão:** 1.0 · **Data:** 2026-02-22 · **Owner:** Sergio Castro

---

## 1. CONTEXTO

Dashboard de controle central para o sistema multi-agente OpenClaw rodando em VPS (76.13.168.223).
Atualmente existe um `index.html` estático em `/home/openclaw/openclaw-dashboard/` servido pelo Node.js (`api.mjs`).

**Objetivo:** Migrar para Next.js App Router com API Routes reais conectadas ao PostgreSQL existente.

---

## 2. STACK TÉCNICA

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Banco | PostgreSQL (já instalado na VPS) |
| ORM | Prisma |
| Auth | JWT (jose) + middleware Next.js |
| Estilo | Tailwind CSS + CSS Variables |
| Fonte | Inter (Google Fonts) |
| Deploy | pm2 na VPS (porta 8080) |
| Reverse proxy | Nginx (já configurado) |

---

## 3. ESTRUTURA DE PASTAS

```
openclaw-dashboard/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    → redirect para /dashboard
│   ├── login/
│   │   └── page.tsx
│   └── dashboard/
│       ├── layout.tsx              → sidebar + topbar + auth guard
│       ├── page.tsx                → overview
│       ├── agents/
│       │   └── page.tsx
│       ├── tasks/
│       │   └── page.tsx
│       ├── projects/
│       │   └── page.tsx
│       ├── logs/
│       │   └── page.tsx
│       ├── backups/
│       │   └── page.tsx
│       └── config/
│           └── page.tsx
├── app/api/
│   ├── auth/
│   │   ├── login/route.ts          → POST → retorna JWT
│   │   └── me/route.ts             → GET → valida token
│   ├── agents/
│   │   ├── route.ts                → GET (lista) / POST (criar)
│   │   └── [id]/
│   │       └── route.ts            → GET / PATCH / DELETE
│   ├── heartbeat/
│   │   └── [name]/
│   │       └── route.ts            → POST → atualiza last_seen
│   ├── tasks/
│   │   ├── route.ts                → GET / POST
│   │   └── [id]/
│   │       └── route.ts            → PATCH / DELETE
│   ├── projects/
│   │   ├── route.ts                → GET / POST
│   │   └── [id]/route.ts
│   ├── logs/
│   │   └── route.ts                → GET (paginado, filtro por agente)
│   ├── workspace/
│   │   ├── route.ts                → GET (lista arquivos reais do FS)
│   │   └── [folder]/
│   │       ├── route.ts            → POST (criar arquivo)
│   │       └── [file]/
│   │           └── route.ts        → GET (ler) / PUT (editar) / DELETE
│   └── backups/
│       └── route.ts                → GET lista / POST trigger manual
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── NavItem.tsx
│   ├── agents/
│   │   ├── AgentCard.tsx
│   │   ├── AgentModal.tsx
│   │   └── TeamBadge.tsx
│   ├── workspace/
│   │   ├── FolderCard.tsx
│   │   ├── FileItem.tsx
│   │   ├── FileModal.tsx
│   │   └── AddFileModal.tsx
│   ├── tasks/
│   │   ├── TaskList.tsx
│   │   └── TaskItem.tsx
│   ├── ui/
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Toggle.tsx
│   │   └── StatCard.tsx
│   └── logs/
│       └── LogStream.tsx           → SSE / polling
├── lib/
│   ├── db.ts                       → Prisma client singleton
│   ├── auth.ts                     → JWT sign/verify (jose)
│   ├── workspace.ts                → helpers para ler/escrever /home/openclaw/workspace
│   └── toast.ts                    → context de toasts
├── hooks/
│   ├── useAgents.ts                → SWR fetch /api/agents
│   ├── useTasks.ts
│   └── useLogs.ts                  → SSE ou polling
├── prisma/
│   └── schema.prisma
├── middleware.ts                   → proteção de rotas /dashboard/*
├── .env.local                      → variáveis de ambiente
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4. BANCO DE DADOS — SCHEMA PRISMA

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Agent {
  id          String   @id @default(cuid())
  name        String   @unique
  role        String
  description String?
  avatar      String   @default("🤖")
  model       String   @default("google/gemini-2.5-flash-lite")
  status      String   @default("offline") // online | busy | idle | offline
  teams       String[] // ["core","backend"]
  commands    String[] // ["email","notify"]
  lastSeen    DateTime?
  uptime      Float    @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tasks       Task[]
  logs        Log[]
  heartbeats  Heartbeat[]
}

model Team {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  color       String   @default("#4f8ef7")
  icon        String   @default("⬡")
  createdAt   DateTime @default(now())
}

model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      String   @default("open") // open | in_progress | blocked | done
  priority    String   @default("medium") // high | medium | low
  agentId     String?
  agent       Agent?   @relation(fields: [agentId], references: [id])
  projectId   String?
  project     Project? @relation(fields: [projectId], references: [id])
  dueAt       DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      String   @default("active") // active | sprint | paused | done
  progress    Int      @default(0) // 0-100
  color       String   @default("#4f8ef7")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tasks       Task[]
}

model Log {
  id        String   @id @default(cuid())
  level     String   @default("INFO") // INFO | OK | WARN | ERR
  message   String
  agentId   String?
  agent     Agent?   @relation(fields: [agentId], references: [id])
  meta      Json?
  createdAt DateTime @default(now())
}

model Heartbeat {
  id        String   @id @default(cuid())
  agentId   String
  agent     Agent    @relation(fields: [agentId], references: [id])
  status    String   @default("ok")
  createdAt DateTime @default(now())
}

model Backup {
  id        String   @id @default(cuid())
  name      String
  path      String
  sizeBytes Int      @default(0)
  type      String   @default("auto") // auto | manual
  createdAt DateTime @default(now())
}

model Config {
  id    String @id @default(cuid())
  key   String @unique
  value String
}
```

---

## 5. VARIÁVEIS DE AMBIENTE

```env
# .env.local

# Banco
DATABASE_URL="postgresql://postgres:SENHA@localhost:5432/openclaw"

# Auth
JWT_SECRET="gerar-com-openssl-rand-hex-32"
JWT_EXPIRES_IN="7d"

# Admin
ADMIN_EMAIL="sergio@fbrapps.com"
ADMIN_PASSWORD="senha-segura"

# Workspace
WORKSPACE_PATH="/home/openclaw/workspace"

# Dashboard
NEXT_PUBLIC_APP_NAME="AI Robot Control"
NEXT_PUBLIC_APP_URL="https://dashboard.fbrapps.com"
```

---

## 6. API ROUTES — CONTRATOS

### POST /api/auth/login
```json
// Request
{ "email": "sergio@fbrapps.com", "password": "..." }

// Response 200
{ "token": "eyJ...", "expiresAt": "2026-03-01T..." }

// Response 401
{ "error": "Credenciais inválidas" }
```

### GET /api/agents
```json
// Response 200
[
  {
    "id": "clx...",
    "name": "Chiara Garcia",
    "role": "orchestrator",
    "status": "online",
    "teams": ["core","backend"],
    "commands": ["email","notify","agenda"],
    "lastSeen": "2026-02-22T09:41:00Z",
    "uptime": 99.8
  }
]
```

### POST /api/heartbeat/:name
```json
// Request (enviado pelo heartbeat.sh)
{
  "status": "ok",
  "token": "TOKEN_DO_AGENTE"
}

// Response 200
{ "received": true, "timestamp": "2026-02-22T09:41:00Z" }
```

### GET /api/workspace
```json
// Response 200
{
  "Commands": ["/email.md", "/inbox.md", "/agenda.md", "/notify.md", "/github.md", "/report.md"],
  "Skills": ["web-scraping.md", "code-review.md", "copywriting.md", "postgresql-ops.md"],
  "Hooks": ["email-to-task.md", "daily-briefing.md", "agent-failure-recovery.md"],
  "Scripts": ["send-email.sh", "send-telegram.sh", "heartbeat.sh"],
  "Connectors": ["gmail-connector.md", "github-connector.md", "telegram-connector.md", "openrouter-connector.md"],
  "MCP": ["filesystem-mcp.md", "postgresql-mcp.md", "github-mcp.md"]
}
```

### GET /api/workspace/:folder/:file
```json
// Response 200
{ "name": "/email.md", "content": "# 📧 /email\n\n..." }
```

### POST /api/workspace/:folder
```json
// Request
{ "name": "/deploy.md", "content": "# /deploy\n\n..." }

// Response 201
{ "created": true, "path": "/home/openclaw/workspace/Commands/deploy.md" }
```

### GET /api/logs?limit=50&agent=chiara&level=WARN
```json
// Response 200
{
  "logs": [
    { "id": "...", "level": "OK", "message": "push concluído", "agent": "David", "createdAt": "..." }
  ],
  "total": 1240
}
```

---

## 7. MIDDLEWARE DE AUTENTICAÇÃO

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
    || req.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/agents/:path*', '/api/tasks/:path*',
            '/api/projects/:path*', '/api/logs/:path*', '/api/workspace/:path*',
            '/api/backups/:path*']
}
```

---

## 8. DEPLOY NA VPS

```bash
# 1. Na VPS — instalar dependências
cd /home/openclaw/openclaw-dashboard
npm install

# 2. Gerar Prisma client e rodar migrations
npx prisma generate
npx prisma migrate deploy

# 3. Seed inicial (agentes, times, config)
npx prisma db seed

# 4. Build
npm run build

# 5. PM2
pm2 delete openclaw-dashboard 2>/dev/null
pm2 start npm --name "openclaw-dashboard" -- start
pm2 save

# 6. Nginx já aponta para porta 8080 (sem mudança)
```

---

## 9. ATUALIZAÇÃO DO heartbeat.sh

```bash
# O script atual deve POSTAR para a API Next.js
# Alterar a URL em /home/openclaw/workspace/Scripts/heartbeat.sh

API_URL="https://dashboard.fbrapps.com/api/heartbeat"
AGENT_TOKEN="${AGENT_TOKEN:-token-do-agente}"

curl -s -X POST "${API_URL}/${AGENT_NAME}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AGENT_TOKEN}" \
  -d '{"status":"ok"}' \
  >> /tmp/heartbeat.log 2>&1
```

---

## 10. DESIGN SYSTEM

### Cores (CSS Variables — já definidas no HTML atual)
```css
--bg: #07080d
--accent: #4f8ef7      /* azul principal */
--accent2: #7b5ef8     /* roxo */
--accent3: #3dd68c     /* verde online */
--warn: #f7a94f        /* laranja */
--danger: #f75454      /* vermelho */
```

### Times
| Slug | Nome | Cor |
|------|------|-----|
| core | Core | #4f8ef7 |
| backend | Backend Dev | #7b5ef8 |
| frontend | Frontend | #3dd68c |
| marketing | Marketing | #f7a94f |

### Tipografia
- Fonte: **Inter** (Google Fonts)
- Títulos: 800 weight
- Labels: 600 weight, uppercase, letter-spacing
- Código/mono: monospace nativo

---

## 11. FUNCIONALIDADES POR PÁGINA

### /dashboard (Overview)
- Stats: agentes online, tarefas, projetos, repos GitHub
- Feed de atividade recente (últimos 10 logs)
- Painel de heartbeats com countdown ao vivo

### /dashboard/agents
- 3 subtabs: Agentes | Workspace | Times
- Filtro por time (pills)
- CRUD completo de agentes
- Workspace: leitura/escrita real em `/home/openclaw/workspace`
- Times: CRUD de times

### /dashboard/tasks
- Lista com filtro por agente e prioridade
- Checkbox funcional (atualiza status no banco)
- CRUD de tarefas

### /dashboard/projects
- Grid de projetos com barra de progresso
- CRUD de projetos

### /dashboard/logs
- Stream via polling (GET /api/logs a cada 2s)
- Filtro por agente e nível
- Botão pausar/limpar

### /dashboard/backups
- Lista backups do banco (lê `/backups/` real)
- Trigger de backup manual (executa script bash)
- Download de arquivo

### /dashboard/config
- Lê/escreve tabela `Config` no banco
- Toggles com persistência

---

## 12. ORDEM DE IMPLEMENTAÇÃO (sugerida ao Antigravity)

1. Setup Next.js + Tailwind + Prisma
2. Schema + migrations + seed
3. Middleware de auth + página de login
4. Layout (sidebar + topbar) com navegação
5. API Routes: agents, heartbeat, workspace
6. Páginas: Overview, Agents, Workspace
7. API Routes: tasks, projects, logs
8. Páginas: Tasks, Projects, Logs
9. Backups + Config
10. Deploy na VPS + atualizar heartbeat.sh

---

## 13. ARQUIVOS QUE JÁ EXISTEM NA VPS

| Arquivo | Caminho | Status |
|---------|---------|--------|
| index.html | /home/openclaw/openclaw-dashboard/index.html | Substituir pelo Next.js |
| api.mjs | /home/openclaw/openclaw-dashboard/api.mjs | Substituir pelas API Routes |
| workspace/ | /home/openclaw/workspace/ | Manter — Next.js lê direto |
| PostgreSQL | localhost:5432 | Manter — Prisma conecta |
| Nginx | /etc/nginx/sites-enabled/ | Manter — sem mudança |
