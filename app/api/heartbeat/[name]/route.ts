import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const agentName = decodeURIComponent(params.name)
  const body = await req.json().catch(() => ({}))

  const agent = await prisma.agent.findFirst({
    where: { name: { contains: agentName, mode: 'insensitive' } },
  })

  if (!agent) {
    return NextResponse.json({ error: 'Agente não encontrado' }, { status: 404 })
  }

  // Atualiza lastSeen e status
  await prisma.agent.update({
    where: { id: agent.id },
    data: {
      lastSeen: new Date(),
      status: body.status === 'busy' ? 'busy' : 'online',
    },
  })

  // Registra heartbeat
  await prisma.heartbeat.create({
    data: { agentId: agent.id, status: body.status || 'ok' },
  })

  // Registra log
  await prisma.log.create({
    data: {
      level: 'INFO',
      message: `${agent.name} → heartbeat recebido`,
      agentId: agent.id,
    },
  })

  return NextResponse.json({ received: true, timestamp: new Date().toISOString() })
}
