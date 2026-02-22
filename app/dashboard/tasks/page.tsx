'use client'

import { useState, useEffect } from 'react'
import Topbar from '@/components/layout/Topbar'

interface Task { id: string; title: string; description?: string; status: string; priority: string; dueAt?: string; agent?: { id: string; name: string; avatar: string }; project?: { id: string; name: string } }
interface Agent { id: string; name: string; avatar: string }
interface Project { id: string; name: string }

const PRIORITY_COLORS: Record<string, string> = { high: 'var(--danger)', medium: 'var(--warn)', low: 'var(--accent)' }
const STATUS_LABELS: Record<string, string> = { open: 'Aberta', in_progress: 'Em andamento', blocked: 'Bloqueada', done: 'Concluída' }

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [agents, setAgents] = useState<Agent[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [filterAgent, setFilterAgent] = useState('')
    const [filterPriority, setFilterPriority] = useState('')
    const [showNew, setShowNew] = useState(false)
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', agentId: '', projectId: '', dueAt: '' })

    async function load() {
        const params = new URLSearchParams()
        if (filterAgent) params.set('agentId', filterAgent)
        if (filterPriority) params.set('priority', filterPriority)
        const [ts, ag, pr] = await Promise.all([
            fetch(`/api/tasks?${params}`).then(r => r.json()).catch(() => []),
            fetch('/api/agents').then(r => r.json()).catch(() => []),
            fetch('/api/projects').then(r => r.json()).catch(() => []),
        ])
        if (Array.isArray(ts)) setTasks(ts)
        if (Array.isArray(ag)) setAgents(ag)
        if (Array.isArray(pr)) setProjects(pr)
    }

    useEffect(() => { load() }, [filterAgent, filterPriority])

    async function toggleStatus(task: Task) {
        const next = task.status === 'done' ? 'open' : task.status === 'open' ? 'in_progress' : 'done'
        await fetch(`/api/tasks/${task.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) })
        load()
    }
    async function deleteTask(id: string) {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' }); load()
    }
    async function createTask() {
        await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newTask, agentId: newTask.agentId || null, projectId: newTask.projectId || null, dueAt: newTask.dueAt || null }) })
        setShowNew(false); load()
    }

    return (
        <>
            <Topbar
                title="Tarefas"
                subtitle={`${tasks.filter(t => t.status !== 'done').length} abertas · ${tasks.filter(t => t.status === 'done').length} concluídas`}
                actions={<button className="btn btn-primary" onClick={() => setShowNew(true)}>+ Nova Tarefa</button>}
            />
            <div className="content">
                {/* Filtros */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    <select className="form-input" style={{ width: 180 }} value={filterAgent} onChange={e => setFilterAgent(e.target.value)}>
                        <option value="">Todos os agentes</option>
                        {agents.map(a => <option key={a.id} value={a.id}>{a.avatar} {a.name}</option>)}
                    </select>
                    <select className="form-input" style={{ width: 160 }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                        <option value="">Todas as prioridades</option>
                        <option value="high">Alta</option>
                        <option value="medium">Média</option>
                        <option value="low">Baixa</option>
                    </select>
                </div>

                {/* Task list */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    {tasks.length === 0 ? (
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 12 }}>Nenhuma tarefa encontrada</div>
                    ) : tasks.map((task, i) => (
                        <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 'none' }}>
                            <input type="checkbox" checked={task.status === 'done'} onChange={() => toggleStatus(task)} style={{ accentColor: 'var(--accent)', width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, textDecoration: task.status === 'done' ? 'line-through' : 'none', color: task.status === 'done' ? 'var(--text3)' : 'var(--text)' }}>{task.title}</div>
                                {task.description && <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{task.description}</div>}
                            </div>
                            {task.project && <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 7px', borderRadius: 4 }}>{task.project.name}</span>}
                            {task.agent && <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{task.agent.avatar} {task.agent.name}</span>}
                            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 700, color: PRIORITY_COLORS[task.priority], width: 42, textAlign: 'center' }}>{task.priority.toUpperCase()}</span>
                            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{STATUS_LABELS[task.status] || task.status}</span>
                            <button className="btn-sm" onClick={() => deleteTask(task.id)} style={{ color: 'var(--danger)', borderColor: 'rgba(247,84,84,.3)', fontSize: 10 }}>✕</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Nova Tarefa */}
            <div className={`modal-overlay ${showNew ? 'open' : ''}`} onClick={() => setShowNew(false)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header"><div className="modal-title">✓ Nova Tarefa</div><button className="modal-close" onClick={() => setShowNew(false)}>×</button></div>
                    <div className="modal-body">
                        <div className="form-group"><label className="form-label">TÍTULO</label><input type="text" className="form-input" placeholder="Descreva a tarefa..." value={newTask.title} onChange={e => setNewTask(t => ({ ...t, title: e.target.value }))} /></div>
                        <div className="form-group"><label className="form-label">DESCRIÇÃO</label><textarea className="form-input" placeholder="Detalhes opcionais..." value={newTask.description} onChange={e => setNewTask(t => ({ ...t, description: e.target.value }))} /></div>
                        <div className="form-group">
                            <label className="form-label">PRIORIDADE</label>
                            <select className="form-input" value={newTask.priority} onChange={e => setNewTask(t => ({ ...t, priority: e.target.value }))}>
                                <option value="high">Alta</option><option value="medium">Média</option><option value="low">Baixa</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">AGENTE</label>
                            <select className="form-input" value={newTask.agentId} onChange={e => setNewTask(t => ({ ...t, agentId: e.target.value }))}>
                                <option value="">Sem agente</option>
                                {agents.map(a => <option key={a.id} value={a.id}>{a.avatar} {a.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">PROJETO</label>
                            <select className="form-input" value={newTask.projectId} onChange={e => setNewTask(t => ({ ...t, projectId: e.target.value }))}>
                                <option value="">Sem projeto</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer"><button className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancelar</button><button className="btn btn-primary" onClick={createTask}>Criar Tarefa</button></div>
                </div>
            </div>
        </>
    )
}
