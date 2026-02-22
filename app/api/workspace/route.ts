import { NextResponse } from 'next/server'
import { listWorkspace } from '@/lib/workspace'

export async function GET() {
  const workspace = listWorkspace()
  return NextResponse.json(workspace)
}
