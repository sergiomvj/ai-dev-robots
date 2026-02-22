import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Busca do .env ou fallback para local
const BACKUP_DIR = path.resolve(process.cwd(), 'backups')

export async function GET() {
    try {
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true })
        }

        const files = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.endsWith('.tar.gz') || f.endsWith('.sql'))
            .map(f => {
                const stats = fs.statSync(path.join(BACKUP_DIR, f))
                return {
                    name: f,
                    path: path.join(BACKUP_DIR, f),
                    sizeBytes: stats.size,
                    createdAt: stats.mtime,
                }
            })
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

        return NextResponse.json(files)
    } catch (e) {
        console.error('[GET /api/backups/files]', e)
        return NextResponse.json({ error: 'Erro ao listar arquivos de backup' }, { status: 500 })
    }
}
