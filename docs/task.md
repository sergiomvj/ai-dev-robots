# OpenClaw Dashboard — Task Checklist

> **Migração:** dashboard.html estático → Next.js 14 App Router  
> **Regra:** visual e estrutura idênticos ao original

---

## ✅ Infraestrutura Base (prontos)
- [x] `package.json`
- [x] `next.config.ts`
- [x] `tailwind.config.ts`
- [x] `prisma/schema.prisma`
- [x] `prisma/seed.ts`
- [x] `lib/db.ts`
- [x] `lib/auth.ts`
- [x] `lib/workspace.ts`
- [x] `middleware.ts`

## ✅ API Routes (prontas)
- [x] `app/api/auth/login/route.ts`
- [x] `app/api/agents/route.ts`
- [x] `app/api/heartbeat/[name]/route.ts`
- [x] `app/api/logs/route.ts`
- [x] `app/api/workspace/route.ts`
- [x] `app/api/workspace/[folder]/[file]/route.ts`

## 🔨 API Routes (criar)
- [ ] `app/api/agents/[id]/route.ts`
- [ ] `app/api/auth/me/route.ts`
- [ ] `app/api/tasks/route.ts`
- [ ] `app/api/tasks/[id]/route.ts`
- [ ] `app/api/projects/route.ts`
- [ ] `app/api/projects/[id]/route.ts`
- [ ] `app/api/backups/route.ts`
- [ ] `app/api/config/route.ts`
- [ ] `app/api/teams/route.ts`
- [ ] `app/api/workspace/[folder]/route.ts`

## 🔨 UI — Arquivos Globais
- [ ] `app/globals.css`
- [ ] `app/layout.tsx`
- [ ] `app/page.tsx`

## 🔨 UI — Login
- [ ] `app/login/page.tsx`

## 🔨 UI — Layout
- [ ] `app/dashboard/layout.tsx`
- [ ] `components/layout/Sidebar.tsx`
- [ ] `components/layout/Topbar.tsx`
- [ ] `components/layout/NavItem.tsx`

## 🔨 UI — Componentes
- [ ] `components/ui/Modal.tsx`
- [ ] `components/ui/StatCard.tsx`
- [ ] `components/ui/Button.tsx`

## 🔨 UI — Páginas
- [ ] `app/dashboard/page.tsx` (Overview)
- [ ] `app/dashboard/agents/page.tsx` (3 subtabs)
- [ ] `app/dashboard/tasks/page.tsx`
- [ ] `app/dashboard/projects/page.tsx`
- [ ] `app/dashboard/logs/page.tsx`
- [ ] `app/dashboard/backups/page.tsx`
- [ ] `app/dashboard/config/page.tsx`

## 🔨 Deploy
- [ ] `.env.local.example`
- [ ] `Dockerfile`
- [ ] `docs/DEPLOY.md`
