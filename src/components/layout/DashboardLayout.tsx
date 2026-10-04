
import type { ReactNode } from 'react'
import AppSidebar from './AppSidebar'
import AppTopbar from './AppTopbar'
import './DashboardLayout.css'

type DashboardLayoutProps = {
    children: ReactNode
    userName?: string
    userRole?: string
    avatarUrl?: string
}

export default function DashboardLayout({
    children,
    userName,
    userRole,
    avatarUrl,
}: DashboardLayoutProps) {
    const profile = {
        userName,
        userRole,
        avatarUrl,
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
