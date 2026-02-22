import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    const teams = await prisma.team.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(teams)
}

export async function POST(req: NextRequest) {
    const data = await req.json()
    const team = await prisma.team.create({ data })
    return NextResponse.json(team, { status: 201 })
}
