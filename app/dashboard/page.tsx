import { prisma } from '@/lib/db'
import Topbar from '@/components/layout/Topbar'

export default async function OverviewPage() {
    const [agents, tasks, projects, recentLogs] = await Promise.all([
        prisma.agent.findMany({ select: { id: true, status: true, lastSeen: true } }),
        prisma.task.groupBy({ by: ['status'], _count: true }),
        prisma.project.count(),
        prisma.log.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { agent: { select: { name: true, avatar: true } } },
        }),
    ])

    const onlineCount = agents.filter((a: any) => a.status === 'online' || a.status === 'busy').length
    const taskMap = Object.fromEntries(tasks.map((t: any) => [t.status, t._count]))
    const openTasks = (taskMap['open'] || 0) + (taskMap['in_progress'] || 0)

    const levelColors: Record<string, string> = {
        OK: 'var(--accent3)', INFO: 'var(--accent)', WARN: 'var(--warn)', ERR: 'var(--danger)',
    }

    return (
        <>
            <Topbar
                title="Overview"
                subtitle={`${onlineCount} agentes online · ${new Date().toLocaleString('pt-BR')}`}
            />

            <div className="content">
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
                    <div className="stat-card" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                        <div className="stat-value font-heading" style={{ color: 'var(--accent3)' }}>{onlineCount}</div>
                        <div className="stat-label">Agentes Ativos</div>
                        <div className="stat-sub">{agents.length} registrados</div>
                    </div>
                    <div className="stat-card" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                        <div className="stat-value font-heading" style={{ color: 'var(--warn)' }}>{openTasks}</div>
                        <div className="stat-label">Tarefas em Curso</div>
                        <div className="stat-sub">{taskMap['blocked'] || 0} bloqueadas</div>
                    </div>
                    <div className="stat-card" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                        <div className="stat-value font-heading" style={{ color: 'var(--accent)' }}>{projects}</div>
                        <div className="stat-label">Projetos</div>
                        <div className="stat-sub">{taskMap['done'] || 0} tarefas concluídas</div>
                    </div>
                    <div className="stat-card" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                        <div className="stat-value font-heading" style={{ color: 'var(--text)' }}>
                            {agents.filter((a: any) => a.lastSeen).length > 0
                                ? Math.round((Date.now() - new Date(agents.filter((a: any) => a.lastSeen)[0]?.lastSeen!).getTime()) / 60000) + 'min'
                                : '--'}
                        </div>
                        <div className="stat-label">Último Heartbeat</div>
                        <div style={{ display: 'flex', gap: 2, marginTop: 6 }}>
                            {Array.from({ length: 7 }, (_, i) => (
                                <div key={i} className={`hb-tick ${i < 4 ? 'active' : ''}`} style={{ height: [10, 14, 8, 12, 10, 7, 13][i] }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feed de Atividade */}
                <div>
                    <div className="section-header">
                        <div>
                            <div className="section-title font-heading" style={{ fontSize: 18, fontWeight: 700 }}>📋 Atividade Recente</div>
                            <div className="section-count">Últimas {recentLogs.length} entradas de log</div>
                        </div>
                    </div>
                    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                        {recentLogs.length === 0 ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 12 }}>
                                Nenhum log registrado ainda
                            </div>
                        ) : recentLogs.map((log: any, i: number) => (
                            <div key={log.id} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 12,
                                padding: '10px 16px',
                                borderBottom: i < recentLogs.length - 1 ? '1px solid var(--border)' : 'none',
                                fontSize: 12,
                            }}>
                                <span style={{
                                    fontFamily: 'var(--mono)',
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: levelColors[log.level] || 'var(--text2)',
                                    width: 32,
                                    flexShrink: 0,
                                    marginTop: 1,
                                }}>
                                    {log.level}
                                </span>
                                <span style={{ flex: 1, color: 'var(--text2)' }}>{log.message}</span>
                                <span style={{ color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 10, flexShrink: 0 }}>
                                    {log.agent?.name ?? 'sistema'} · {new Date(log.createdAt).toLocaleTimeString('pt-BR')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
