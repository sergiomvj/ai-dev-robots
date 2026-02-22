'use client'

import { useState, useEffect } from 'react'
import Topbar from '@/components/layout/Topbar'

interface Backup { id: string; name: string; path: string; type: string; size?: number; createdAt: string }

export default function BackupsPage() {
    const [backups, setBackups] = useState<Backup[]>([])
    const [loading, setLoading] = useState(false)

    async function load() {
        const data = await fetch('/api/backups').then(r => r.json())
        setBackups(data)
    }
    useEffect(() => { load() }, [])

    async function runBackup() {
        setLoading(true)
        await fetch('/api/backups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'manual' }) })
        await load(); setLoading(false)
    }

    return (
        <>
            <Topbar
                title="Backups"
                subtitle={`${backups.length} backups registrados`}
                actions={<button className="btn btn-primary" onClick={runBackup} disabled={loading}>{loading ? '⟳ Executando...' : '💾 Executar Backup'}</button>}
            />
            <div className="content">
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    {backups.length === 0 ? (
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 12 }}>Nenhum backup registrado. Clique em "Executar Backup" para começar.</div>
                    ) : backups.map((backup, i) => (
                        <div key={backup.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderBottom: i < backups.length - 1 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                            <span style={{ fontSize: 20 }}>💾</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700 }}>{backup.name}</div>
                                <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 2 }}>{backup.path}</div>
                            </div>
                            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text2)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 4 }}>{backup.type}</span>
                            <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{new Date(backup.createdAt).toLocaleString('pt-BR')}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
