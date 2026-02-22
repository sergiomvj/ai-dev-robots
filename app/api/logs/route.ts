import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const agent = searchParams.get('agent')
  const level = searchParams.get('level')

  const where: Record<string, unknown> = {}
  if (agent) where.agent = { name: { contains: agent, mode: 'insensitive' } }
  if (level) where.level = level.toUpperCase()

  const [logs, total] = await Promise.all([
    prisma.log.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { agent: { select: { name: true } } },
    }),
    prisma.log.count({ where }),
  ])

  return NextResponse.json({ logs, total })
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const log = await prisma.log.create({ data })
  return NextResponse.json(log, { status: 201 })
}
