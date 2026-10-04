import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../../services/authService'
import './LoginPage.css'

function LoginPage() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')

        if (!email.trim() || !password) {
            setError('Ingresa tu correo electrónico y contraseña.')
            return
        }

        setLoading(true)

        try {
            const user = await authService.login({
                email: email.trim(),
                password,
            })

            localStorage.setItem('fitsense_token', user.token)
            localStorage.setItem(
                'fitsense_user',
                JSON.stringify({
                    userId: user.userId,
                    email: user.email,
                    fullName: user.fullName,
                }),
            )

            navigate('/dashboard', { replace: true })
        } catch {
            setError(
                'No se pudo iniciar sesión. Verifica tus datos y que la API esté disponible.',
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <span className="brand-mark login-mark">F</span>
                <p className="eyebrow">FITSENSE WEB</p>
                <h1>Iniciar sesión</h1>
                <p>
                    Accede al panel de seguimiento y analítica de FitSense.
                </p>

                <label htmlFor="email">Correo electrónico</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    placeholder="nombre@correo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <label htmlFor="password">Contraseña</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                {error && (
                    <p className="login-error" role="alert">
                        {error}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>

                <small>
                    Utiliza una cuenta válida del backend de FitSense.
                </small>
            </form>
        </main>
    )
}

export default LoginPage