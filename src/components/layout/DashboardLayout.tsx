
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import AppSidebar from './AppSidebar'
import AppTopbar from './AppTopbar'
import { userService } from '../../services/userService'
import './DashboardLayout.css'

type DashboardLayoutProps = {
    children: ReactNode
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const [userName, setUserName] = useState('Mi cuenta')
    const [userEmail, setUserEmail] = useState('')

    useEffect(() => {
        let active = true

        async function loadUser() {
            try {
                const user = await userService.getMe()

                if (active) {
                    setUserName(
                        user.fullName?.trim() || user.email || 'Mi cuenta',
                    )
                    setUserEmail(user.email)
                }
            } catch {
                // El interceptor de api.ts gestiona las sesiones vencidas.
                if (active) {
                    setUserName('Mi cuenta')
                    setUserEmail('')
                }
            }
        }

        void loadUser()

        return () => {
            active = false
        }
    }, [])

    const profile = {
        userName,
        userRole: userEmail || 'Cuenta FitSense',
    }

    return (
        <div className="dashboard-shell">
            <AppTopbar {...profile} />

            <div className="dashboard-layout">
                <AppSidebar {...profile} />

                <main className="main-content">
                    <div className="page-enter">{children}</div>
                </main>
            </div>
        </div>
    )
}
