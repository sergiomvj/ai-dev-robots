import { NextResponse } from 'next/server'
import { readFile } from '@/lib/workspace'

export async function GET() {
    try {
        const content = readFile('Connectors', 'openrouter-connector.md')
        if (!content) {
            return NextResponse.json(['google/gemini-2.0-flash-lite'], { status: 200 })
        }

        // Extrai modelos usando regex: | Nome | `id/do/modelo` | ... |
        const matches = content.matchAll(/`([^`\s]+\/[^`\s]+)`/g)
        const models = Array.from(new Set(Array.from(matches).map(m => m[1])))

        if (models.length === 0) {
            return NextResponse.json(['google/gemini-2.0-flash-lite'], { status: 200 })
        }

        return NextResponse.json(models)
    } catch (e) {
        console.error('[GET /api/config/llms]', e)
        return NextResponse.json({ error: 'Erro ao extrair modelos' }, { status: 500 })
    }
}
