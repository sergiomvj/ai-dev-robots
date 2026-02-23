import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { message, agentModel } = await req.json()
        const apiKey = process.env.OPENROUTER_API_KEY

        if (!apiKey) {
            return NextResponse.json({
                role: 'agent',
                content: 'Erro: OPENROUTER_API_KEY não configurada no servidor.'
            }, { status: 500 })
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://dashboard.fbrapps.com',
                'X-Title': 'OpenClaw Dashboard',
            },
            body: JSON.stringify({
                model: agentModel || 'google/gemini-2.5-flash-lite',
                messages: [{ role: 'user', content: message }],
            }),
        })

        const data = await response.json()
        const reply = data.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem agora.'

        return NextResponse.json({ role: 'agent', content: reply })
    } catch (e) {
        console.error('[POST /api/chat]', e)
        return NextResponse.json({ error: 'Falha na comunicação com o agente' }, { status: 500 })
    }
}
