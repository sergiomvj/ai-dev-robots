import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { signToken } from '@/lib/auth'
import { createHash } from 'crypto'

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex')
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  // 1. Verifica usuário no banco
  const user = await prisma.user.findUnique({ where: { email } }).catch(() => null)
  if (user) {
    if (user.passwordHash !== hashPassword(password)) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }
    const token = await signToken({ email: user.email, role: user.role })
    const res = NextResponse.json({ token })
    res.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    })
    return res
  }

  // 2. Fallback: variáveis de ambiente (admin hardcoded)
  if (
    process.env.ADMIN_EMAIL &&
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = await signToken({ email, role: 'admin' })
    const res = NextResponse.json({ token })
    res.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    })
    return res
  }

  return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
}
