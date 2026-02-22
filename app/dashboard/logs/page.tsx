'use client'

import { useState, useEffect, useRef } from 'react'
import Topbar from '@/components/layout/Topbar'

interface Log { id: string; level: string; message: string; agent?: { name: string }; createdAt: string; meta?: unknown }

const LEVEL_COLORS: Record<string, string> = { OK: 'var(--accent3)', INFO: 'var(--accent)', WARN: 'var(--warn)', ERR: 'var(--danger)' }

export default function LogsPage() {
    const [logs, setLogs] = useState<Log[]>([])
    const [total, setTotal] = useState(0)
    const [filterAgent, setFilterAgent] = useState('')
    const [filterLevel, setFilterLevel] = useState('')
    const [paused, setPaused] = useState(false)
    const [agents, setAgents] = useState<{ id: string; name: string }[]>([])
    const bottomRef = useRef<HTMLDivElement>(null)

    async function fetchLogs() {
        const params = new URLSearchParams({ limit: '100' })
        if (filterAgent) params.set('agent', filterAgent)
        if (filterLevel) params.set('level', filterLevel)
        const data = await fetch(`/api/logs?${params}`).then(r => r.json())
        setLogs(data.logs || [])
        setTotal(data.total || 0)
    }
    useEffect(() => { fetch('/api/agents').then(r => r.json()).then(setAgents) }, [])
    useEffect(() => { fetchLogs() }, [filterAgent, filterLevel])
    useEffect(() => {
        if (paused) return
        const interval = setInterval(fetchLogs, 2000)
        return () => clearInterval(interval)
    }, [paused, filterAgent, filterLevel])

    return (
        <>
            <Topbar
                title="Logs do Sistema"
                subtitle={`${total.toLocaleString()} registros totais · polling ${paused ? 'pausado' : 'ativo (2s)'}`}
                actions={
                    <>
                        <select className="form-input" style={{ width: 160, padding: '5px 10px', fontSize: 12 }} value={filterAgent} onChange={e => setFilterAgent(e.target.value)}>
                            <option value="">Todos os agentes</option>
                            {agents.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                        </select>
                        <select className="form-input" style={{ width: 120, padding: '5px 10px', fontSize: 12 }} value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
                            <option value="">Nível</option>
                            {['INFO', 'OK', 'WARN', 'ERR'].map(l => <option key={l}>{l}</option>)}
                        </select>
                        <button className="btn btn-ghost" onClick={() => setPaused(p => !p)}>{paused ? '▶ Retomar' : '⏸ Pausar'}</button>
                        <button className="btn btn-ghost" onClick={() => setLogs([])}>✕ Limpar</button>
                    </>
                }
            />
            <div className="content" style={{ padding: '20px 28px' }}>
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', maxHeight: 'calc(100vh - 160px)', overflowY: 'auto', fontFamily: 'var(--mono)', fontSize: 12 }}>
                    {logs.length === 0 ? (
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text3)' }}>Aguardando logs...</div>
                    ) : [...logs].reverse().map((log, i) => (
                        <div key={log.id} style={{ display: 'flex', gap: 12, padding: '7px 14px', borderBottom: '1px solid var(--border)', alignItems: 'flex-start', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.01)' }}>
                            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', flexShrink: 0, marginTop: 1 }}>
                                {new Date(log.createdAt).toLocaleTimeString('pt-BR')}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: 10, color: LEVEL_COLORS[log.level] || 'var(--text2)', width: 32, flexShrink: 0, textAlign: 'center', marginTop: 1 }}>
                                {log.level}
                            </span>
                            {log.agent && <span style={{ color: 'var(--accent)', fontSize: 10, flexShrink: 0, marginTop: 1, minWidth: 80 }}>{log.agent.name}</span>}
                            <span style={{ color: 'var(--text2)', flex: 1, lineHeight: 1.5 }}>{log.message}</span>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </div>
        </>
    )
}
