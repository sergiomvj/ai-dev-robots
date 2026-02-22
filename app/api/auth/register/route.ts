import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { signToken } from '@/lib/auth'
import { createHash } from 'crypto'

function hashPassword(password: string) {
    return createHash('sha256').update(password).digest('hex')
}

export async function POST(req: NextRequest) {
    const { email, password, name } = await req.json()

    if (!email || !password) {
        return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
        return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 })
    }

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: hashPassword(password),
            name: name || email.split('@')[0],
            role: 'admin',
        },
    })

    const token = await signToken({ email: user.email, role: user.role })

    const res = NextResponse.json({ ok: true })
    res.cookies.set('token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: 'lax',
    })
    return res
}
