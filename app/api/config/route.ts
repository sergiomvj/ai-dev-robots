import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    const configs = await prisma.config.findMany({ orderBy: { key: 'asc' } })
    return NextResponse.json(configs)
}

export async function PATCH(req: NextRequest) {
    const { key, value } = await req.json()
    const config = await prisma.config.upsert({
        where: { key },
        update: { value },
        create: { key, value },
    })
    return NextResponse.json(config)
}
