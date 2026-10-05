import { Activity, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './AppTopbar.css'
import { authService } from '../../services/authService'

type AppTopbarProps = {
    userName?: string
    userRole?: string
    avatarUrl?: string
}

export default function AppTopbar({
    userName,
    userRole,
    avatarUrl,
}: AppTopbarProps) {
    const navigate = useNavigate()

    const displayName = userName?.trim() || 'Mi cuenta'
    const displayRole = userRole?.trim() || 'Cuenta FitSense'

    const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('')

    function handleLogout() {
        // Limpia la sesión de prueba local.
        localStorage.removeItem('fitsense_local_session')
        localStorage.removeItem('fitsense_user')

        // Conserva la limpieza de credenciales del servicio existente.
        authService.logout()

        navigate('/login', { replace: true })
    }

    return (
        <header className="app-topbar">
            <div className="topbar-brand">
                <span className="topbar-brand-mark">
                    <Activity size={20} strokeWidth={2.5} />
                </span>
                <span className="topbar-brand-name">FitSense</span>
            </div>

            <div className="topbar-right">
                <span className="environment-badge">
                    <span className="status-dot" aria-hidden="true" />
                    Seguimiento de FitSense
                </span>

                <div className="topbar-user">
                    {avatarUrl ? (
                        <img
                            className="topbar-avatar"
                            src={avatarUrl}
                            alt={`Foto de perfil de ${displayName}`}
                        />
                    ) : (
                        <span className="topbar-avatar" aria-hidden="true">
                            {initials || <Activity size={17} />}
                        </span>
                    )}

                    <span className="topbar-user-copy">
                        <strong title={displayName}>{displayName}</strong>
                        <small title={displayRole}>{displayRole}</small>
                    </span>

                    <button
                        className="topbar-logout"
                        type="button"
                        onClick={handleLogout}
                        aria-label="Cerrar sesión"
                        title="Cerrar sesión"
                    >
                        <LogOut size={17} strokeWidth={2} aria-hidden="true" />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </header>
    )
}