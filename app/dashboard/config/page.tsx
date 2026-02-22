'use client'

import { useState, useEffect } from 'react'
import Topbar from '@/components/layout/Topbar'

interface Config { id: string; key: string; value: string; description?: string }

const CONFIG_DESCRIPTIONS: Record<string, string> = {
    heartbeat_interval: 'Intervalo de heartbeat dos agentes (segundos)',
    telegram_token: 'Token do bot do Telegram',
    openrouter_key: 'Chave de API do OpenRouter',
    workspace_path: 'Caminho da workspace compartilhada no VPS',
    admin_email: 'Email do administrador padrão',
    auto_backup: 'Ativar backup automático (true/false)',
    backup_schedule: 'Cron para backup automático',
}

export default function ConfigPage() {
    const [configs, setConfigs] = useState<Config[]>([])
    const [edits, setEdits] = useState<Record<string, string>>({})
    const [saving, setSaving] = useState<Record<string, boolean>>({})

    async function load() {
        const data = await fetch('/api/config').then(r => r.json())
        setConfigs(data)
        const e: Record<string, string> = {}
        data.forEach((c: Config) => { e[c.key] = c.value })
        setEdits(e)
    }
    useEffect(() => { load() }, [])

    async function save(key: string) {
        setSaving(s => ({ ...s, [key]: true }))
        await fetch('/api/config', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: edits[key] }) })
        setSaving(s => ({ ...s, [key]: false })); load()
    }

    const isSensitive = (key: string) => key.includes('token') || key.includes('key') || key.includes('secret')

    return (
        <>
            <Topbar title="Configurações" subtitle={`${configs.length} parâmetros definidos`} />
            <div className="content">
                <div style={{ maxWidth: 700 }}>
                    {configs.map(config => (
                        <div key={config.key} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <div>
                                    <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--accent)', letterSpacing: 1 }}>{config.key}</div>
                                    {CONFIG_DESCRIPTIONS[config.key] && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{CONFIG_DESCRIPTIONS[config.key]}</div>}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                    type={isSensitive(config.key) ? 'password' : 'text'}
                                    className="form-input"
                                    style={{ flex: 1, fontFamily: 'var(--mono)', fontSize: 12 }}
                                    value={edits[config.key] || ''}
                                    onChange={e => setEdits(ex => ({ ...ex, [config.key]: e.target.value }))}
                                />
                                <button
                                    className="btn btn-primary"
                                    style={{ padding: '0 16px', opacity: edits[config.key] === config.value ? 0.5 : 1 }}
                                    onClick={() => save(config.key)}
                                    disabled={saving[config.key]}
                                >
                                    {saving[config.key] ? '⟳' : '✓ Salvar'}
                                </button>
                            </div>
                        </div>
                    ))}
                    {configs.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 12, padding: 24 }}>
                            Nenhuma configuração encontrada. Execute o seed: <code>npm run db:seed</code>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
