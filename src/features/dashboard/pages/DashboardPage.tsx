
import { useEffect, useState } from 'react'
import {
    Activity,
    ArrowRight,
    BarChart3,
    CalendarCheck,
    ClipboardList,
    TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { metricsService, type WeeklyMetrics } from '../../../services/metricsService'
import { interventionsService, type Intervention } from '../../../services/interventionsService'
import { userService, type CurrentUser } from '../../../services/userService'
import './DashboardPage.css'

export default function DashboardPage() {
    const [user, setUser] = useState<CurrentUser | null>(null)
    const [metrics, setMetrics] = useState<WeeklyMetrics | null>(null)
    const [interventions, setInterventions] = useState<Intervention[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        async function loadDashboard() {
            setLoading(true)
            setError('')

            const [userResult, metricsResult, interventionsResult] =
                await Promise.allSettled([
                    userService.getMe(),
                    metricsService.getWeeklyHistory(),
                    interventionsService.getHistory(),
                ])

            if (!active) return

            if (userResult.status === 'fulfilled') {
                setUser(userResult.value)
            }

            if (metricsResult.status === 'fulfilled') {
                const history = metricsResult.value
                const latest = [...history].sort(
                    (a, b) =>
                        new Date(b.weekStartDate).getTime() -
                        new Date(a.weekStartDate).getTime(),
                )[0] ?? null

                setMetrics(latest)
            }

            if (interventionsResult.status === 'fulfilled') {
                setInterventions(
                    [...interventionsResult.value]
                        .sort(
                            (a, b) =>
                                new Date(b.appliedAt).getTime() -
                                new Date(a.appliedAt).getTime(),
                        )
                        .slice(0, 3),
                )
            }

            const failed = [
                userResult,
                metricsResult,
                interventionsResult,
            ].some(result => result.status === 'rejected')

            if (failed) {
                setError(
                    'No se pudo cargar parte de la información. Comprueba la conexión con la API.',
                )
            }

            setLoading(false)
        }

        void loadDashboard()

        return () => {
            active = false
        }
    }, [])

    const cards = [
        {
            title: 'Adherencia semanal',
            value: metrics ? `${metrics.weightedAdherencePct}%` : '—',
            description: 'Cumplimiento global del plan',
            icon: TrendingUp,
        },
        {
            title: 'Entrenamientos completados',
            value: metrics ? String(metrics.completedWorkouts) : '—',
            description: 'Sesiones completadas en la semana registrada',
            icon: CalendarCheck,
        },
        {
            title: 'Volumen ejecutado',
            value: metrics ? metrics.executedVolume.toLocaleString('es-PE') : '—',
            description: 'Volumen de ejercicio registrado',
            icon: Activity,
        },
    ]

    return (
        <DashboardLayout userName={user?.fullName}>
            <div className="dashboard-page">
                <section className="dashboard-welcome">
                    <div className="dashboard-welcome-copy">
                        <span className="dashboard-eyebrow">
                            <span className="dashboard-eyebrow-dot" />
                            TU ESPACIO DE SEGUIMIENTO
                        </span>

                        <h1>Tu progreso, a tu ritmo.</h1>

                        <p>
                            {user?.fullName
                                ? `Hola, ${user.fullName}. Consulta tu adherencia y la evolución de tu plan de ejercicio.`
                                : 'Consulta tu adherencia, revisa tu actividad y conoce cómo evoluciona tu plan de ejercicio.'}
                        </p>

                        <Link className="dashboard-primary-link" to="/dashboard/metrics">
                            Ver métricas semanales
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    <div className="dashboard-welcome-visual" aria-hidden="true">
                        <div className="dashboard-visual-ring dashboard-visual-ring-outer" />
                        <div className="dashboard-visual-ring dashboard-visual-ring-inner" />
                        <div className="dashboard-visual-icon">
                            <Activity size={34} strokeWidth={1.8} />
                        </div>
                    </div>
                </section>

                {error && (
                    <p role="alert" className="dashboard-data-message">
                        {error}
                    </p>
                )}

                <section className="dashboard-section">
                    <div className="dashboard-section-heading">
                        <div>
                            <span className="dashboard-eyebrow">RESUMEN GENERAL</span>
                            <h2>Tu actividad semanal</h2>
                        </div>

                        <Link className="dashboard-secondary-link" to="/dashboard/metrics">
                            Ver detalles
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="dashboard-summary-grid">
                        {cards.map(({ title, value, description, icon: Icon }) => (
                            <article className="dashboard-summary-card" key={title}>
                                <div className="dashboard-summary-card-top">
                                    <span className="dashboard-summary-icon">
                                        <Icon size={20} strokeWidth={1.9} />
                                    </span>
                                    <span className="dashboard-summary-label">ÚLTIMA SEMANA REGISTRADA</span>
                                </div>

                                <p className="dashboard-summary-title">{title}</p>

                                <div className="dashboard-summary-value">
                                    <strong>{loading ? '…' : value}</strong>
                                </div>

                                <p className="dashboard-summary-description">{description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="dashboard-content-grid">
                    <article className="dashboard-panel dashboard-trend-panel">
                        <div className="dashboard-panel-heading">
                            <div>
                                <h2>Evolución de la adherencia</h2>
                                <p>Seguimiento del cumplimiento de tu plan</p>
                            </div>

                            <span className="dashboard-panel-icon">
                                <BarChart3 size={19} />
                            </span>
                        </div>

                        <div className="dashboard-empty-chart">
                            <span className="dashboard-empty-icon">
                                <TrendingUp size={25} />
                            </span>

                            <strong>
                                {loading
                                    ? 'Cargando métricas…'
                                    : metrics
                                        ? `Adherencia registrada: ${metrics.weightedAdherencePct}%`
                                        : 'Aún no hay métricas disponibles'}
                            </strong>

                            <p>
                                {metrics
                                    ? `Semana del ${metrics.weekStartDate} al ${metrics.weekEndDate}. Consulta el detalle para ver los demás indicadores.`
                                    : 'Cuando la API devuelva registros semanales, podrás consultar aquí tus indicadores.'}
                            </p>

                            <Link className="dashboard-inline-link" to="/dashboard/metrics">
                                Consultar métricas
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </article>

                    <article className="dashboard-panel dashboard-interventions-panel">
                        <div className="dashboard-panel-heading">
                            <div>
                                <h2>Intervenciones recientes</h2>
                                <p>Ajustes registrados en el plan de ejercicio</p>
                            </div>

                            <span className="dashboard-panel-icon">
                                <ClipboardList size={19} />
                            </span>
                        </div>

                        <div className="dashboard-empty-interventions">
                            {loading ? (
                                <strong>Cargando intervenciones…</strong>
                            ) : interventions.length > 0 ? (
                                <>
                                    <strong>
                                        {interventions.length} intervención(es) reciente(s)
                                    </strong>
                                    {interventions.map(item => (
                                        <p key={item.interventionId}>
                                            {item.messageShown || 'Intervención registrada'} ·{' '}
                                            {new Date(item.appliedAt).toLocaleDateString('es-PE')}
                                        </p>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <span className="dashboard-empty-icon">
                                        <ClipboardList size={24} />
                                    </span>
                                    <strong>Sin intervenciones para mostrar</strong>
                                    <p>
                                        No hay registros disponibles en la respuesta de la API.
                                    </p>
                                </>
                            )}

                            <Link className="dashboard-inline-link" to="/dashboard/interventions">
                                Ver intervenciones
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </article>
                </section>

                <footer className="dashboard-page-footer">
                    <span>FitSense · Panel de seguimiento</span>
                    <span>
                        {loading ? 'Cargando información…' : 'Información obtenida de los servicios de FitSense.'}
                    </span>
                </footer>
            </div>
        </DashboardLayout>
    )
}
