
import { useEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, UserRound } from 'lucide-react'
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
    const [profileOpen, setProfileOpen] = useState(false)
    const profileRef = useRef<HTMLDivElement>(null)

    const displayName = userName?.trim() || 'Administrador'
    const displayRole = userRole?.trim() || 'Administrador'

    const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join('')

    const formattedDate = new Intl.DateTimeFormat('es-PE', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date())

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setProfileOpen(false)
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setProfileOpen(false)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    return (
        <header className="app-topbar">
            <div className="topbar-heading">
                <span className="topbar-eyebrow">
                    FITSENSE / ADMINISTRACIÓN
                </span>

                <h1>Panel administrativo</h1>
                <p>Gestión y seguimiento de la plataforma</p>
            </div>

            <div className="topbar-actions">
                <div className="topbar-date">
                    <CalendarDays size={17} aria-hidden="true" />
                    <span>{formattedDate}</span>
                </div>

                <div className="topbar-divider" />

                <div className="topbar-profile-wrapper" ref={profileRef}>
                    <button
                        className={`topbar-profile ${profileOpen ? 'is-open' : ''
                            }`}
                        type="button"
                        aria-label="Abrir menú de perfil"
                        aria-expanded={profileOpen}
                        aria-haspopup="true"
                        onClick={() => setProfileOpen(open => !open)}
                    >
                        {avatarUrl ? (
                            <img
                                className="topbar-avatar"
                                src={avatarUrl}
                                alt=""
                            />
                        ) : (
                            <span className="topbar-avatar topbar-avatar-initials">
                                {initials || 'A'}
                            </span>
                        )}

                        <span className="topbar-profile-copy">
                            <strong>{displayName}</strong>
                            <small>{displayRole}</small>
                        </span>

                        <ChevronDown
                            className="topbar-profile-chevron"
                            size={16}
                            aria-hidden="true"
                        />
                    </button>

                    {profileOpen && (
                        <div className="topbar-profile-menu">
                            <div className="profile-menu-heading">
                                <span className="profile-menu-label">
                                    CUENTA ACTIVA
                                </span>

                                <strong>{displayName}</strong>
                                <span className="profile-menu-role">
                                    {displayRole}
                                </span>
                            </div>

                            <div className="profile-menu-divider" />

                            <div className="profile-menu-info">
                                <span className="profile-menu-icon">
                                    <UserRound size={17} />
                                </span>

                                <div>
                                    <span className="profile-menu-info-label">
                                        Tipo de cuenta
                                    </span>
                                    <strong>{displayRole}</strong>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="profile-menu-close"
                                onClick={() => setProfileOpen(false)}
                            >
                                Cerrar menú
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
