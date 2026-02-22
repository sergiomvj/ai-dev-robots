'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'

interface Log {
    id: string
    level: string
    message: string
    agent?: { name: string }
    createdAt: string
}

const LEVEL_COLORS: Record<string, string> = {
    INFO: 'var(--accent)',
    WARN: 'var(--warn)',
    ERR: 'var(--danger)',
    OK: 'var(--accent3)',
}

export default function LogsPage() {
    const searchParams = useSearchParams()
    const agentIdParam = searchParams.get('agentId')

    const [logs, setLogs] = useState<Log[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [filterLevel, setFilterLevel] = useState('all')

    async function load() {
        setLoading(true)
        const res = await fetch(`/api/logs?limit=100${filterLevel !== 'all' ? `&level=${filterLevel}` : ''}`)
        const data = await res.json()
        if (data.logs) {
            setLogs(data.logs)
            setTotal(data.total)
        }
        setLoading(false)
    }

    useEffect(() => {
        load()
    }, [filterLevel])

    return (
        <>
            <Topbar
                title="Logs do Sistema"
                subtitle={`${total} entradas registradas nas últimas 24h`}
            />

            <div className="content">
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    {['all', 'INFO', 'WARN', 'ERR', 'OK'].map(l => (
                        <button
                            key={l}
                            onClick={() => setFilterLevel(l)}
                            className={`btn-sm ${filterLevel === l ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ textTransform: 'uppercase', fontSize: 10, fontWeight: 700 }}
                        >
                            {l === 'all' ? 'Todos' : l}
                        </button>
                    ))}
                </div>

                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>Carregando logs...</div>
                    ) : logs.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>Nenhum log encontrado.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {logs.map((log, i) => (
                                <div key={log.id} style={{
                                    display: 'flex',
                                    gap: 16,
                                    padding: '10px 20px',
                                    borderBottom: i < logs.length - 1 ? '1px solid var(--border)' : 'none',
                                    fontSize: 12,
                                    fontFamily: 'var(--mono)',
                                    alignItems: 'flex-start'
                                }}>
                                    <span style={{
                                        width: 50,
                                        fontWeight: 800,
                                        color: LEVEL_COLORS[log.level] || 'var(--text2)',
                                        flexShrink: 0
                                    }}>{log.level}</span>

                                    <span style={{ flex: 1, color: 'var(--text2)' }}>{log.message}</span>

                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ color: 'var(--text)', fontSize: 11 }}>{log.agent?.name || 'sistema'}</div>
                                        <div style={{ color: 'var(--text3)', fontSize: 10 }}>{new Date(log.createdAt).toLocaleTimeString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
