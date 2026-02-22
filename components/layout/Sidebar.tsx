'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
    { section: 'Principal' },
    { href: '/dashboard', icon: '⬡', label: 'Overview' },
    { href: '/dashboard/agents', icon: '🤖', label: 'Agentes' },
    { href: '/dashboard/tasks', icon: '✓', label: 'Tarefas' },
    { href: '/dashboard/projects', icon: '⬢', label: 'Projetos' },
    { section: 'Sistema' },
    { href: '/dashboard/logs', icon: '📊', label: 'Logs' },
    { href: '/dashboard/backups', icon: '💾', label: 'Backups' },
    { href: '/dashboard/config', icon: '⚙️', label: 'Config' },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside style={{
            width: 220,
            minHeight: '100vh',
            background: 'var(--bg2)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0, left: 0, bottom: 0,
            zIndex: 100,
        }}>
            {/* Logo */}
            <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 34, height: 34,
                        background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18,
                    }}>🤖</div>
                    <div>
                        <div className="font-heading" style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>AI-DEV-ROBOT</div>
                        <div style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'var(--mono)', marginTop: 0, fontWeight: 700, opacity: 0.8 }}>dashboard.fbrapps.com</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navItems.map((item, i) => {
                    if ('section' in item) {
                        return (
                            <div key={i} style={{
                                fontSize: 10,
                                fontFamily: 'var(--mono)',
                                color: 'var(--text3)',
                                letterSpacing: 1,
                                padding: '12px 12px 4px',
                                textTransform: 'uppercase',
                            }}>
                                {item.section}
                            </div>
                        )
                    }
                    const isActive = item.href === '/dashboard'
                        ? pathname === '/dashboard'
                        : pathname.startsWith(item.href!)

                    return (
                        <Link
                            key={item.href}
                            href={item.href!}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '9px 12px',
                                borderRadius: 'var(--radius2)',
                                cursor: 'pointer',
                                color: isActive ? 'var(--accent)' : 'var(--text2)',
                                fontSize: 13,
                                fontWeight: 600,
                                transition: 'all .15s',
                                textDecoration: 'none',
                                background: isActive ? 'rgba(249,115,22,0.12)' : 'transparent',
                            }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    (e.currentTarget as HTMLElement).style.background = 'var(--surface)'
                                        ; (e.currentTarget as HTMLElement).style.color = 'var(--text)'
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                                        ; (e.currentTarget as HTMLElement).style.color = 'var(--text2)'
                                }
                            }}
                        >
                            <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
                <div style={{
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius2)',
                    padding: '10px 12px',
                    fontSize: 11,
                    fontFamily: 'var(--mono)',
                }}>
                    {[
                        { label: 'VPS', dot: 'green' },
                        { label: 'PostgreSQL', dot: 'green' },
                        { label: 'Telegram', dot: 'green' },
                        { label: 'Firecrawl', dot: 'blue' },
                    ].map(({ label, dot }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0', color: 'var(--text2)' }}>
                            <span>{label}</span>
                            <span className={`dot dot-${dot}`} />
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    )
}
