import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'AI-ROBOT Dashboard — FaceBrasil',
    description: 'Dashboard de controle central para o sistema multi-agente AI-ROBOT',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`}>
            <body className="antialiased">{children}</body>
        </html>
    )
}
