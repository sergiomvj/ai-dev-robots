'use client'

import { useState, useEffect } from 'react'
import Topbar from '@/components/layout/Topbar'

interface Project {
    id: string
    name: string
    description?: string
    status: string
    createdAt: string
    tasks: { id: string; status: string }[]
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [newData, setNewData] = useState({ name: '', description: '', status: 'active' })

    async function load() {
        setLoading(true)
        const res = await fetch('/api/projects')
        if (res.ok) {
            const data = await res.json()
            if (Array.isArray(data)) setProjects(data)
        }
        setLoading(false)
    }

    async function handleCreate() {
        if (!newData.name) return
        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newData)
        })
        if (res.ok) {
            setShowModal(false)
            setNewData({ name: '', description: '', status: 'active' })
            load()
        }
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <>
            <Topbar
                title="Projetos & Iniciativas"
                subtitle={`${projects.length} projetos ativos no momento`}
                actions={<button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Novo Projeto</button>}
            />

            <div className="content">
                {loading ? (
                    <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>Carregando projetos...</div>
                ) : projects.length === 0 ? (
                    <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>Nenhum projeto registrado.</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
                        {projects.map(project => {
                            const total = project.tasks?.length || 0
                            const done = project.tasks?.filter(t => t.status === 'done').length || 0
                            const progress = total > 0 ? Math.round((done / total) * 100) : 0

                            return (
                                <div key={project.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div className="font-heading" style={{ fontSize: 16, fontWeight: 700 }}>{project.name}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{project.description || 'Sem descrição detalhada'}</div>
                                        </div>
                                        <div style={{ padding: '4px 8px', background: 'var(--bg3)', borderRadius: 6, fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--accent)' }}>
                                            {(project.status || 'ACTIVE').toUpperCase()}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 10 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text2)', marginBottom: 6 }}>
                                            <span>Progresso</span>
                                            <span>{progress}% ({done}/{total})</span>
                                        </div>
                                        <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.5s ease-out' }} />
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>CRIADO EM {new Date(project.createdAt).toLocaleDateString()}</div>
                                        <button className="btn-sm">Gerenciar →</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Modal Novo Projeto */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: 450, padding: 30 }}>
                        <h3 className="font-heading" style={{ fontSize: 20, marginBottom: 20 }}>🔥 Novo Projeto</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label className="form-label" style={{ fontSize: 10 }}>NOME DO PROJETO</label>
                                <input
                                    className="form-input"
                                    placeholder="Ex: Novo Pipeline de Vendas"
                                    value={newData.name}
                                    onChange={e => setNewData({ ...newData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="form-label" style={{ fontSize: 10 }}>DESCRIÇÃO</label>
                                <textarea
                                    className="form-input"
                                    style={{ height: 80, resize: 'none' }}
                                    placeholder="Descreva o objetivo deste projeto..."
                                    value={newData.description}
                                    onChange={e => setNewData({ ...newData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="form-label" style={{ fontSize: 10 }}>STATUS INICIAL</label>
                                <select
                                    className="form-input"
                                    value={newData.status}
                                    onChange={e => setNewData({ ...newData, status: e.target.value })}
                                >
                                    <option value="active">ATIVO</option>
                                    <option value="sprint">SPRINT</option>
                                    <option value="paused">PAUSADO</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreate}>Criar Projeto</button>
                            <button className="btn" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
