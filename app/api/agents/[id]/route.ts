import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const agent = await prisma.agent.findUnique({
            where: { id: params.id },
            include: { tasks: true, logs: { take: 10, orderBy: { createdAt: 'desc' } } }
        })
        if (!agent) return NextResponse.json({ error: 'Agente não encontrado' }, { status: 404 })
        return NextResponse.json(agent)
    } catch (e) {
        console.error(`[GET /api/agents/${params.id}]`, e)
        return NextResponse.json({ error: 'Erro ao buscar agente' }, { status: 500 })
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const data = await req.json()
        // Remove campos que não devem ser editados via PATCH simples se existirem
        delete data.id
        delete data.createdAt
        delete data.updatedAt

        const agent = await prisma.agent.update({
            where: { id: params.id },
            data
        })
        return NextResponse.json(agent)
    } catch (e) {
        console.error(`[PATCH /api/agents/${params.id}]`, e)
        return NextResponse.json({ error: 'Erro ao atualizar agente' }, { status: 500 })
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.agent.delete({ where: { id: params.id } })
        return NextResponse.json({ deleted: true })
    } catch (e) {
        console.error(`[DELETE /api/agents/${params.id}]`, e)
        return NextResponse.json({ error: 'Erro ao deletar agente' }, { status: 500 })
    }
}
