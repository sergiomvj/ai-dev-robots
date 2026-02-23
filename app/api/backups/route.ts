import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { exec } from 'child_process'
import fs from 'fs'

export async function GET() {
    try {
        const backups = await prisma.backup.findMany({ orderBy: { createdAt: 'desc' } })
        return NextResponse.json(backups)
    } catch (e) {
        return NextResponse.json({ error: 'Erro ao listar backups' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const { type = 'manual' } = await req.json().catch(() => ({}))
        const script = process.env.BACKUP_SCRIPT || '/home/openclaw/workspace/Scripts/backup.sh'

        // Fallback para Windows ou ambiente sem o script real
        if (process.platform === 'win32' || !fs.existsSync(script)) {
            const backup = await prisma.backup.create({
                data: {
                    name: `backup-${new Date().toISOString().slice(0, 10)}.sql`,
                    path: '/backups/simulated-dev.sql',
                    type: 'manual',
                    sizeBytes: 1024 * 1024 * 5 // 5MB simulados
                }
            })
            return NextResponse.json(backup, { status: 201 })
        }

        return new Promise<NextResponse>(resolve => {
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
    } catch (e) {
        console.error('[POST /api/backups]', e)
        return NextResponse.json({ error: 'Erro ao processar backup' }, { status: 500 })
    }
}
