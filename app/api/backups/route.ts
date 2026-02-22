import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { exec } from 'child_process'

export async function GET() {
    const backups = await prisma.backup.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(backups)
}

export async function POST(req: NextRequest) {
    const { type = 'manual' } = await req.json().catch(() => ({}))

    return new Promise<NextResponse>(resolve => {
        const script = process.env.BACKUP_SCRIPT || '/home/openclaw/workspace/Scripts/backup.sh'
        exec(script, async (err, stdout) => {
            if (err) {
                resolve(NextResponse.json({ error: 'Falha ao executar backup' }, { status: 500 }))
                return
            }
            const backup = await prisma.backup.create({
                data: {
                    name: `backup-${new Date().toISOString().slice(0, 10)}.sql`,
                    path: stdout.trim() || '/backups/',
                    type,
                },
            })
            resolve(NextResponse.json(backup, { status: 201 }))
        })
    })
}
