
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Activity } from 'lucide-react'
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
    const [userName, setUserName] = useState('Administrador')
    const [userEmail, setUserEmail] = useState('')

    useEffect(() => {
        let active = true

        async function loadUser() {
            try {
                const user = await userService.getMe()

                if (active) {
                    setUserName(
                        user.fullName?.trim() ||
                        user.email ||
                        'Administrador',
                    )
                    setUserEmail(user.email)
                }
            } catch {
                if (active) {
                    setUserName('Administrador')
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
            <header className="workspace-brand">
                <span className="workspace-brand-mark">
                    <Activity size={23} strokeWidth={2.5} />
                </span>

                <div className="workspace-brand-copy">
                    <strong>FitSense</strong>
                    <span>Administrador de Analíticas</span>
                </div>
            </header>

            <div className="dashboard-layout">
                <AppSidebar />

                <div className="dashboard-main">
                    <AppTopbar {...profile} />

                    <main className="main-content">
                        <div className="page-enter">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    )
}