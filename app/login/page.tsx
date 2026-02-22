'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
        const body = mode === 'login' ? { email, password } : { email, password, name }

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

        if (res.ok) {
            router.push('/dashboard')
        } else {
            const data = await res.json()
            setError(data.error || 'Erro ao processar')
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                width: 380,
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: '36px 32px',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                    <div style={{
                        width: 40, height: 40,
                        background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                        borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20,
                    }}>🤖</div>
                    <div>
                        <div className="font-heading" style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>AI-DEV-ROBOT</div>
                        <div style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'var(--mono)', fontWeight: 700 }}>dashboard.fbrapps.com</div>
                    </div>
                </div>

                {/* Toggle */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg)', borderRadius: 8, padding: 4 }}>
                    {(['login', 'register'] as const).map(m => (
                        <button
                            key={m}
                            onClick={() => { setMode(m); setError('') }}
                            style={{
                                flex: 1,
                                padding: '7px 0',
                                borderRadius: 6,
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: 12,
                                fontWeight: 700,
                                fontFamily: 'var(--mono)',
                                background: mode === m ? 'var(--accent)' : 'transparent',
                                color: mode === m ? '#fff' : 'var(--text2)',
                                transition: 'all .15s',
                            }}
                        >
                            {m === 'login' ? 'ENTRAR' : 'CADASTRAR'}
                        </button>
                    ))}
                </div>

                <div style={{ marginBottom: 20 }}>
                    <div className="font-heading" style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
                        {mode === 'login' ? 'Entrar' : 'Criar conta'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
                        {mode === 'login' ? 'Sistema de controle de agentes' : 'Acesso administrativo'}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <div className="form-group">
                            <label className="form-label">NOME</label>
                            <input
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Seu nome"
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label">E-MAIL</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@fbrapps.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">SENHA</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '10px 12px',
                            borderRadius: 'var(--radius2)',
                            background: 'rgba(247,84,84,.12)',
                            border: '1px solid rgba(247,84,84,.25)',
                            color: 'var(--danger)',
                            fontSize: 12,
                            fontFamily: 'var(--mono)',
                            marginBottom: 16,
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '11px 14px', fontSize: 13 }}
                        disabled={loading}
                    >
                        {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar →' : 'Criar conta →'}
                    </button>
                </form>

                <div style={{
                    marginTop: 24,
                    paddingTop: 20,
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 11,
                    color: 'var(--text3)',
                    fontFamily: 'var(--mono)',
                }}>
                    <span className="dot dot-green" />
                    Sistema online · VPS segura
                </div>
            </div>
        </div>
    )
}
