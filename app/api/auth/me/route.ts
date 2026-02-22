import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value
        || req.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
        return NextResponse.json({ email: payload.email, role: payload.role })
    } catch {
        return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }
}
