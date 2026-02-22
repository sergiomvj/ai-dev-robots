'use client'

interface TopbarProps {
    title: string
    subtitle?: string
    actions?: React.ReactNode
}

export default function Topbar({ title, subtitle, actions }: TopbarProps) {
    return (
        <header style={{
            height: 60,
            background: 'var(--bg2)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
        }}>
            <div>
                <div className="font-heading" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.3px' }}>{title}</div>
                {subtitle && (
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 1 }}>
                        {subtitle}
                    </div>
                )}
            </div>
            {actions && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {actions}
                </div>
            )}
        </header>
    )
}
