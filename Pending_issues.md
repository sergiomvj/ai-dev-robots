# ⚠️ Pendências e Funcionalidades Não Implementadas

> Última atualização: 21/02/2026 | Baseado em análise de docs, sprint finals e histórico de conversas.

---

## 📺 TV Facebrasil

### 🔴 Crítico — Integrações Externas (Bloqueiam o pipeline)

| # | Pendência | Impacto |
|---|-----------|---------|
| 1 | **YouTube Data API** — Configurar Google Cloud Project + OAuth + upload automático de vídeos | Pipeline nunca chega ao fim sem isso |
| 2 | **Instagram Graph API (Meta)** — Configurar Meta Developer App + publicação automática de Reels | Distribuição nas redes sociais bloqueada |
| 3 | **n8n Workflows** — Importar e configurar workflows em `/n8n/`, configurar webhooks `script-complete` e `video-complete` | Automação completa do pipeline bloqueada |
| 4 | **Cloudflare R2 Storage** — Configurar bucket para armazenar vídeos gerados | Vídeos sem destino de storage permanente |
| 5 | **Teste end-to-end do pipeline** — Artigo FBR → Roteiro → Áudio/Avatar → Review → YouTube | Validação completa nunca executada |

### 🟠 Importante — Control Tower (Dashboard Admin)

| # | Pendência | Arquivo(s) |
|---|-----------|-----------|
| 6 | **Kanban de Produção** — Conexão real com tabela `videos` do Supabase, leitura dos estados (Intake → Published) | `app/dashboard/production/page.tsx` |
| 7 | **Cards do Kanban** — Destaque visual (vermelho) para jobs em estado `Error` + botão de "Retry" via webhook | `components/kanban/Board.tsx` |
| 8 | **Editor de Roteiro** — Página de detalhe com artigo original (esquerda) e roteiro IA editável (direita) | `app/dashboard/editor/[id]/page.tsx` |
| 9 | **Botão "Aprovar Roteiro"** — Salvar no Supabase + disparar webhook para fase de Rendering | `components/script-editor/ScriptEditor.tsx` |
| 10 | **Botão "Regenerar Roteiro"** — Solicita nova versão ao n8n sem sair da tela | `components/script-editor/ScriptEditor.tsx` |
| 11 | **Player de Review** — Player HTML5 para o `.mp4` gerado + exibir metadados (título, descrição, tags, thumbnail) | `app/dashboard/review/[id]/page.tsx` |
| 12 | **Botão "Rejeitar/Refazer"** — Campo de feedback + voltar para fase Scripting ou Rendering | `app/dashboard/review/[id]/page.tsx` |
| 13 | **Dashboard de Métricas** — Gráfico de vídeos produzidos vs publicados, custo estimado de API, tempo médio de produção | `app/dashboard/metrics/page.tsx` |
| 14 | **CRUD de Anunciantes** — Cadastro de parceiros com upload de logos/vídeos de 15s para mid-roll | Nova rota no dashboard |
| 15 | **Regras de Ad Targeting** — "Inserir ad da Florida Blue em todos vídeos de Saúde" | Lógica de associação vídeo-anúncio |
| 16 | **Roles de Usuário (Clerk)** — Admin / Editor (aprova roteiros) / Viewer (só visualiza) | Middleware de auth |

### 🟡 Futuro — Video Portal (Público)

| # | Pendência |
|---|-----------|
| 17 | **Busca Global** — Implementação real do input de busca (preparado mas não funcional) |
| 18 | **TikTok Publisher** — Publicação automática no TikTok (código de distribuição mapeado mas não integrado) |
| 19 | **Facebook Publisher** — Publicação automática no Facebook |
| 20 | **Sistema de Assinatura FB+** — $9.99/mês, sem ads + cursos exclusivos (modelo de receita planejado) |

---

## 📰 NovaFacebrasil

### 🔴 Crítico

| # | Pendência | Contexto |
|---|-----------|---------|
| 21 | **Hierarquia de Categorias** — Implementação do `parent_id` e tree view no admin para categorias/subcategorias | Erros de tabela reportados em fev/2026 |
| 22 | **Migração Prisma → Supabase** — Schema ainda com conflitos entre Prisma (SQLite) e Supabase (PostgreSQL) | Causa falhas de build |

### 🟠 Importante

| # | Pendência |
|---|-----------|
| 23 | **Build Docker estável** — Erros de TypeScript em parâmetros async do Next.js 15+ (params/searchParams) bloqueiam CI/CD |
| 24 | **Webhook TV Facebrasil** — Envio de artigos selecionados para `https://tv.fbr.news/api/webhooks/facebrasil` |
| 25 | **Pipeline de Vídeo** — Integração completa NovaFacebrasil → TV Facebrasil (seleção de artigos → produção de vídeo) |
| 26 | **Editor de Categorias no Admin** — Categorias não carregando no editor de artigos |

---

## 🤖 AI-Dev-Commander

### 🔴 Crítico — Backend ainda não operacional

| # | Pendência | Contexto |
|---|-----------|---------|
| 27 | **Runtime Python (FastAPI)** — Backend de agentes não implementado | Conversas de fev/2026 mostram implementação incompleta |
| 28 | **Conexão com banco de dados** — `dashboard/src/lib/db.ts` com erros de `pg` e `@types/pg` | Reportado em fev/2026 |

### 🟠 Importante

| # | Pendência |
|---|-----------|
| 29 | **CRUD de Agentes OpenClaw** — Interface para criar/editar/deletar agentes com arquivos SOUL.md, MEMORY.md, TASKS.md |
| 30 | **Monitoramento em Tempo Real** — Dashboard de status: Ok / Atrasado / Adiantado por agente |
| 31 | **Botão "Gerar Relatório de Status"** — Report diário com tudo que está atrasado ou por fazer |
| 32 | **Botão "Medir Eficiência"** — Score por pontualidade, assertividade, segurança e aprendizado |
| 33 | **Integração Git** — Sincronização automática com commits e pull requests |
| 34 | **Time Tracking** — Registro automático de tempo gasto em tarefas |

---

## 📋 2Planner

### 🟠 Importante

| # | Pendência |
|---|-----------|
| 35 | **Relatórios exportáveis** — Geração de PDF de planos de marketing com `jspdf` + `html2canvas` |
| 36 | **Integração Firecrawl** — Web scraping automático de concorrentes para análise competitiva |
| 37 | **Automação de Priorização IA** — Sugestão de prioridades baseada em prazos e dependências |

---

## 📊 FBR-Trends

### 🟠 Importante

| # | Pendência |
|---|-----------|
| 38 | **Integração Google Trends API** — Dados reais de tendências (conexão com API oficial) |
| 39 | **Alimentação automática da redação** — Sugestão de pautas para NovaFacebrasil baseada em trending topics |

---

## 🏢 1Builder (VCM)

### 🟡 Melhorias

| # | Pendência |
|---|-----------|
| 40 | **Regeneração de avatares a partir da UI** — Fluxo de regeneração sem precisar do terminal |
| 41 | **Subsystems detalhados** — 12 subsistemas VCM planejados, completude varia por subsistema |

---

## ⏰ TimeHeart

### 🔴 Em construção (60% de funcionalidades faltando)

| # | Pendência |
|---|-----------|
| 42 | **XState machine completa** — Transições de estados Produção ↔ Recarga não implementadas |
| 43 | **Persistência de sessões** — Histórico de ciclos energéticos não salvo |
| 44 | **Notificações/alertas** — Alertas de fim de ciclo e sugestões de pausa |

---

## 🌿 plantscan

### 🔴 MVP incompleto (70% faltando)

| # | Pendência |
|---|-----------|
| 45 | **Identificação via câmera** — Integração real com Gemini Vision API |
| 46 | **Banco de dados de plantas** — Catálogo de espécies com informações de cuidados |
| 47 | **Histórico de plantas** — Salvar plantas identificadas por usuário |

---

## 🤖 ARVA

### 🔴 Em estágio inicial (70% faltando)

| # | Pendência |
|---|-----------|
| 48 | **Arquitetura de agentes** — Implementar loop de raciocínio e memória persistente |
| 49 | **Interface conversacional** — UI de chat funcional com streaming de respostas |
| 50 | **Integração com ferramentas externas** — Tool use / function calling |

---

## 🏎️ Carntrack

### 🟠 Importantes (50% faltando)

| # | Pendência |
|---|-----------|
| 51 | **Rastreamento em tempo real** — Integração com APIs de geolocalização (Google Maps / Mapbox) |
| 52 | **Dashboard de frota** — Visualização de múltiplos veículos em mapa |
| 53 | **Histórico de rotas** — Armazenamento e replay de trajetos |

---

## 📦 Legados / Menor Prioridade

| Projeto | Pendência principal |
|---------|-------------------|
| **MeuTDAH** | Integração com calendário, lembretes push, técnicas de foco (Pomodoro) |
| **Reformai** | Sistema de matching cliente-prestador, avaliações e pagamentos |
| **4Creator / 4Creator2** | Pipeline de criação de assets de marketing completo |
| **3Blogger** | Integração editorial com NovaFacebrasil |
| **5Keeper** | Sistema de backup automático de ativos digitais |
| **StayTuned** | Funcionalidades de notificação e feed de conteúdo |
| **FacebrasilShop** | Catálogo de produtos, carrinho e checkout |
| **TheLegion** | Integração completa com CRM (Maria) |
| **fbrsigns** | Sistema de agendamento de conteúdo para displays |
| **Fast3DPrint** | Migração de HTML estático para plataforma moderna com pedidos online |

---

## 🗂️ Resumo Executivo de Prioridades

```
🔴 BLOQUEIAM produção → TV Facebrasil (APIs YouTube/Meta + n8n)
🔴 BLOQUEIAM deploy   → NovaFacebrasil (build errors) + AI-Dev-Commander (backend)
🟠 COMPLETAM produto  → Control Tower (Kanban real, editor, review)
🟠 AUMENTAM receita   → FB+ (assinaturas), Sistema de Ads TV Facebrasil
🟡 MELHORAM produto   → Analytics, busca, relatórios exportáveis
```

---

*Gerado automaticamente em 21/02/2026 | Fonte: docs/sprintfinal-*.md, PRDs, histórico de conversas e análise de código.*
