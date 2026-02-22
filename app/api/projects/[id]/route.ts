import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    const project = await prisma.project.findUnique({
        where: { id: params.id },
        include: { tasks: true },
    })
    if (!project) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(project)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const data = await req.json()
    const project = await prisma.project.update({ where: { id: params.id }, data })
    return NextResponse.json(project)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    await prisma.project.delete({ where: { id: params.id } })
    return NextResponse.json({ deleted: true })
}
