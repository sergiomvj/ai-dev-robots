import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                tasks: { select: { id: true, status: true } },
            },
        })
        return NextResponse.json(projects)
    } catch (e) {
        console.error('[GET /api/projects]', e)
        return NextResponse.json({ error: 'Erro ao buscar projetos' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        const project = await prisma.project.create({ data })
        return NextResponse.json(project, { status: 201 })
    } catch (e) {
        console.error('[POST /api/projects]', e)
        return NextResponse.json({ error: 'Erro ao criar projeto' }, { status: 500 })
    }
}
