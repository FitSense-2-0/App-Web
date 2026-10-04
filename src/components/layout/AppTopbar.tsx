
import { Activity } from 'lucide-react'
import './AppTopbar.css'

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
    const displayName = userName?.trim() || 'Mi cuenta'
    const displayRole = userRole?.trim() || 'Administrador'

    const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('')

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
                    Modo demostración
                </span>

                <div className="topbar-user">
                    {avatarUrl ? (
                        <img
                            className="topbar-avatar"
                            src={avatarUrl}
                            alt={`Foto de perfil de ${displayName}`}
                        />
                    ) : (
                        <span
                            className="topbar-avatar"
                            aria-hidden="true"
                        >
                            {initials || <Activity size={17} />}
                        </span>
                    )}

                    <span className="topbar-user-copy">
                        <strong title={displayName}>{displayName}</strong>
                        <small title={displayRole}>{displayRole}</small>
                    </span>
                </div>
            </div>
        </header>
    )
}
