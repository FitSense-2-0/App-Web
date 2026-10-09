
import {
    CircleHelp,
    LayoutDashboard,
    Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import './AppSidebar.css'

const navigationItems = [
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        end: true,
    },
    {
        label: 'Participantes',
        path: '/dashboard/participants',
        icon: Users,
        end: false,
    },
]

export default function AppSidebar() {
    return (
        <aside className="app-sidebar">
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
                    <span
                        className="sidebar-account-avatar"
                        aria-hidden="true"
                    >
                        A
                    </span>

                    <div className="sidebar-account-info">
                        <strong>Administrador</strong>
                        <span>Panel de FitSense</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
