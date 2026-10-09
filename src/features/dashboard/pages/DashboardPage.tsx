
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
import './DashboardPage.css'
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { getApiErrorMessage } from '../../../services/api'

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<WeeklyMetrics | null>(null)
    const [interventions, setInterventions] = useState<Intervention[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [metricsHistory, setMetricsHistory] = useState<WeeklyMetrics[]>([])

    useEffect(() => {
        let active = true

        async function loadDashboard() {
            setLoading(true)
            setError('')

            const [metricsResult, interventionsResult] =
                await Promise.allSettled([
                    metricsService.getWeeklyHistory(),
                    interventionsService.getHistory(),
                ])

            if (!active) return

            if (metricsResult.status === 'fulfilled') {
                const history = [...metricsResult.value].sort(
                    (a, b) =>
                        new Date(a.weekStartDate).getTime() -
                        new Date(b.weekStartDate).getTime(),
                )

                setMetricsHistory(history)
                setMetrics(history[history.length - 1] ?? null)
            } else {
                setMetricsHistory([])
                setMetrics(null)
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

            if (metricsResult.status === 'rejected') {
                setError(getApiErrorMessage(metricsResult.reason))
            } else if (interventionsResult.status === 'rejected') {
                setError(getApiErrorMessage(interventionsResult.reason))
            }

            setLoading(false)
        }

        void loadDashboard()

        return () => {
            active = false
        }
    }, [])

    const adherenceTrend = metricsHistory
        .filter(item => Number.isFinite(Number(item.weightedAdherencePct)))
        .map(item => ({
            week: new Date(
                `${item.weekStartDate.slice(0, 10)}T12:00:00`,
            ).toLocaleDateString('es-PE', {
                day: '2-digit',
                month: 'short',
            }),
            date: item.weekStartDate,
            adherence: Math.min(
                100,
                Math.max(0, Number(item.weightedAdherencePct)),
            ),
        }))

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
        <DashboardLayout>
            <div className="dashboard-page">
                <section className="dashboard-welcome">
                    <div className="dashboard-welcome-copy">
                        <span className="dashboard-eyebrow">
                            <span className="dashboard-eyebrow-dot" />
                            TU ESPACIO DE SEGUIMIENTO
                        </span>

                        <h1>Tu progreso, a tu ritmo.</h1>

                        <p>
                            <p>
                                Consulta la adherencia, las sesiones registradas
                                y la evolución de los participantes de FitSense.
                            </p>
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


                {loading && (
                    <div
                        className="dashboard-loading-message"
                        role="status"
                        aria-live="polite"
                    >
                        <span className="dashboard-loading-spinner" aria-hidden="true" />
                        <div className="dashboard-loading-copy">
                            <strong>Preparando tu resumen</strong>
                            <span>
                                Estamos consultando tus métricas y tu actividad reciente.
                            </span>
                        </div>
                    </div>
                )}



                {error && (
                    <div className="dashboard-data-message" role="alert">
                        <span className="dashboard-error-icon" aria-hidden="true">
                            <Activity size={21} />
                        </span>

                        <div className="dashboard-error-content">
                            <strong>No se pudo cargar toda la información</strong>
                            <p>{error}</p>
                            <button
                                type="button"
                                className="dashboard-retry-button"
                                onClick={() => window.location.reload()}
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                )}

                <section className="dashboard-section">
                    <div className="dashboard-section-actions">

                        <Link
                            className="dashboard-analytics-link"
                            to="/dashboard/analytics"
                        >
                            Ver analíticas
                            <BarChart3 size={16} />
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


                        {loading ? (
                            <div className="dashboard-empty-chart" role="status">
                                <span className="dashboard-loading-spinner" aria-hidden="true" />
                                <strong>Preparando gráfica</strong>
                                <p>Consultando el historial semanal.</p>
                            </div>
                        ) : adherenceTrend.length > 0 ? (
                            <div className="dashboard-adherence-chart">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={adherenceTrend}
                                        margin={{ top: 12, right: 12, left: -15, bottom: 0 }}
                                    >
                                        <CartesianGrid
                                            stroke="#e8ebdf"
                                            strokeDasharray="4 4"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="week"
                                            tickLine={false}
                                            axisLine={false}
                                            minTickGap={20}
                                            tick={{ fill: '#7a8375', fontSize: 11 }}
                                        />
                                        <YAxis
                                            domain={[0, 100]}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: '#7a8375', fontSize: 11 }}
                                            tickFormatter={value => `${value}%`}
                                        />
                                        <Tooltip
                                            labelFormatter={(_, payload) => {
                                                const point = payload?.[0]?.payload as
                                                    | (typeof adherenceTrend)[number]
                                                    | undefined

                                                if (!point) return ''

                                                const date = new Date(
                                                    `${point.date.slice(0, 10)}T12:00:00`,
                                                )

                                                return `Semana del ${date.toLocaleDateString('es-PE')}`
                                            }}
                                            formatter={value => [
                                                `${Number(value).toLocaleString('es-PE', {
                                                    maximumFractionDigits: 2,
                                                })}%`,
                                                'Adherencia',
                                            ]}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="adherence"
                                            name="Adherencia"
                                            stroke="#748e36"
                                            strokeWidth={3}
                                            dot={{
                                                r: 4,
                                                fill: '#c7fe38',
                                                stroke: '#748e36',
                                            }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="dashboard-empty-chart">
                                <span className="dashboard-empty-icon">
                                    <TrendingUp size={25} />
                                </span>
                                <strong>Aún no hay métricas disponibles</strong>
                                <p>
                                    La gráfica aparecerá cuando existan registros semanales de
                                    adherencia en la API.
                                </p>
                                <Link className="dashboard-inline-link" to="/dashboard/metrics">
                                    Consultar métricas
                                    <ArrowRight size={15} />
                                </Link>
                            </div>
                        )}

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
                                <strong role="status">Consultando intervenciones…</strong>
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
