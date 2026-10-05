
import { useEffect, useState } from 'react'
import {
    Activity,
    ArrowLeft,
    BarChart3,
    CheckCircle2,
    ClipboardList,
    Dumbbell,
    TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
    metricsService,
    type WeeklyMetrics,
} from '../../../services/metricsService'
import {
    interventionsService,
    type Intervention,
} from '../../../services/interventionsService'
import { getApiErrorMessage } from '../../../services/api'
import './AnalyticsPage.css'

interface TrendPoint {
    week: string
    adherence: number
    date: string
}

function formatNumber(value: number | null | undefined): string {
    if (value == null || !Number.isFinite(value)) return '—'
    return value.toLocaleString('es-PE', {
        maximumFractionDigits: 2,
    })
}

function formatDate(value: string): string {
    const date = new Date(`${value.slice(0, 10)}T12:00:00`)

    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

export default function AnalyticsPage() {
    const [metrics, setMetrics] = useState<WeeklyMetrics[]>([])
    const [interventions, setInterventions] = useState<Intervention[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        async function loadAnalytics() {
            setLoading(true)
            setError('')

            const [metricsResult, interventionsResult] =
                await Promise.allSettled([
                    metricsService.getWeeklyHistory(),
                    interventionsService.getHistory(),
                ])

            if (!active) return

            if (metricsResult.status === 'fulfilled') {
                const orderedMetrics = [...metricsResult.value]
                    .filter(item =>
                        Number.isFinite(Number(item.weightedAdherencePct)),
                    )
                    .sort(
                        (a, b) =>
                            new Date(a.weekStartDate).getTime() -
                            new Date(b.weekStartDate).getTime(),
                    )

                setMetrics(orderedMetrics)
            } else {
                setMetrics([])
            }

            if (interventionsResult.status === 'fulfilled') {
                const orderedInterventions = [...interventionsResult.value]
                    .sort(
                        (a, b) =>
                            new Date(b.appliedAt).getTime() -
                            new Date(a.appliedAt).getTime(),
                    )

                setInterventions(orderedInterventions)
            } else {
                setInterventions([])
            }

            if (metricsResult.status === 'rejected') {
                setError(getApiErrorMessage(metricsResult.reason))
            } else if (interventionsResult.status === 'rejected') {
                setError(getApiErrorMessage(interventionsResult.reason))
            }

            setLoading(false)
        }

        void loadAnalytics()

        return () => {
            active = false
        }
    }, [])

    const latestMetrics = metrics[metrics.length - 1]

    const trendData: TrendPoint[] = metrics.map(item => ({
        week: formatDate(item.weekStartDate),
        date: item.weekStartDate,
        adherence: Math.min(
            100,
            Math.max(0, Number(item.weightedAdherencePct)),
        ),
    }))

    const indicators = [
        {
            title: 'Adherencia ponderada',
            value: latestMetrics
                ? `${formatNumber(latestMetrics.weightedAdherencePct)}%`
                : '—',
            description: latestMetrics
                ? `Semana del ${formatDate(latestMetrics.weekStartDate)}`
                : 'Cumplimiento global del plan',
            icon: TrendingUp,
        },
        {
            title: 'Entrenamientos completados',
            value: latestMetrics
                ? formatNumber(latestMetrics.completedWorkouts)
                : '—',
            description: latestMetrics
                ? `${formatNumber(latestMetrics.scheduledWorkouts)} sesiones programadas`
                : 'Sesiones finalizadas',
            icon: CheckCircle2,
        },
        {
            title: 'Volumen ejecutado',
            value: latestMetrics
                ? formatNumber(latestMetrics.executedVolume)
                : '—',
            description: latestMetrics
                ? `Planificado: ${formatNumber(latestMetrics.plannedWeekVolume)}`
                : 'Volumen registrado de ejercicio',
            icon: Dumbbell,
        },
        {
            title: 'Intervenciones registradas',
            value: interventions.length.toLocaleString('es-PE'),
            description: 'Ajustes registrados en el plan',
            icon: ClipboardList,
        },
    ]

    return (
        <DashboardLayout>
            <div className="analytics-page">
                <div className="page-heading">
                    <div>
                        <p className="eyebrow">ANÁLISIS DEL PROGRESO</p>
                        <h1>Analítica</h1>
                        <p className="page-description">
                            Interpreta la evolución de tu adherencia y el cumplimiento
                            del entrenamiento.
                        </p>
                    </div>

                    <Link className="date-label" to="/dashboard">
                        <ArrowLeft size={16} />
                        Volver al dashboard
                    </Link>
                </div>

                <section className="analytics-hero">
                    <div className="analytics-hero-content">
                        <span className="welcome-label">
                            <span className="welcome-label-dot" />
                            TU PROGRESO EN PERSPECTIVA
                        </span>

                        <h2>Los datos ayudan a entender tu constancia.</h2>

                        <p>
                            Explora las tendencias de adherencia, el cumplimiento de las
                            sesiones y los ajustes registrados en tu plan de ejercicio.
                        </p>
                    </div>

                    <div className="analytics-hero-icon" aria-hidden="true">
                        <BarChart3 size={35} />
                    </div>
                </section>

                {error && (
                    <div role="alert" className="analytics-empty">
                        <strong>No se pudo completar la carga</strong>
                        <p>{error}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                <section className="section-heading">
                    <div>
                        <h2>Indicadores de seguimiento</h2>
                        <p>
                            {loading
                                ? 'Cargando información de la API…'
                                : 'Resumen de los últimos datos semanales disponibles.'}
                        </p>
                    </div>

                    <span className="pending-label">
                        <span className="status-dot" />
                        {loading
                            ? 'Cargando datos'
                            : metrics.length > 0 || interventions.length > 0
                                ? 'Datos recibidos'
                                : 'Sin datos disponibles'}
                    </span>
                </section>

                <section className="metrics-grid analytics-indicator-grid">
                    {indicators.map(({ title, value, description, icon: Icon }) => (
                        <article className="metric-card" key={title}>
                            <div className="metric-top">
                                <span className="metric-icon">
                                    <Icon size={19} />
                                </span>
                                <span className="metric-tag">ANÁLISIS</span>
                            </div>

                            <p>{title}</p>
                            <h3>{loading ? '…' : value}</h3>

                            <div className="metric-foot">
                                <span className="neutral-indicator">
                                    {description}
                                </span>
                            </div>
                        </article>
                    ))}
                </section>

                <section className="analytics-charts-grid">
                    <article className="content-card analytics-chart-card">
                        <div className="card-heading">
                            <div>
                                <h2>Evolución de la adherencia</h2>
                                <p>Porcentaje registrado por semana</p>
                            </div>

                            <span className="card-icon">
                                <TrendingUp size={18} />
                            </span>
                        </div>

                        {loading ? (
                            <div className="analytics-empty">
                                <strong>Cargando métricas semanales…</strong>
                                <p>Consultando los registros disponibles.</p>
                            </div>
                        ) : trendData.length > 0 ? (
                            <div className="analytics-chart">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={trendData}
                                        margin={{
                                            top: 15,
                                            right: 15,
                                            left: -15,
                                            bottom: 0,
                                        }}
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
                                            tick={{
                                                fill: '#7a8375',
                                                fontSize: 11,
                                            }}
                                        />

                                        <YAxis
                                            domain={[0, 100]}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{
                                                fill: '#7a8375',
                                                fontSize: 11,
                                            }}
                                            tickFormatter={value => `${value}%`}
                                        />

                                        <Tooltip
                                            labelFormatter={(_, payload) => {
                                                const point = payload?.[0]?.payload as
                                                    | TrendPoint
                                                    | undefined

                                                return point
                                                    ? `Semana del ${formatDate(point.date)}`
                                                    : ''
                                            }}
                                            formatter={value => [
                                                `${formatNumber(Number(value))}%`,
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
                            <div className="analytics-empty">
                                <span className="analytics-empty-icon">
                                    <TrendingUp size={23} />
                                </span>

                                <strong>Sin métricas semanales</strong>

                                <p>
                                    La gráfica aparecerá cuando la API devuelva registros
                                    de adherencia para las semanas del usuario.
                                </p>

                                <Link
                                    className="analytics-text-link"
                                    to="/dashboard/metrics"
                                >
                                    Consultar métricas
                                    <span>→</span>
                                </Link>
                            </div>
                        )}
                    </article>

                    <article className="content-card analytics-chart-card">
                        <div className="card-heading">
                            <div>
                                <h2>Actividad y ajustes</h2>
                                <p>Intervenciones más recientes</p>
                            </div>

                            <span className="card-icon">
                                <Activity size={18} />
                            </span>
                        </div>

                        {loading ? (
                            <div className="analytics-empty">
                                <strong>Cargando intervenciones…</strong>
                            </div>
                        ) : interventions.length > 0 ? (
                            <div className="analytics-interventions-list">
                                {interventions.slice(0, 5).map(item => (
                                    <div
                                        className="analytics-intervention-item"
                                        key={item.interventionId}
                                    >
                                        <span className="analytics-empty-icon">
                                            <ClipboardList size={19} />
                                        </span>

                                        <div>
                                            <strong>
                                                {item.messageShown ||
                                                    'Ajuste registrado en el plan'}
                                            </strong>
                                            <p>
                                                {formatDate(item.appliedAt)}
                                                {item.adherenceAfterPct != null
                                                    ? ` · Adherencia posterior: ${formatNumber(item.adherenceAfterPct)}%`
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <Link
                                    className="analytics-text-link"
                                    to="/dashboard/interventions"
                                >
                                    Ver todas las intervenciones
                                    <span>→</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="analytics-empty">
                                <span className="analytics-empty-icon">
                                    <ClipboardList size={23} />
                                </span>

                                <strong>Sin intervenciones registradas</strong>

                                <p>
                                    Aquí aparecerán los ajustes del plan que devuelva la API.
                                </p>

                                <Link
                                    className="analytics-text-link"
                                    to="/dashboard/interventions"
                                >
                                    Consultar intervenciones
                                    <span>→</span>
                                </Link>
                            </div>
                        )}
                    </article>
                </section>

                <footer className="dashboard-footer">
                    <span>FitSense · Analítica</span>
                    <span>
                        {loading
                            ? 'Cargando información…'
                            : 'Indicadores calculados a partir de los registros recibidos de la API.'}
                    </span>
                </footer>
            </div>
        </DashboardLayout>
    )
}
