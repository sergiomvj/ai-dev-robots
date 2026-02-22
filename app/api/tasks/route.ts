import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const agentId = searchParams.get('agentId')
        const status = searchParams.get('status')
        const priority = searchParams.get('priority')

        const where: Record<string, unknown> = {}
        if (agentId) where.agentId = agentId
        if (status) where.status = status
        if (priority) where.priority = priority

        const tasks = await prisma.task.findMany({
            where,
            orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
            include: {
                agent: { select: { id: true, name: true, avatar: true } },
                project: { select: { id: true, name: true } },
            },
        })
        return NextResponse.json(tasks)
    } catch (e) {
        console.error('[GET /api/tasks]', e)
        return NextResponse.json({ error: 'Erro ao buscar tarefas' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        const task = await prisma.task.create({
            data,
            include: {
                agent: { select: { id: true, name: true, avatar: true } },
                project: { select: { id: true, name: true } },
            },
        })
        return NextResponse.json(task, { status: 201 })
    } catch (e) {
        console.error('[POST /api/tasks]', e)
        return NextResponse.json({ error: 'Erro ao criar tarefa' }, { status: 500 })
    }
}
