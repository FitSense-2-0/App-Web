
import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Activity,
    ArrowRight,
    BarChart3,
    CalendarCheck,
    Eye,
    EyeOff,
    HeartPulse,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from 'lucide-react'
import './LoginPage.css'

const AUTHORIZED_EMAIL = 'fitsense.admin@gmail.com'
const LOCAL_PASSWORD = 'FitSense2026!'

const LOCAL_AUTH_ENABLED =
    import.meta.env.DEV &&
    import.meta.env.VITE_LOCAL_AUTH_ENABLED === 'true'

function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const redirectTo =
        (location.state as { from?: { pathname?: string } } | null)
            ?.from?.pathname || '/dashboard'



    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')

        const normalizedEmail = email.trim().toLowerCase()

        if (normalizedEmail !== AUTHORIZED_EMAIL) {
            setError('Este correo no está autorizado para acceder a FitSense.')
            return
        }

        if (password !== LOCAL_PASSWORD) {
            setError('La contraseña es incorrecta.')
            return
        }

        localStorage.setItem('fitsense_local_session', 'true')
        localStorage.setItem(
            'fitsense_user',
            JSON.stringify({
                email: AUTHORIZED_EMAIL,
                fullName: 'Administrador FitSense',
            }),
        )

        navigate(redirectTo, { replace: true })
    }

    return (
        <main className="login-page">
            <div className="login-background" aria-hidden="true">
                <span className="login-background-shape shape-one" />
                <span className="login-background-shape shape-two" />
                <span className="login-background-line line-one" />
                <span className="login-background-line line-two" />
            </div>

            <section className="login-showcase">
                <a
                    className="showcase-brand"
                    href="#login"
                    aria-label="FitSense, inicio de sesión"
                >
                    <span className="showcase-brand-mark">
                        <Activity size={25} strokeWidth={2.7} />
                    </span>
                    <span>FitSense</span>
                </a>

                <div className="showcase-content">
                    <p className="showcase-eyebrow">
                        <span className="showcase-eyebrow-dot" />
                        PLATAFORMA DE SEGUIMIENTO
                    </p>

                    <h2>
                        Tu esfuerzo,
                        <br />
                        <span>tu progreso.</span>
                    </h2>

                    <p className="showcase-description">
                        Comprende tu adherencia al ejercicio físico,
                        analiza la evolución de tus entrenamientos y
                        toma decisiones informadas para mantener
                        la constancia.
                    </p>

                    <div className="showcase-features">
                        <article className="showcase-feature">
                            <span className="feature-icon">
                                <BarChart3 size={21} />
                            </span>
                            <div>
                                <h3>Análisis de adherencia</h3>
                                <p>
                                    Consulta métricas y evolución semanal.
                                </p>
                            </div>
                        </article>

                        <article className="showcase-feature">
                            <span className="feature-icon">
                                <HeartPulse size={21} />
                            </span>
                            <div>
                                <h3>Seguimiento del entrenamiento</h3>
                                <p>
                                    Comprende tu constancia y cumplimiento.
                                </p>
                            </div>
                        </article>

                        <article className="showcase-feature">
                            <span className="feature-icon">
                                <CalendarCheck size={21} />
                            </span>
                            <div>
                                <h3>Progreso a lo largo del tiempo</h3>
                                <p>
                                    Revisa el cumplimiento de tus planes.
                                </p>
                            </div>
                        </article>
                    </div>
                </div>

                <footer className="showcase-footer">
                    <span className="showcase-footer-accent" />
                    <p>
                        SEGUIMIENTO PERSONALIZADO
                        <span>Hábitos saludables, con propósito.</span>
                    </p>
                </footer>
            </section>

            <section className="login-panel" id="login">
                <form className="login-card" onSubmit={handleSubmit}>
                    <header className="login-card-header">
                        <div className="login-logo">
                            <Activity size={31} strokeWidth={2.7} />
                        </div>

                        <p className="login-eyebrow">FITSENSE WEB</p>
                        <h1>Iniciar sesión</h1>
                        <p className="login-description">
                            Accede al panel de seguimiento y analítica
                            de FitSense.
                        </p>
                    </header>

                    <div className="login-access-label">
                        <ShieldCheck size={16} />
                        <span>Acceso privado</span>
                    </div>

                    <div className="login-fields">
                        <div className="login-field">
                            <label htmlFor="email">
                                Correo electrónico
                            </label>

                            <div className="login-input-wrap">
                                <Mail
                                    className="login-input-icon"
                                    size={19}
                                    aria-hidden="true"
                                />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="username"
                                    placeholder="nombre@correo.com"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="login-field">
                            <label htmlFor="password">Contraseña</label>

                            <div className="login-input-wrap">
                                <LockKeyhole
                                    className="login-input-icon"
                                    size={19}
                                    aria-hidden="true"
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    required
                                />

                                <button
                                    className="password-toggle"
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((visible) => !visible)
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Ocultar contraseña'
                                            : 'Mostrar contraseña'
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        className="login-submit"
                        type="submit"
                        disabled={loading}
                    >
                        <span>
                            {loading
                                ? 'Iniciando sesión...'
                                : 'Iniciar sesión'}
                        </span>

                        {loading ? (
                            <span className="login-spinner" />
                        ) : (
                            <ArrowRight size={20} />
                        )}
                    </button>

                    <footer className="login-security">
                        <ShieldCheck size={17} />
                        <p>
                            Acceso seguro al panel de FitSense.
                        </p>
                    </footer>
                </form>

                <p className="login-panel-footer">
                    FitSense · Seguimiento y analítica del ejercicio físico
                </p>
            </section>
        </main>
    )
}

export default LoginPage
