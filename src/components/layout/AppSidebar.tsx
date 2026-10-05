
import {
    Activity,
    BarChart3,
    CircleHelp,
    LayoutDashboard,
    UserRound,
    Zap,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import './AppSidebar.css'

type AppSidebarProps = {
    userName?: string
    userRole?: string
    avatarUrl?: string
}

const navigationItems = [
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        end: true,
    },
    {
        label: 'Analítica',
        path: '/dashboard/analytics',
        icon: BarChart3,
        end: true,
    },
    {
        label: 'Métricas semanales',
        path: '/dashboard/metrics',
        icon: Activity,
        end: true,
    },
    {
        label: 'Intervenciones',
        path: '/dashboard/interventions',
        icon: Zap,
        end: true,
    },
]

export default function AppSidebar({
    userName,
    userRole,
    avatarUrl,
}: AppSidebarProps) {
    const displayName = userName?.trim() || 'Mi cuenta'
    const displayRole = userRole?.trim() || 'Administrador'

    const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('')

    return (
        <aside className="app-sidebar">
            <NavLink
                to="/dashboard"
                className="sidebar-brand"
                aria-label="FitSense, ir al dashboard"
            >
                <span className="sidebar-brand-mark">
                    <Activity size={23} strokeWidth={2.5} />
                </span>

                <span className="sidebar-brand-copy">
                    <strong>FitSense</strong>
                    <span>ADMIN ANALYTICS</span>
                </span>
            </NavLink>

            <div className="sidebar-content">
                <p className="sidebar-label">ESPACIO DE TRABAJO</p>

                <nav
                    className="sidebar-nav"
                    aria-label="Navegación principal"
                >
                    {navigationItems.map(
                        ({ label, path, icon: Icon, end }) => (

                            <NavLink
                                key={path}
                                to={path}
                                end={end}
                                aria-label={label}
                                className={({ isActive }) =>
                                    `nav-item${isActive ? ' active' : ''}`
                                }
                            >
                                <Icon
                                    className="nav-icon"
                                    size={19}
                                    strokeWidth={1.9}
                                    aria-hidden="true"
                                />
                                <span className="nav-text">{label}</span>
                            </NavLink>

                        ),
                    )}
                </nav>
            </div>

            <div className="sidebar-bottom">
                <section className="sidebar-help-card">
                    <span className="sidebar-help-icon">
                        <CircleHelp size={18} />
                    </span>

                    <div className="sidebar-help-copy">
                        <strong>Centro de análisis</strong>
                        <p>
                            Consulta los indicadores y el seguimiento de la
                            adherencia.
                        </p>
                    </div>
                </section>

                <div className="sidebar-account">
                    {avatarUrl ? (
                        <img
                            className="sidebar-account-avatar"
                            src={avatarUrl}
                            alt={`Foto de perfil de ${displayName}`}
                        />
                    ) : (
                        <span
                            className="sidebar-account-avatar"
                            aria-hidden="true"
                        >
                            {initials || <UserRound size={20} />}
                        </span>
                    )}

                    <div className="sidebar-account-info">
                        <strong title={displayName}>{displayName}</strong>
                        <span title={displayRole}>{displayRole}</span>
                    </div>
                </div>

                <div className="sidebar-footer">
                    <span className="status-dot" aria-hidden="true" />
                    <span>Panel de seguimiento</span>
                </div>
            </div>
        </aside>
    )
}
