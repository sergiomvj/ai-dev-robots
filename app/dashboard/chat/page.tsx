'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'

interface Message {
    id: string
    role: 'user' | 'agent'
    content: string
    timestamp: string
}

interface Agent {
    id: string
    name: string
    avatar: string
    role: string
}

export default function ChatPage() {
    const searchParams = useSearchParams()
    const agentId = searchParams.get('agentId')

    const [agent, setAgent] = useState<Agent | null>(null)
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'agent', content: 'Olá! Sou seu assistente OpenClaw. Como posso ajudar com suas tarefas hoje?', timestamp: new Date().toISOString() }
    ])
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (agentId) {
            fetch(`/api/agents/${agentId}`)
                .then(r => r.json())
                .then(data => setAgent(data))
        }
    }, [agentId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = () => {
        if (!input.trim()) return
        const newMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date().toISOString() }
        setMessages(prev => [...prev, newMsg])
        setInput('')

        // Simulação de resposta (posteriormente integrar com API de chat real)
        setTimeout(() => {
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                role: 'agent',
                content: `Recebi sua mensagem: "${input}". Atualmente meu módulo de processamento direto está em manutenção, mas registrei sua solicitação.`,
                timestamp: new Date().toISOString()
            }
            setMessages(prev => [...prev, reply])
        }, 1000)
    }

    return (
        <>
            <Topbar
                title={agent ? `Chat com ${agent.name}` : 'Central de Chat'}
                subtitle={agent ? agent.role : 'Interaja diretamente com seus agentes autônomos'}
            />

            <div className="content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
                <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                    {/* Header do Chat */}
                    <div style={{ padding: '12px 20px', background: 'var(--bg3)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                            {agent?.avatar || '🤖'}
                        </div>
                        <div className="font-heading" style={{ fontSize: 14, fontWeight: 700 }}>{agent?.name || 'Agente'}</div>
                        <div className="dot dot-green" style={{ marginLeft: 4 }} />
                    </div>

                    {/* Área de Mensagens */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {messages.map(m => (
                            <div key={m.id} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: m.role === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    padding: '10px 16px',
                                    borderRadius: 14,
                                    borderBottomRightRadius: m.role === 'user' ? 2 : 14,
                                    borderBottomLeftRadius: m.role === 'agent' ? 2 : 14,
                                    background: m.role === 'user' ? 'var(--accent)' : 'var(--bg3)',
                                    color: m.role === 'user' ? 'white' : 'var(--text2)',
                                    fontSize: 13,
                                    lineHeight: 1.5
                                }}>
                                    {m.content}
                                </div>
                                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4, fontFamily: 'var(--mono)' }}>
                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: 16, borderTop: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', gap: 10 }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Digite sua mensagem..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && sendMessage()}
                            style={{ borderRadius: 10 }}
                        />
                        <button className="btn btn-primary" onClick={sendMessage} style={{ borderRadius: 10, padding: '0 20px' }}>
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
