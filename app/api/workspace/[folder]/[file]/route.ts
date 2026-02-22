import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, deleteFile } from '@/lib/workspace'

export async function GET(
  _req: NextRequest,
  { params }: { params: { folder: string; file: string } }
) {
  const content = readFile(params.folder, params.file)
  if (content === null) return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
  return NextResponse.json({ name: params.file, folder: params.folder, content })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { folder: string; file: string } }
) {
  const { content } = await req.json()
  writeFile(params.folder, params.file, content)
  return NextResponse.json({ updated: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { folder: string; file: string } }
) {
  const deleted = deleteFile(params.folder, params.file)
  if (!deleted) return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
  return NextResponse.json({ deleted: true })
}
