'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'

interface Task {
    id: string
    title: string
    description?: string
    status: string
    priority: string
    agentId: string
    agent: { name: string; avatar: string }
    createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
    open: 'var(--accent)',
    in_progress: 'var(--warn)',
    done: 'var(--accent3)',
    blocked: 'var(--danger)',
}

export default function TasksPage() {
    const searchParams = useSearchParams()
    const agentIdParam = searchParams.get('agentId')

    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')

    async function load() {
        setLoading(true)
        const res = await fetch('/api/tasks')
        const data = await res.json()
        if (Array.isArray(data)) setTasks(data)
        setLoading(false)
    }

    useEffect(() => {
        load()
    }, [])

    const filtered = tasks.filter(t => {
        const matchesAgent = agentIdParam ? t.agentId === agentIdParam : true
        const matchesStatus = filterStatus === 'all' ? true : t.status === filterStatus
        return matchesAgent && matchesStatus
    })

    return (
        <>
            <Topbar
                title="Gestão de Tarefas"
                subtitle={agentIdParam ? `Filtrando tarefas do agente ${tasks.find(t => t.agentId === agentIdParam)?.agent.name || ''}` : 'Monitoramento de execuções e objetivos'}
            />

            <div className="content">
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    {['all', 'open', 'in_progress', 'done', 'blocked'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ textTransform: 'uppercase', fontSize: 10, fontWeight: 700 }}
                        >
                            {s === 'all' ? 'Todas' : s.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>Carregando tarefas...</div>
                ) : filtered.length === 0 ? (
                    <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>Nenhuma tarefa encontrada.</div>
                ) : (
                    <div style={{ display: 'grid', gap: 12 }}>
                        {filtered.map(task => (
                            <div key={task.id} className="card" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 20,
                                padding: '16px 20px',
                                borderLeft: `4px solid ${STATUS_COLORS[task.status] || 'var(--border)'}`
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div className="font-heading" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{task.title}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>{task.description || 'Sem descrição'}</div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)' }}>{task.agent.name}</div>
                                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{new Date(task.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                                        {task.agent.avatar}
                                    </div>
                                </div>

                                <div style={{
                                    padding: '4px 10px',
                                    borderRadius: 20,
                                    fontSize: 10,
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    background: `${STATUS_COLORS[task.status]}22`,
                                    color: STATUS_COLORS[task.status],
                                    border: `1px solid ${STATUS_COLORS[task.status]}44`
                                }}>
                                    {task.status.replace('_', ' ')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
