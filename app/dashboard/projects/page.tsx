'use client'

import { useState, useEffect } from 'react'
import Topbar from '@/components/layout/Topbar'

interface Project { id: string; name: string; description?: string; status: string; progress: number; color: string; tasks?: { id: string; status: string }[] }

const STATUS_LABELS: Record<string, string> = { active: 'Ativo', sprint: 'Sprint', paused: 'Pausado', done: 'Concluído' }
const STATUS_COLORS: Record<string, string> = { active: 'var(--accent3)', sprint: 'var(--accent)', paused: 'var(--warn)', done: 'var(--text3)' }

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [showNew, setShowNew] = useState(false)
    const [editProject, setEditProject] = useState<Project | null>(null)
    const [newProject, setNewProject] = useState({ name: '', description: '', color: '#4f8ef7', status: 'active' })

    async function load() {
        const data = await fetch('/api/projects').then(r => r.json())
        setProjects(data)
    }
    useEffect(() => { load() }, [])

    async function createProject() {
        await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newProject) })
        setShowNew(false); setNewProject({ name: '', description: '', color: '#4f8ef7', status: 'active' }); load()
    }
    async function updateProject() {
        if (!editProject) return
        await fetch(`/api/projects/${editProject.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: editProject.status, progress: editProject.progress, color: editProject.color }) })
        setEditProject(null); load()
    }
    async function deleteProject(id: string) {
        await fetch(`/api/projects/${id}`, { method: 'DELETE' }); load()
    }

    return (
        <>
            <Topbar title="Projetos" subtitle={`${projects.filter(p => p.status !== 'done').length} ativos`} actions={<button className="btn btn-primary" onClick={() => setShowNew(true)}>+ Novo Projeto</button>} />
            <div className="content">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
                    {projects.map(project => {
                        const done = project.tasks?.filter(t => t.status === 'done').length || 0
                        const total = project.tasks?.length || 0
                        return (
                            <div key={project.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: `3px solid ${project.color}`, borderRadius: 'var(--radius)', padding: 18, transition: 'border-color .2s,transform .15s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = '' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <div style={{ fontSize: 15, fontWeight: 800 }}>{project.name}</div>
                                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 700, color: STATUS_COLORS[project.status], background: `${STATUS_COLORS[project.status]}18`, padding: '3px 8px', borderRadius: 20 }}>
                                        {STATUS_LABELS[project.status] || project.status}
                                    </span>
                                </div>
                                {project.description && <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 }}>{project.description}</div>}
                                <div style={{ marginBottom: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>Progresso</span>
                                        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: project.color }}>{project.progress}%</span>
                                    </div>
                                    <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', background: project.color, width: `${project.progress}%`, transition: 'width .5s', borderRadius: 2 }} />
                                    </div>
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 14 }}>{done}/{total} tarefas concluídas</div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn-sm" onClick={() => setEditProject(project)}>✎ Editar</button>
                                    <button className="btn-sm" style={{ color: 'var(--danger)', borderColor: 'rgba(247,84,84,.3)' }} onClick={() => deleteProject(project.id)}>✕ Excluir</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Modal Novo Projeto */}
            <div className={`modal-overlay ${showNew ? 'open' : ''}`} onClick={() => setShowNew(false)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header"><div className="modal-title">⬢ Novo Projeto</div><button className="modal-close" onClick={() => setShowNew(false)}>×</button></div>
                    <div className="modal-body">
                        <div className="form-group"><label className="form-label">NOME</label><input type="text" className="form-input" placeholder="Nome do projeto" value={newProject.name} onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))} /></div>
                        <div className="form-group"><label className="form-label">DESCRIÇÃO</label><textarea className="form-input" placeholder="Objetivo do projeto..." value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} /></div>
                        <div className="form-group">
                            <label className="form-label">COR</label>
                            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                <input type="color" value={newProject.color} style={{ width: 32, height: 32, border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', background: 'none' }} onChange={e => setNewProject(p => ({ ...p, color: e.target.value }))} />
                                <input type="text" className="form-input" value={newProject.color} style={{ flex: 1, fontFamily: 'var(--mono)' }} onChange={e => setNewProject(p => ({ ...p, color: e.target.value }))} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer"><button className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancelar</button><button className="btn btn-primary" onClick={createProject}>Criar Projeto</button></div>
                </div>
            </div>

            {/* Modal Editar Projeto */}
            <div className={`modal-overlay ${editProject ? 'open' : ''}`} onClick={() => setEditProject(null)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header"><div className="modal-title">✎ Editar Projeto</div><button className="modal-close" onClick={() => setEditProject(null)}>×</button></div>
                    {editProject && <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">STATUS</label>
                            <select className="form-input" value={editProject.status} onChange={e => setEditProject(p => p ? ({ ...p, status: e.target.value }) : null)}>
                                {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">PROGRESSO ({editProject.progress}%)</label>
                            <input type="range" min={0} max={100} value={editProject.progress} onChange={e => setEditProject(p => p ? ({ ...p, progress: parseInt(e.target.value) }) : null)} style={{ width: '100%', accentColor: 'var(--accent)', marginTop: 8 }} />
                        </div>
                    </div>}
                    <div className="modal-footer"><button className="btn btn-ghost" onClick={() => setEditProject(null)}>Cancelar</button><button className="btn btn-primary" onClick={updateProject}>Salvar</button></div>
                </div>
            </div>
        </>
    )
}
