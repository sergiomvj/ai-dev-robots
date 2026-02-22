# OpenClaw Dashboard — Plano de Implementação Next.js

> **Versão:** 1.0 · **Data:** 2026-02-22 · **Owner:** Sergio Castro

Migrar o dashboard estático (`dashboard.html`) para Next.js 14 App Router, **sem alterar nada no visual ou na estrutura**, conectado ao PostgreSQL via Prisma, autenticação JWT, deploy via Docker em nova VPS.

---

## O que já está pronto ✅

| Arquivo | Status |
|---------|--------|
| `lib/db.ts`, `lib/auth.ts`, `lib/workspace.ts` | ✅ |
| `middleware.ts` | ✅ |
| `prisma/schema.prisma` + `seed.ts` | ✅ |
| `app/api/auth/login/route.ts` | ✅ |
| `app/api/agents/route.ts` (GET/POST) | ✅ |
| `app/api/heartbeat/[name]/route.ts` | ✅ |
| `app/api/logs/route.ts` (GET/POST) | ✅ |
| `app/api/workspace/route.ts` e `/[folder]/[file]/route.ts` | ✅ |

---

## O que precisa ser criado

### 1. Estilos Globais e Root
| Arquivo | Descrição |
|---------|-----------|
| `app/globals.css` | CSS variables idênticas ao dashboard.html (dark theme, Space Mono, Syne) |
| `app/layout.tsx` | Root layout com `<html lang="pt-BR">`, importa fontes e globals.css |
| `app/page.tsx` | Redirect para `/dashboard` |

### 2. Login
| Arquivo | Descrição |
|---------|-----------|
| `app/login/page.tsx` | Formulário de login, POST `/api/auth/login`, redirect para `/dashboard` |

### 3. API Routes Faltantes
| Arquivo | Métodos |
|---------|---------|
| `app/api/agents/[id]/route.ts` | GET, PATCH, DELETE |
| `app/api/auth/me/route.ts` | GET |
| `app/api/tasks/route.ts` | GET, POST |
| `app/api/tasks/[id]/route.ts` | PATCH, DELETE |
| `app/api/projects/route.ts` | GET, POST |
| `app/api/projects/[id]/route.ts` | GET, PATCH, DELETE |
| `app/api/backups/route.ts` | GET, POST |
| `app/api/config/route.ts` | GET, PATCH |
| `app/api/teams/route.ts` | GET, POST |
| `app/api/workspace/[folder]/route.ts` | POST (criar arquivo) |

### 4. Layout do Dashboard
| Arquivo | Descrição |
|---------|-----------|
| `app/dashboard/layout.tsx` | Sidebar + Topbar + auth guard |
| `components/layout/Sidebar.tsx` | Logo 🦞, nav-items, system-status footer |
| `components/layout/Topbar.tsx` | Título, subtítulo, ações contextuais |
| `components/layout/NavItem.tsx` | Item de navegação com active state |

### 5. Componentes UI
| Arquivo | Descrição |
|---------|-----------|
| `components/ui/Modal.tsx` | Modal overlay reutilizável |
| `components/ui/StatCard.tsx` | Card de métrica com slot para heartbeat-bar |
| `components/ui/Button.tsx` | Variantes: primary, ghost, sm |

### 6. Páginas
| Rota | Descrição |
|------|-----------|
| `app/dashboard/page.tsx` | Overview: stats, feed de logs, countdown heartbeats |
| `app/dashboard/agents/page.tsx` | 3 subtabs: Agentes / Workspace / Times |
| `app/dashboard/tasks/page.tsx` | Lista com filtros, checkbox funcional, CRUD |
| `app/dashboard/projects/page.tsx` | Grid com barra de progresso, CRUD |
| `app/dashboard/logs/page.tsx` | Stream via polling a cada 2s, filtros |
| `app/dashboard/backups/page.tsx` | Lista e trigger manual |
| `app/dashboard/config/page.tsx` | Toggles e inputs persistentes |

### 7. Deploy
| Arquivo | Descrição |
|---------|-----------|
| `.env.local.example` | Template de variáveis de ambiente |
| `Dockerfile` | Multi-stage build, porta 8080 |
| `docs/DEPLOY.md` | Instruções de setup e deploy na nova VPS |

---

## Design System (preservado do dashboard.html)

### Fontes
- **Syne** — títulos e UI (400, 600, 700, 800)
- **Space Mono** — labels mono, código, metadados

### Cores (CSS Variables)
```css
--bg: #0a0b0f          /* fundo principal */
--bg2: #0f1117         /* sidebar, topbar */
--bg3: #151820         /* fundo de código/file-viewer */
--surface: #1a1e2a     /* cards */
--surface2: #202535    /* hover de cards */
--border: #252a3a
--border2: #2e3548
--accent: #4f8ef7      /* azul — ativo, online */
--accent2: #7b5ef8     /* roxo — backend */
--accent3: #3dd68c     /* verde — online */
--warn: #f7a94f        /* laranja — busy */
--danger: #f75454      /* vermelho — erro */
--text: #e8eaf2
--text2: #8892b0
--text3: #4a5270
```

---

## Verificação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env.local (copiar .env.local.example)

# 3. Gerar Prisma e rodar seed
npm run db:generate
npm run db:seed

# 4. Dev server na porta 8080
npm run dev

# 5. Type check
npx tsc --noEmit
```

### Checklist visual
- [ ] Redireciona `/` → `/login`
- [ ] Login funciona e seta cookie JWT
- [ ] Sidebar com todos os nav-items e system-status
- [ ] Página Agentes = idêntica ao dashboard.html
- [ ] Workspace lista pastas reais
- [ ] Logs com polling (atualiza a cada 2s)
- [ ] CRUD funcionando em Tasks e Projects
- [ ] Config persiste no banco
