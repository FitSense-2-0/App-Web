
import {
    Activity,
    BarChart3,
    ClipboardList,
    LayoutDashboard,
    Users,
    ShieldCheck,
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
    {
        label: 'Analíticas',
        path: '/dashboard/analytics',
        icon: BarChart3,
        end: false,
    },
    {
        label: 'Métricas semanales',
        path: '/dashboard/metrics',
        icon: Activity,
        end: false,
    },
    {
        label: 'Intervenciones',
        path: '/dashboard/interventions',
        icon: ClipboardList,
        end: false,
    },
]

export default function AppSidebar() {
    return (
        <aside className="app-sidebar">
            <div className="sidebar-content">
                <p className="sidebar-label">MENÚ PRINCIPAL</p>

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
                        <Activity size={19} strokeWidth={1.9} />
                    </span>

                    <div className="sidebar-help-copy">
                        <span className="sidebar-section-caption">
                            FITSENSE
                        </span>

                        <strong>Seguimiento de adherencia</strong>

                        <p>
                            Supervisa el cumplimiento y la evolución
                            de los planes de ejercicio.
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
                        <span>Gestión de la plataforma</span>
                    </div>

                    <span
                        className="sidebar-account-badge"
                        title="Perfil administrativo"
                        aria-label="Perfil administrativo"
                    >
                        <ShieldCheck size={16} strokeWidth={1.9} />
                    </span>
                </div>

                <div className="sidebar-footer">
                    <span className="sidebar-footer-dot" />
                    <span>Panel de gestión FitSense</span>
                </div>
            </div>

        </aside>
    )
}