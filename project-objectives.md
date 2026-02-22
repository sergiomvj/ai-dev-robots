# 🎯 Objetivos dos Projetos — c:\Projetos

> Última atualização: 21/02/2026 | Baseado em análise de READMEs, PRDs e documentação interna.

---

## 🚀 Projetos Principais (Alta Prioridade / Ativos)

---

### 📺 TV Facebrasil
**Status:** 90% concluído | **Stack:** Next.js 16, Supabase, ElevenLabs, HeyGen, n8n, Clerk

**Objetivo Central:**  
Plataforma completa de automação de vídeo que transforma artigos jornalísticos em vídeos com apresentadores virtuais (avatares IA), publicados automaticamente no YouTube e redes sociais. Pipeline: Artigo → Roteiro IA → Áudio/Avatar → Revisão Humana → Publicação.

**Pilares estratégicos:**
- Servir a comunidade brasileira nos EUA com conteúdo audiovisual acessível
- Monetizar via publicidade nativa, patrocínios corporativos e assinaturas FB+
- Escalar para 50+ vídeos/mês com pipeline automatizado (custo estimado $61.60/vídeo)
- Distribuir em múltiplos canais: TV Facebrasil, YouTube, Instagram Reels, TikTok

**Componentes:**
- **Control Tower** (Admin): Kanban de produção, editor de roteiros, player de revisão, analytics
- **Video Portal** (Público): Home estilo Netflix, player proprietário, páginas de categoria

---

### 📰 NovaFacebrasil
**Status:** 95% concluído | **Stack:** Next.js 16, Supabase, next-intl, Tiptap, Clerk

**Objetivo Central:**  
Portal de notícias premium multilíngue (PT/EN/ES) para a comunidade brasileira nos EUA. Sistema editorial completo com painel admin, autores, categorias hierárquicas, editor Tiptap e distribuição de artigos para o pipeline da TV Facebrasil via webhook.

**Pilares estratégicos:**
- CMS robusto para publicação de notícias em 3 idiomas
- Integração nativa com TV Facebrasil (envio de artigos para produção de vídeos)
- SEO otimizado e Open Graph para maximizar alcance orgânico
- Sistema de autores com controle de acesso granular

---

### 📋 2Planner
**Status:** 95% concluído | **Stack:** Next.js 16, Drizzle ORM, Supabase, Clerk, Firecrawl

**Objetivo Central:**  
SaaS de planejamento estratégico e automação de marketing com IA. Plataforma para criação de planos de marketing, calendários editoriais, análise competitiva via web scraping (Firecrawl) e geração de conteúdo com LLMs.

**Pilares estratégicos:**
- Ferramenta all-in-one para planejadores de marketing e donos de negócios
- Automação de pesquisa de mercado com Firecrawl + IA
- Calendário editorial integrado (FullCalendar)
- Modelo freemium com planos pagos

---

### 📊 FBR-Trends
**Status:** 85% concluído | **Stack:** Next.js 16, Drizzle, Google Trends API, Clerk

**Objetivo Central:**  
Analisador de tendências de mercado e SEO em tempo real. Monitora Google Trends, compara competidores e sugere pautas baseadas em volume de busca para o ecossistema FBR.

**Pilares estratégicos:**
- Alimentar a redação da NovaFacebrasil com pautas quentes
- Identificar oportunidades de SEO para o ecossistema FBR
- Dashboard de tendências com visualizações interativas

---

### 🔌 seoapi
**Status:** 100% concluído | **Stack:** Python (FastAPI), PostgreSQL, Alembic

**Objetivo Central:**  
API central de gerenciamento de SEO e chaves de sistema para todo o ecossistema FBR. Expõe endpoints padronizados de gerenciamento de API keys, métricas e configurações globais.

---

### 📣 echonow
**Status:** 90% concluído | **Stack:** Next.js 14, Prisma, Supabase, OpenAI, Tailwind

**Objetivo Central:**  
Plataforma de notícias e repercussão com IA (v1.0 Release). Agrega notícias, gera análises automáticas e permite comentários contextualizados com suporte de IA. Sistema multi-idioma com suporte ao português.

**Pilares estratégicos:**
- Curation automática de notícias com análise de sentimentos
- Debate estruturado com suporte de IA para contextualização
- Deploy na Railway com CI/CD automatizado

---

## 🤖 Ecossistema VCM (Virtual Company Manager)

---

### 🏢 1Builder (VCM Dashboard)
**Status:** Ativo | **Stack:** Next.js, Supabase, Gemini AI, Fal.ai

**Objetivo Central:**  
Dashboard de gestão de empresas e personas virtuais (avatares IA para SDR/vendas). Cria empresas fictícias com equipes de agentes IA completos: biografia, competências, fluxos SDR, fotos profissionais e base de conhecimento RAG.

**Pilares estratégicos:**
- Gerar equipes de SDR virtuais para simulação e treinamento
- Pipeline de 7 scripts sequenciais: Avatares → Biografias → Competências → Tech Specs → RAG → Fluxos SDR → Fotos
- Base de dados em Supabase com relacionamentos: empresas → personas → avatares → fluxos

---

### 🎨 vcm_vite_react
**Status:** 90% concluído | **Stack:** React (Vite), Tailwind, Supabase

**Objetivo Central:**  
Dashboard principal alternativo (React + Vite) para visualização e gestão das empresas virtuais criadas pelo VCM. Interface mais rápida focada em listagem, filtros e detalhes de personas.

---

### 🤖 AI-Dev-Commander
**Status:** Em desenvolvimento | **Stack:** Next.js 14, Node.js/FastAPI, PostgreSQL, Redis, Socket.io

**Objetivo Central:**  
Plataforma de gestão de agentes IA de desenvolvimento. Cria e gerencia agentes virtuais especializados em desenvolvimento de software (OpenClaw agents), com backup de memória persistente (SOUL.md, MEMORY.md, TASKS.md), Kanban de tarefas, time tracking e monitoramento de eficiência.

**Pilares estratégicos:**
- CRUD completo de agentes OpenClaw com ciclo de vida (nascimento, memória, continuidade)
- Dashboard de monitoramento: status em tempo real, alertas de atraso, score de eficiência
- Integração Git: sincronização automática com commits e PRs
- Modelo freemium: gratuito até 15 usuários, planos a partir de R$49/usuário/mês

---

## 🛠️ Projetos Específicos / Nichos

---

### ⏰ TimeHeart
**Status:** 40% | **Stack:** Next.js, XState, Tailwind

**Objetivo:** App de gestão de tempo baseada em ciclos de energia biológica. Divide o dia em períodos de Produção vs. Recarga, com máquina de estados (XState) para transições de modo.

---

### 🌿 plantscan
**Status:** 30% | **Stack:** React, Vite, Gemini API

**Objetivo:** App de identificação de plantas por foto usando Gemini Vision AI. Demo/starter para validação do conceito.

---

### 🧠 MeuTDAH
**Status:** 65% | **Stack:** React, Node.js

**Objetivo:** App de suporte, educação e ferramentas práticas para pessoas com TDAH. Foco em organização, lembretes e técnicas comprovadas.

---

### 🏗️ Reformai
**Status:** 70% | **Stack:** React, Supabase

**Objetivo:** Marketplace de reformas e serviços residenciais com matching inteligente entre clientes e prestadores de serviço.

---

### 🛒 FacebrasilShop
**Status:** Em análise | **Stack:** Next.js, Supabase

**Objetivo:** E-commerce para a comunidade brasileira nos EUA. Produtos e serviços voltados ao mercado imigrante.

---

### 📺 7Youtuber / 7Youtuber2
**Status:** 80% | **Stack:** Node.js, YouTube API, n8n

**Objetivo:** Automação de publicação, SEO de títulos/descrições e gestão de canais YouTube. Complementa o pipeline da TV Facebrasil.

---

### 🔍 ARVA
**Status:** 30% | **Stack:** Node.js, AI Agents

**Objetivo:** Assistente Virtual Autônomo com IA em tempo real. Agente conversacional para atendimento e automação de processos.

---

### 🏎️ Carntrack
**Status:** 50% | **Stack:** Node.js, Geolocation APIs

**Objetivo:** Sistema de rastreamento de veículos/logística com geolocalização em tempo real.

---

### 🌟 Lifewayusa
**Status:** 85% | **Stack:** React, Node.js

**Objetivo:** Site corporativo de serviços para o mercado americano (imigrantes brasileiros). Apresentação de serviços, captura de leads e blog.

---

### 🏋️ SetUFree
**Status:** Em desenvolvimento | **Stack:** React/Next.js

**Objetivo:** Plataforma de bem-estar e fitness com programas de treino personalizados.

---

### 📡 fbrsigns / fbrsignsfull
**Status:** Ativo | **Stack:** React/Next.js

**Objetivo:** Solução de Digital Signage para o ecossistema FBR. Exibição de conteúdo em TVs e painéis digitais.

---

## 🧰 Infraestrutura & Ferramentas

| Projeto | Objetivo |
|---------|----------|
| **skills** | Repositório central de habilidades (SKILL.md) — extremamente ativo, base do sistema de agentes |
| **seoapi** | API REST central de SEO e gerenciamento de chaves do ecossistema |
| **FBR_Panel** | Painel de controle central do ecossistema FBR |
| **FBRApps** | Hub de navegação entre os apps do ecossistema Facebrasil |
| **LLMHub** | Hub centralizado de modelos de linguagem para o ecossistema |
| **bestPRD** | Gerador de PRDs (Product Requirements Documents) com IA |
| **best-prd** | Versão alternativa/legada do gerador de PRDs |

---

*Gerado automaticamente em 21/02/2026 | Fonte: análise de READMEs, PRDs e documentação interna dos projetos*
