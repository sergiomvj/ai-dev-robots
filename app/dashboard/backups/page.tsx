'use client'

import { useState, useEffect } from 'react'
import Topbar from '@/components/layout/Topbar'

interface BackupFile {
    name: string
    path: string
    sizeBytes: number
    createdAt: string
}

export default function BackupsPage() {
    const [backups, setBackups] = useState<BackupFile[]>([])
    const [loading, setLoading] = useState(true)
    const [triggering, setTriggering] = useState(false)

    async function load() {
        setLoading(true)
        const res = await fetch('/api/backups/files')
        const data = await res.json()
        if (Array.isArray(data)) setBackups(data)
        setLoading(false)
    }

    async function triggerBackup() {
        if (!confirm('Deseja iniciar um novo backup agora?')) return
        setTriggering(true)
        try {
            const res = await fetch('/api/backups', { method: 'POST' })
            const data = await res.json()
            if (data.error) alert(data.error)
            else load()
        } catch (e) {
            alert('Erro ao disparar backup')
        }
        setTriggering(false)
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <>
            <Topbar
                title="Backups & Segurança"
                subtitle="Gestão de cópias de segurança locais e remotas"
                actions={(
                    <button
                        className="btn btn-primary"
                        onClick={triggerBackup}
                        disabled={triggering}
                    >
                        {triggering ? 'Executando...' : 'Backup Agora'}
                    </button>
                )}
            />

            <div className="content">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                    {/* Lista de Arquivos */}
                    <div>
                        <div className="section-header">
                            <div className="section-title font-heading">📦 Arquivos Locais</div>
                        </div>
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            {loading ? (
                                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>Buscando arquivos...</div>
                            ) : backups.length === 0 ? (
                                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>Nenhum arquivo de backup encontrado no diretório.</div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
                                            <th style={{ padding: '12px 20px' }}>Nome do Arquivo</th>
                                            <th style={{ padding: '12px 20px' }}>Tamanho</th>
                                            <th style={{ padding: '12px 20px' }}>Data</th>
                                            <th style={{ padding: '12px 20px' }}>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {backups.map((b, i) => (
                                            <tr key={i} style={{ borderBottom: i < backups.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                                <td style={{ padding: '12px 20px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)' }}>{b.name}</td>
                                                <td style={{ padding: '12px 20px', color: 'var(--text2)' }}>{(b.sizeBytes / 1024 / 1024).toFixed(2)} MB</td>
                                                <td style={{ padding: '12px 20px', color: 'var(--text3)' }}>{new Date(b.createdAt).toLocaleString()}</td>
                                                <td style={{ padding: '12px 20px' }}>
                                                    <button className="btn-sm">Restore</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Status & Config */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="card">
                            <div className="font-heading" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Status da Retenção</div>
                            <div style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Retenção Local</span>
                                    <span style={{ fontWeight: 700, color: 'var(--accent3)' }}>7 Dias</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Nuvens (GitHub)</span>
                                    <span style={{ fontWeight: 700, color: 'var(--accent3)' }}>Ativo</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Próximo Agendado</span>
                                    <span style={{ fontWeight: 700, color: 'var(--warn)' }}>Hoje, 03:00</span>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ background: 'var(--bg2)' }}>
                            <div className="font-heading" style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--warn)' }}>⚠️ Atenção</div>
                            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                                Restaurações de banco de dados são destrutivas. Certifique-se de que nenhum agente está em execução antes de prosseguir.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
