'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'

interface Agent {
    id: string; name: string; role: string; avatar: string; status: string
    teams: string[]; commands: string[]; description: string; model: string
    lastSeen: string | null; uptime: number; tasks?: { id: string }[]
}
interface Team { id: string; name: string; slug: string; color: string; icon: string; description: string }
interface WorkspaceData { [folder: string]: string[] }

const TEAM_COLORS: Record<string, string> = {
    core: '#4f8ef7', backend: '#7b5ef8', frontend: '#3dd68c', marketing: '#f7a94f',
}
const TEAM_ICONS: Record<string, string> = {
    core: '⬡', backend: '⬢', frontend: '◈', marketing: '✦',
}

function timeSince(dateStr: string | null) {
    if (!dateStr) return 'nunca'
    const minutes = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
    if (minutes < 60) return `há ${minutes}min`
    if (minutes < 1440) return `há ${Math.floor(minutes / 60)}h`
    return `há ${Math.floor(minutes / 1440)}d`
}

export default function AgentsPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('agents')
    const [agents, setAgents] = useState<Agent[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [workspace, setWorkspace] = useState<WorkspaceData>({})
    const [filterTeam, setFilterTeam] = useState('all')
    const [showNewAgent, setShowNewAgent] = useState(false)
    const [showNewTeam, setShowNewTeam] = useState(false)
    const [editAgent, setEditAgent] = useState<Agent | null>(null)
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
    const [fileContent, setFileContent] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<string | null>(null)
    const [newAgent, setNewAgent] = useState({ name: '', role: '', description: '', model: '', teams: [] as string[], commands: [] as string[] })
    const [newTeam, setNewTeam] = useState({ name: '', description: '', color: '#f97316', icon: '⬡', slug: '', members: [] as string[] })
    const [availableModels, setAvailableModels] = useState<string[]>([])
    const [hbActive, setHbActive] = useState([true, true, true, true, false, false, false])
    const hbTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    async function load() {
        const [ag, tm, ws, md] = await Promise.all([
            fetch('/api/agents').then(r => r.json()),
            fetch('/api/teams').then(r => r.json()),
            fetch('/api/workspace').then(r => r.json()),
            fetch('/api/config/llms').then(r => r.json()),
        ])
        if (Array.isArray(ag)) setAgents(ag)
        if (Array.isArray(tm)) setTeams(tm)
        if (ws && typeof ws === 'object' && !Array.isArray(ws)) setWorkspace(ws)
        if (Array.isArray(md)) {
            setAvailableModels(md)
            if (md.length > 0) setNewAgent(a => ({ ...a, model: md[0] }))
        }
    }
    useEffect(() => {
        load()
        hbTimerRef.current = setInterval(() => {
            const n = Math.floor(Math.random() * 5) + 2
            setHbActive(Array.from({ length: 7 }, (_, i) => i < n))
        }, 1500)
        return () => { if (hbTimerRef.current) clearInterval(hbTimerRef.current) }
    }, [])

    const filtered = filterTeam === 'all' ? agents : agents.filter(a => a.teams.includes(filterTeam))

    async function createAgent() {
        await fetch('/api/agents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newAgent, avatar: '🤖', status: 'offline' }) })
        setShowNewAgent(false); load()
    }
    async function updateAgent() {
        if (!editAgent) return
        await fetch(`/api/agents/${editAgent.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ teams: editAgent.teams, commands: editAgent.commands, model: editAgent.model, status: editAgent.status }) })
        setEditAgent(null); load()
    }
    async function createTeam() {
        const slug = newTeam.name.toLowerCase().replace(/\s+/g, '-')
        await fetch('/api/teams', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newTeam, slug }) })
        setShowNewTeam(false); load()
    }
    async function loadFile(folder: string, file: string) {
        setSelectedFolder(folder); setSelectedFile(file); setFileContent('Carregando...')
        const res = await fetch(`/api/workspace/${folder}/${file}`)
        const data = await res.json()
        setFileContent(data.content || '')
    }

    const folderIcons: Record<string, string> = { Commands: '⌘', Skills: '⚡', Hooks: '🔗', Scripts: '📜', Connectors: '🔌', MCP: '🔧' }

    const teamCounts: Record<string, number> = {}
    agents.forEach(a => a.teams.forEach(t => { teamCounts[t] = (teamCounts[t] || 0) + 1 }))

    const ALL_COMMANDS = ['email', 'inbox', 'agenda', 'notify', 'github', 'report']
    const ALL_TEAM_SLUGS = ['core', 'backend', 'frontend', 'marketing']

    return (
        <>
            <Topbar
                title="Agentes & Recursos"
                subtitle={`${agents.filter(a => a.status !== 'offline').length} agentes online · última sync agora`}
                actions={
                    <>
                        <button className="btn btn-ghost" onClick={() => setShowNewTeam(true)}>+ Novo Time</button>
                        <button className="btn btn-primary" onClick={() => setShowNewAgent(true)}>+ Novo Agente</button>
                    </>
                }
            />

            <div className="tabs">
                {[['agents', '🤖 AGENTES'], ['workspace', '📁 WORKSPACE'], ['teams', '👥 TIMES']].map(([id, label]) => (
                    <div key={id} className={`tab ${activeTab === id ? 'active' : ''}`} style={{ fontWeight: 700, letterSpacing: '0.5px' }} onClick={() => setActiveTab(id)}>{label}</div>
                ))}
            </div>

            <div className="content">

                {/* TAB AGENTES */}
                {activeTab === 'agents' && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
                            <div className="stat-card" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}><div className="stat-value font-heading" style={{ color: 'var(--accent3)' }}>{agents.filter(a => a.status !== 'offline').length}</div><div className="stat-label">Agentes Ativos</div></div>
                            <div className="stat-card" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}><div className="stat-value font-heading" style={{ color: 'var(--accent)' }}>{teams.length}</div><div className="stat-label">Times</div></div>
                            <div className="stat-card" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}><div className="stat-value font-heading" style={{ color: 'var(--warn)' }}>{agents.reduce((s, a) => s + (a.tasks?.length || 0), 0)}</div><div className="stat-label">Tarefas em Curso</div></div>
                            <div className="stat-card" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}><div className="stat-value font-heading" style={{ color: 'var(--text)' }}>5min</div><div className="stat-label">Próximo Heartbeat</div><div className="heartbeat-bar">{[10, 14, 8, 12, 10, 7, 13].map((h, i) => <div key={i} className={`hb-tick${hbActive[i] ? ' active' : ''}`} style={{ height: h }} />)}</div></div>
                        </div>

                        {/* Team filter pills */}
                        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                            {[{ slug: 'all', label: 'Todos', color: '#8892b0', count: agents.length }, ...teams.map(t => ({ slug: t.slug, label: `${TEAM_ICONS[t.slug] || '⬡'} ${t.name}`, color: t.color, count: teamCounts[t.slug] || 0 }))].map(t => (
                                <div key={t.slug} onClick={() => setFilterTeam(t.slug)} style={{
                                    display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 30,
                                    border: `1px solid ${t.color}4d`, color: t.color, fontSize: 12, fontWeight: 700,
                                    cursor: 'pointer', opacity: filterTeam === t.slug ? 1 : 0.55, transition: 'opacity .15s', userSelect: 'none',
                                }}>
                                    {t.label} <span style={{ fontSize: 10, fontFamily: 'var(--mono)', padding: '1px 6px', borderRadius: 10, background: 'rgba(255,255,255,.08)' }}>{t.count}</span>
                                </div>
                            ))}
                        </div>

                        {/* Agents grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
                            {filtered.map(agent => {
                                const statusLabel: Record<string, string> = { online: 'Online', busy: 'Ocupado', idle: 'Idle', offline: 'Offline' }
                                return (
                                    <div key={agent.id} className="agent-card" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', transition: 'all .2s' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px -10px rgba(0,0,0,0.5)' }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                                        <div style={{ height: 3, background: agent.teams[0] ? `linear-gradient(90deg,${TEAM_COLORS[agent.teams[0]] || '#4f8ef7'},${TEAM_COLORS[agent.teams[1]] || TEAM_COLORS[agent.teams[0]] || '#7b5ef8'})` : 'var(--accent)' }} />
                                        <div style={{ padding: 18 }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, background: `linear-gradient(135deg,${(TEAM_COLORS[agent.teams[0]] || '#f97316')}22,${(TEAM_COLORS[agent.teams[1]] || TEAM_COLORS[agent.teams[0]] || '#ea580c')}22)` }}>{agent.avatar}</div>
                                                    <div><div className="font-heading" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.3px' }}>{agent.name}</div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginTop: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{agent.role}</div></div>
                                                </div>
                                                <div className={`agent-status-badge status-${agent.status}`}><span className={`dot dot-${agent.status === 'online' ? 'green' : agent.status === 'busy' ? 'warn' : 'blue'}`} />{statusLabel[agent.status] || agent.status}</div>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                                                {agent.teams.map(t => <span key={t} className={`team-badge tc-${t}`}><span className="tbdot" />{t}</span>)}
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                                                {agent.commands.map(c => <span key={c} style={{ padding: '2px 7px', borderRadius: 4, fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 700, background: 'rgba(79,142,247,.08)', color: 'var(--accent)', border: '1px solid rgba(79,142,247,.18)' }}>/{c}</span>)}
                                            </div>
                                            {agent.description && <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 }}>{agent.description}</div>}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                                {[['Modelo', agent.model], ['Heartbeat', timeSince(agent.lastSeen)], ['Tarefas', `${agent.tasks?.length || 0} ativas`], ['Uptime', `${agent.uptime}%`]].map(([l, v]) => (
                                                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
                                                        <span style={{ color: 'var(--text3)', width: 70, flexShrink: 0 }}>{l}</span>
                                                        <span style={{ color: 'var(--text)' }}>{v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, background: 'rgba(0,0,0,.15)' }}>
                                            <button className="btn-sm" title="Abrir chat do agente">💬 Chat</button>
                                            <button className="btn-sm" onClick={() => router.push(`/dashboard/tasks?agentId=${agent.id}`)}>📋 Tarefas</button>
                                            <button className="btn-sm" onClick={() => router.push(`/dashboard/logs?agentId=${agent.id}`)}>📊 Logs</button>
                                            <button className="btn-sm" onClick={() => setEditAgent(agent)}>✎ Editar</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* TAB WORKSPACE */}
                {activeTab === 'workspace' && (
                    <>
                        <div className="section-header">
                            <div><div className="section-title">📁 Workspace Compartilhada</div><div className="section-count">Recursos acessíveis por todos os agentes · /workspace</div></div>
                            <div style={{ display: 'flex', gap: 8 }}><button className="btn btn-ghost">+ Novo Arquivo</button><button className="btn btn-ghost">↓ Sync GitHub</button></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 12 }}>
                            {Object.entries(workspace).map(([folder, files]) => (
                                <div key={folder} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, cursor: 'pointer', transition: 'all .15s' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface2)' }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                        <span style={{ fontSize: 24 }}>{folderIcons[folder] || '📁'}</span>
                                        <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.2px' }}>{folder}</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        {files.slice(0, 4).map(file => (
                                            <div key={file} onClick={() => loadFile(folder, file)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 5, background: 'var(--bg3)', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', cursor: 'pointer', transition: 'all .12s' }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)' }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg3)'; (e.currentTarget as HTMLElement).style.color = 'var(--text2)' }}>
                                                <span style={{ padding: '1px 5px', borderRadius: 3, fontSize: 9, fontWeight: 700, background: file.endsWith('.sh') ? 'rgba(61,214,140,.12)' : 'rgba(79,142,247,.15)', color: file.endsWith('.sh') ? 'var(--accent3)' : 'var(--accent)' }}>{file.split('.').pop()}</span>
                                                <span style={{ color: file.startsWith('/') ? 'var(--accent)' : undefined, fontWeight: file.startsWith('/') ? 700 : undefined }}>{file}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{files.length} arquivos</span>
                                        <button className="btn-sm" style={{ fontSize: 10 }}>Ver todos →</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedFile && (
                            <div style={{ marginTop: 20 }}>
                                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                        <span style={{ fontSize: 24 }}>📖</span>
                                        <div style={{ fontSize: 14, fontWeight: 800 }}>{selectedFolder}/{selectedFile}</div>
                                        <button className="btn-sm" style={{ marginLeft: 'auto' }} onClick={() => { setSelectedFile(null); setFileContent(null) }}>✕ Fechar</button>
                                    </div>
                                    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.7, padding: 16, color: 'var(--text2)', maxHeight: 300, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                                        {fileContent}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* TAB TIMES */}
                {activeTab === 'teams' && (
                    <>
                        <div className="section-header">
                            <div><div className="section-title">👥 Gestão de Times</div><div className="section-count">Membros podem pertencer a múltiplos times</div></div>
                            <button className="btn btn-primary" onClick={() => setShowNewTeam(true)}>+ Criar Time</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
                            {teams.map(team => (
                                <div key={team.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: `3px solid ${team.color}`, borderRadius: 'var(--radius)', padding: 16 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <span style={{ fontSize: 20 }}>{team.icon}</span>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: team.color }}>{team.name}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{team.description}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                                        {agents.filter(a => a.teams.includes(team.slug)).map(a => (
                                            <span key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: 'var(--bg3)', borderRadius: 6, fontSize: 12 }}>{a.avatar} {a.name}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* MODAL NOVO AGENTE */}
            <div className={`modal-overlay ${showNewAgent ? 'open' : ''}`} onClick={() => setShowNewAgent(false)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header"><div className="modal-title">🤖 Novo Agente</div><button className="modal-close" onClick={() => setShowNewAgent(false)}>×</button></div>
                    <div className="modal-body">
                        {[['NOME', 'name', 'text', 'Ex: João Silva'], ['FUNÇÃO', 'role', 'text', 'Ex: data analyst']].map(([l, k, t, p]) => (
                            <div key={k} className="form-group"><label className="form-label">{l}</label><input type={t} className="form-input" placeholder={p} value={(newAgent as Record<string, unknown>)[k] as string} onChange={e => setNewAgent(a => ({ ...a, [k]: e.target.value }))} /></div>
                        ))}
                        <div className="form-group"><label className="form-label">DESCRIÇÃO</label><textarea className="form-input" placeholder="Responsabilidades..." value={newAgent.description} onChange={e => setNewAgent(a => ({ ...a, description: e.target.value }))} /></div>
                        <div className="form-group">
                            <label className="form-label">TIMES</label>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                                {ALL_TEAM_SLUGS.map(slug => {
                                    const t = teams.find(t => t.slug === slug); if (!t) return null
                                    return <label key={slug} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer' }}><input type="checkbox" style={{ accentColor: t.color }} checked={newAgent.teams.includes(slug)} onChange={e => setNewAgent(a => ({ ...a, teams: e.target.checked ? [...a.teams, slug] : a.teams.filter(x => x !== slug) }))} /><span style={{ color: t.color }}>{t.icon} {t.name}</span></label>
                                })}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">COMANDOS</label>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                                {ALL_COMMANDS.map(cmd => <label key={cmd} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, cursor: 'pointer', fontFamily: 'var(--mono)' }}><input type="checkbox" style={{ accentColor: 'var(--accent)' }} checked={newAgent.commands.includes(cmd)} onChange={e => setNewAgent(a => ({ ...a, commands: e.target.checked ? [...a.commands, cmd] : a.commands.filter(x => x !== cmd) }))} />/{cmd}</label>)}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">MODELO LLM</label>
                            <select className="form-input" value={newAgent.model} onChange={e => setNewAgent(a => ({ ...a, model: e.target.value }))}>
                                {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer"><button className="btn btn-ghost" onClick={() => setShowNewAgent(false)}>Cancelar</button><button className="btn btn-primary" onClick={createAgent}>Criar Agente</button></div>
                </div>
            </div>

            {/* MODAL EDITAR AGENTE */}
            <div className={`modal-overlay ${editAgent ? 'open' : ''}`} onClick={() => setEditAgent(null)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header"><div className="modal-title">✎ Editar Agente</div><button className="modal-close" onClick={() => setEditAgent(null)}>×</button></div>
                    {editAgent && <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">TIMES</label>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                                {ALL_TEAM_SLUGS.map(slug => { const t = teams.find(t => t.slug === slug); if (!t) return null; return <label key={slug} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer' }}><input type="checkbox" style={{ accentColor: t.color }} checked={editAgent.teams.includes(slug)} onChange={e => setEditAgent(a => a ? ({ ...a, teams: e.target.checked ? [...a.teams, slug] : a.teams.filter(x => x !== slug) }) : null)} /><span style={{ color: t.color }}>{t.icon} {t.name}</span></label> })}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">COMANDOS</label>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                                {ALL_COMMANDS.map(cmd => <label key={cmd} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, cursor: 'pointer', fontFamily: 'var(--mono)' }}><input type="checkbox" style={{ accentColor: 'var(--accent)' }} checked={editAgent.commands.includes(cmd)} onChange={e => setEditAgent(a => a ? ({ ...a, commands: e.target.checked ? [...a.commands, cmd] : a.commands.filter(x => x !== cmd) }) : null)} />/{cmd}</label>)}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">MODELO LLM</label>
                            <select className="form-input" value={editAgent.model} onChange={e => setEditAgent(a => a ? ({ ...a, model: e.target.value }) : null)}>
                                {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">STATUS</label>
                            <select className="form-input" value={editAgent.status} onChange={e => setEditAgent(a => a ? ({ ...a, status: e.target.value }) : null)}>
                                {['online', 'busy', 'idle', 'offline'].map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>}
                    <div className="modal-footer"><button className="btn btn-ghost" onClick={() => setEditAgent(null)}>Cancelar</button><button className="btn btn-primary" onClick={updateAgent}>Salvar</button></div>
                </div>
            </div>

            {/* MODAL NOVO TIME */}
            <div className={`modal-overlay ${showNewTeam ? 'open' : ''}`} onClick={() => setShowNewTeam(false)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header"><div className="modal-title">👥 Novo Time</div><button className="modal-close" onClick={() => setShowNewTeam(false)}>×</button></div>
                    <div className="modal-body">
                        <div className="form-group"><label className="form-label">NOME</label><input type="text" className="form-input" placeholder="Ex: Data Science" value={newTeam.name} onChange={e => setNewTeam(t => ({ ...t, name: e.target.value }))} /></div>
                        <div className="form-group"><label className="form-label">OBJETIVO</label><textarea className="form-input" placeholder="Objetivo e responsabilidade..." value={newTeam.description} onChange={e => setNewTeam(t => ({ ...t, description: e.target.value }))} /></div>
                        <div className="form-group">
                            <label className="form-label">COR</label>
                            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                <input type="color" value={newTeam.color} style={{ width: 32, height: 32, border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', background: 'none' }} onChange={e => setNewTeam(t => ({ ...t, color: e.target.value }))} />
                                <input type="text" className="form-input" value={newTeam.color} style={{ flex: 1, fontFamily: 'var(--mono)' }} onChange={e => setNewTeam(t => ({ ...t, color: e.target.value }))} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">MEMBROS</label>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                                {agents.map(a => (
                                    <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer' }}>
                                        <input type="checkbox" checked={newTeam.members.includes(a.id)} onChange={e => setNewTeam(t => ({ ...t, members: e.target.checked ? [...t.members, a.id] : t.members.filter(x => x !== a.id) }))} />
                                        {a.avatar} {a.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer"><button className="btn btn-ghost" onClick={() => setShowNewTeam(false)}>Cancelar</button><button className="btn btn-primary" onClick={createTeam}>Criar Time</button></div>
                </div>
            </div>
        </>
    )
}
