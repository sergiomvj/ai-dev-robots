import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from '@/lib/workspace'

export async function POST(
    req: NextRequest,
    { params }: { params: { folder: string } }
) {
    const { name, content } = await req.json()
    writeFile(params.folder, name, content || '')
    return NextResponse.json({ created: true, path: `${params.folder}/${name}` }, { status: 201 })
}
