import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { name: 'asc' },
      include: {
        tasks: { where: { status: { not: 'done' } }, select: { id: true } },
      },
    })
    return NextResponse.json(agents)
  } catch (e) {
    console.error('[GET /api/agents]', e)
    return NextResponse.json({ error: 'Erro ao buscar agentes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const agent = await prisma.agent.create({ data })
    return NextResponse.json(agent, { status: 201 })
  } catch (e) {
    console.error('[POST /api/agents]', e)
    return NextResponse.json({ error: 'Erro ao criar agente' }, { status: 500 })
  }
}
