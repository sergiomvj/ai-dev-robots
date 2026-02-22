import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'
import Sidebar from '@/components/layout/Sidebar'

async function checkAuth() {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    if (!token) redirect('/login')
    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    } catch {
        redirect('/login')
    }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    await checkAuth()

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {children}
            </main>
        </div>
    )
}
