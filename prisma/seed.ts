import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Times
  const teams = [
    { name: 'Core', slug: 'core', color: '#4f8ef7', icon: '⬡', description: 'Equipe central de coordenação' },
    { name: 'Backend Dev', slug: 'backend', color: '#7b5ef8', icon: '⬢', description: 'Desenvolvimento backend e fullstack' },
    { name: 'Frontend', slug: 'frontend', color: '#3dd68c', icon: '◈', description: 'Interface, UX e componentes visuais' },
    { name: 'Marketing', slug: 'marketing', color: '#f7a94f', icon: '✦', description: 'Conteúdo, campanhas e crescimento' },
  ]
  for (const team of teams) {
    await prisma.team.upsert({ where: { slug: team.slug }, update: {}, create: team })
  }

  // Agentes
  const agents = [
    {
      name: 'Chiara Garcia',
      role: 'Orchestrator · Main',
      avatar: '🧠',
      model: 'google/gemini-2.5-flash-lite',
      status: 'online',
      teams: ['core', 'backend', 'frontend', 'marketing'],
      commands: ['email', 'notify', 'agenda', 'report', 'github'],
      description: 'Orquestradora principal. Distribui tarefas, monitora heartbeats e coordena todos os agentes.',
    },
    {
      name: 'David Novaes',
      role: 'Senior Programmer',
      avatar: '⚙️',
      model: 'google/gemini-2.5-flash-lite',
      status: 'busy',
      teams: ['core', 'backend'],
      commands: ['github', 'report', 'notify'],
      description: 'Programador sênior. Backend, GitHub (100+ repos), PostgreSQL e integrações de API.',
    },
    {
      name: 'Lia Salazar',
      role: 'Frontend Specialist',
      avatar: '🎨',
      model: 'moonshotai/kimi-k2.5',
      status: 'online',
      teams: ['frontend', 'backend'],
      commands: ['notify', 'report', 'github'],
      description: 'Especialista em frontend. React, UI/UX, componentes visuais.',
    },
    {
      name: 'Mila Castro',
      role: 'Marketing Manager',
      avatar: '📣',
      model: 'google/gemini-2.5-flash-lite',
      status: 'idle',
      teams: ['marketing'],
      commands: ['email', 'inbox', 'notify', 'report'],
      description: 'Gerente de marketing. Copy, campanhas e análise de métricas.',
    },
  ]
  for (const agent of agents) {
    await prisma.agent.upsert({ where: { name: agent.name }, update: {}, create: agent })
  }

  // Config padrão
  const configs = [
    { key: 'heartbeat_interval', value: '300' },
    { key: 'heartbeat_timeout', value: '600' },
    { key: 'gateway_port', value: '18789' },
    { key: 'telegram_enabled', value: 'true' },
    { key: 'auto_restart', value: 'true' },
  ]
  for (const cfg of configs) {
    await prisma.config.upsert({ where: { key: cfg.key }, update: {}, create: cfg })
  }

  console.log('✅ Seed concluído')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
