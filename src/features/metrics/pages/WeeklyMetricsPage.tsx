
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Dumbbell,
    RefreshCw,
    TrendingUp,
} from 'lucide-react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
    metricsService,
    type WeeklyMetrics,
} from '../../../services/metricsService'
import { getApiErrorMessage } from '../../../services/api'
import './WeeklyMetricsPage.css'

function formatDate(value: string) {
    if (!value) return '—'

    const date = new Date(`${value}T12:00:00`)

    if (Number.isNaN(date.getTime())) return value

    return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date)
}

function formatNumber(value: number) {
    return new Intl.NumberFormat('es-PE', {
        maximumFractionDigits: 1,
    }).format(value)
}

function Trend({
    current,
    previous,
    percentage = false,
}: {
    current: number
    previous?: number
    percentage?: boolean
}) {
    if (previous === undefined) {
        return (
            <span className="wm-trend wm-trend-neutral">
                Sin comparación
            </span>
        )
    }

    const difference = current - previous
    const Icon = difference >= 0 ? ArrowUpRight : ArrowDownRight

    return (
        <span
            className={`wm-trend ${difference >= 0
                ? 'wm-trend-positive'
                : 'wm-trend-negative'
                }`}
        >
            <Icon size={14} />
            {Math.abs(difference).toLocaleString('es-PE', {
                maximumFractionDigits: 1,
            })}
            {percentage ? ' pp' : ''}
            <span>vs. semana anterior</span>
        </span>
    )
}

function AdherenceChart({
    rows,
}: {
    rows: WeeklyMetrics[]
}) {
    const values = [...rows]
        .sort((a, b) =>
            a.weekStartDate.localeCompare(b.weekStartDate),
        )
        .slice(-8)

    if (!values.length) {
        return (
            <div className="wm-chart-empty">
                <span className="wm-empty-icon">
                    <TrendingUp size={22} />
                </span>
                <strong>Aún no hay evolución semanal</strong>
                <p>
                    La gráfica aparecerá cuando la API devuelva
                    registros semanales.
                </p>
            </div>
        )
    }

    const width = 640
    const height = 230
    const left = 38
    const right = 16
    const top = 20
    const bottom = 36

    const plotWidth = width - left - right
    const plotHeight = height - top - bottom

    const x = (index: number) =>
        values.length === 1
            ? left + plotWidth / 2
            : left +
            (index / (values.length - 1)) * plotWidth

    const y = (value: number) =>
        top +
        (1 - Math.max(0, Math.min(100, value)) / 100) *
        plotHeight

    const points = values
        .map(
            (item, index) =>
                `${x(index)},${y(item.weightedAdherencePct)}`,
        )
        .join(' ')

    const area = `${left},${top + plotHeight} ${points} ${x(values.length - 1)
        },${top + plotHeight}`

    return (
        <div className="wm-chart-wrap">
            <div className="wm-chart-legend">
                <span>
                    <i />
                    Adherencia ponderada
                </span>
                <span className="wm-chart-unit">
                    Porcentaje (%)
                </span>
            </div>

            <svg
                className="wm-chart"
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label="Evolución semanal de adherencia ponderada"
            >
                <defs>
                    <linearGradient
                        id="wm-area-fill"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor="#c7fe38"
                            stopOpacity=".34"
                        />
                        <stop
                            offset="100%"
                            stopColor="#c7fe38"
                            stopOpacity=".02"
                        />
                    </linearGradient>
                </defs>

                {[0, 25, 50, 75, 100].map((tick) => (
                    <g key={tick}>
                        <line
                            x1={left}
                            x2={width - right}
                            y1={y(tick)}
                            y2={y(tick)}
                            className="wm-chart-gridline"
                        />
                        <text
                            x={left - 9}
                            y={y(tick) + 4}
                            textAnchor="end"
                            className="wm-chart-axis"
                        >
                            {tick}
                        </text>
                    </g>
                ))}

                <polygon
                    points={area}
                    fill="url(#wm-area-fill)"
                />

                <polyline
                    points={points}
                    className="wm-chart-line"
                />

                {values.map((item, index) => (
                    <g key={item.weeklyMetricId}>
                        <circle
                            cx={x(index)}
                            cy={y(item.weightedAdherencePct)}
                            r="4.5"
                            className="wm-chart-point"
                        />

                        <text
                            x={x(index)}
                            y={y(item.weightedAdherencePct) - 12}
                            textAnchor="middle"
                            className="wm-chart-value"
                        >
                            {formatNumber(item.weightedAdherencePct)}%
                        </text>

                        <text
                            x={x(index)}
                            y={height - 12}
                            textAnchor="middle"
                            className="wm-chart-axis"
                        >
                            {formatDate(item.weekStartDate).replace(
                                '.',
                                '',
                            )}
                        </text>
                    </g>
                ))}
            </svg>

            {values.length === 1 && (
                <p className="wm-chart-hint">
                    Solo existe un registro semanal; todavía no es
                    posible observar una tendencia.
                </p>
            )}
        </div>
    )
}

export default function WeeklyMetricsPage() {
    const [metrics, setMetrics] = useState<WeeklyMetrics[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadMetrics = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const data = await metricsService.getWeeklyHistory()

            setMetrics(
                [...data].sort((a, b) =>
                    b.weekStartDate.localeCompare(a.weekStartDate),
                ),
            )
        } catch (requestError: unknown) {
            setError(getApiErrorMessage(requestError))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void loadMetrics()
    }, [loadMetrics])

    const latest = metrics[0] ?? null
    const previous = metrics[1] ?? null
    const hasError = Boolean(error)

    const indicators = useMemo(
        () => [
            {
                title: 'Adherencia ponderada',
                value: latest
                    ? `${formatNumber(latest.weightedAdherencePct)}%`
                    : '—',
                detail: 'Cumplimiento global del plan',
                icon: TrendingUp,
                trend: latest ? (
                    <Trend
                        current={latest.weightedAdherencePct}
                        previous={previous?.weightedAdherencePct}
                        percentage
                    />
                ) : null,
                accent: 'lime',
            },
            {
                title: 'Entrenamientos completados',
                value: latest
                    ? String(latest.completedWorkouts)
                    : '—',
                detail: latest
                    ? `${latest.scheduledWorkouts} planificados esta semana`
                    : 'Sesiones finalizadas',
                icon: CheckCircle2,
                trend: latest ? (
                    <Trend
                        current={latest.completedWorkouts}
                        previous={previous?.completedWorkouts}
                    />
                ) : null,
                accent: 'olive',
            },
            {
                title: 'Volumen ejecutado',
                value: latest
                    ? formatNumber(latest.executedVolume)
                    : '—',
                detail: latest
                    ? `Planificado: ${formatNumber(latest.plannedWeekVolume)}`
                    : 'Volumen de ejercicio registrado',
                icon: Dumbbell,
                trend: latest ? (
                    <Trend
                        current={latest.executedVolume}
                        previous={previous?.executedVolume}
                    />
                ) : null,
                accent: 'dark',
            },
            {
                title: 'Tiempo de entrenamiento',
                value: latest
                    ? `${formatNumber(latest.totalTrainingMinutes)} min`
                    : '—',
                detail: 'Duración acumulada registrada',
                icon: Clock3,
                trend: latest ? (
                    <Trend
                        current={latest.totalTrainingMinutes}
                        previous={previous?.totalTrainingMinutes}
                    />
                ) : null,
                accent: 'soft',
            },
        ],
        [latest, previous],
    )

    return (
        <DashboardLayout>
            <main className="weekly-metrics-page">
                <header className="wm-heading">
                    <div>
                        <span className="wm-eyebrow">
                            SEGUIMIENTO DEL ENTRENAMIENTO
                        </span>

                        <h1>Métricas semanales</h1>

                        <p>
                            Consulta el cumplimiento del plan y la actividad
                            registrada semana a semana.
                        </p>
                    </div>

                    <div className="wm-date-pill">
                        <CalendarDays size={17} />
                        <span>
                            {latest
                                ? `${formatDate(latest.weekStartDate)} — ${formatDate(latest.weekEndDate)}`
                                : 'Periodo semanal'}
                        </span>
                    </div>
                </header>

                <section className="wm-hero">
                    <div className="wm-hero-copy">
                        <span className="wm-hero-label">
                            <i />
                            RESUMEN DE ACTIVIDAD
                        </span>

                        <h2>La constancia se mide semana a semana.</h2>

                        <p>
                            Revisa la adherencia, las sesiones realizadas y
                            el volumen registrado para comprender la evolución
                            del entrenamiento.
                        </p>
                    </div>

                    <div className="wm-hero-mark" aria-hidden="true">
                        <Activity size={42} strokeWidth={1.6} />
                    </div>

                    <div className="wm-hero-footer">
                        <span>
                            {latest
                                ? `Último registro: ${formatDate(latest.weekStartDate)}`
                                : 'Datos vinculados a las métricas semanales'}
                        </span>

                        <span
                            className={`wm-status ${loading
                                ? 'is-loading'
                                : hasError
                                    ? 'is-error'
                                    : latest
                                        ? 'is-ready'
                                        : 'is-empty'
                                }`}
                        >
                            <i />
                            {loading
                                ? 'Consultando API'
                                : hasError
                                    ? 'No disponible'
                                    : latest
                                        ? 'Datos recibidos'
                                        : 'Sin registros'}
                        </span>
                    </div>
                </section>

                {loading && (
                    <div
                        className="wm-feedback"
                        role="status"
                        aria-live="polite"
                    >
                        <span className="wm-spinner" />
                        <div>
                            <strong>Cargando métricas</strong>
                            <p>
                                Estamos consultando los registros semanales
                                disponibles.
                            </p>
                        </div>
                    </div>
                )}

                {hasError && (
                    <div className="wm-feedback wm-feedback-error" role="alert">
                        <div className="wm-feedback-icon">
                            <Activity size={21} />
                        </div>

                        <div className="wm-feedback-copy">
                            <strong>No se pudieron cargar las métricas</strong>
                            <p>{error}</p>
                        </div>

                        <button
                            type="button"
                            className="wm-retry"
                            onClick={() => void loadMetrics()}
                        >
                            <RefreshCw size={15} />
                            Reintentar
                        </button>
                    </div>
                )}

                <section className="wm-section">
                    <div className="wm-section-heading">
                        <div>
                            <h2>Resumen de la semana</h2>
                            <p>
                                Indicadores del registro semanal más reciente.
                            </p>
                        </div>
                        <span className="wm-section-note">4 indicadores</span>
                    </div>

                    <div className="wm-kpi-grid">
                        {indicators.map(
                            ({ title, value, detail, icon: Icon, trend, accent }) => (
                                <article className="wm-kpi-card" key={title}>
                                    <div className="wm-kpi-top">
                                        <span className={`wm-kpi-icon accent-${accent}`}>
                                            <Icon size={20} />
                                        </span>
                                        <span className="wm-kpi-label">SEMANAL</span>
                                    </div>

                                    <h3>{title}</h3>
                                    <div className="wm-kpi-value">
                                        {loading ? '…' : value}
                                    </div>
                                    <p className="wm-kpi-detail">{detail}</p>
                                    {!loading && trend}
                                </article>
                            ),
                        )}
                    </div>
                </section>

                <section className="wm-main-grid">
                    <article className="wm-panel">
                        <div className="wm-panel-heading">
                            <div>
                                <span className="wm-panel-kicker">EVOLUCIÓN</span>
                                <h2>Adherencia a lo largo del tiempo</h2>
                                <p>
                                    Porcentaje de adherencia ponderada en los
                                    registros disponibles.
                                </p>
                            </div>
                            <span className="wm-panel-icon">
                                <TrendingUp size={19} />
                            </span>
                        </div>

                        {loading ? (
                            <div className="wm-chart-skeleton">
                                <span />
                                <span />
                                <span />
                                <span />
                            </div>
                        ) : hasError ? (
                            <div className="wm-chart-empty">
                                <strong>Gráfica no disponible</strong>
                                <p>
                                    Comprueba la conexión con el servidor e
                                    inténtalo nuevamente.
                                </p>
                            </div>
                        ) : (
                            <AdherenceChart rows={metrics} />
                        )}
                    </article>

                    <article className="wm-panel">
                        <div className="wm-panel-heading">
                            <div>
                                <span className="wm-panel-kicker">DESGLOSE</span>
                                <h2>Detalle de adherencia</h2>
                                <p>Indicadores distintos de cumplimiento.</p>
                            </div>
                            <span className="wm-panel-icon">
                                <Activity size={19} />
                            </span>
                        </div>

                        {loading ? (
                            <div className="wm-breakdown-empty">
                                Cargando desglose…
                            </div>
                        ) : hasError || !latest ? (
                            <div className="wm-breakdown-empty">
                                <span className="wm-empty-icon">
                                    <Activity size={22} />
                                </span>
                                <strong>
                                    {hasError
                                        ? 'Detalle no disponible'
                                        : 'Sin métricas registradas'}
                                </strong>
                                <p>
                                    El desglose aparecerá cuando existan datos
                                    disponibles en la API.
                                </p>
                            </div>
                        ) : (
                            <div className="wm-breakdown-list">
                                {[
                                    {
                                        label: 'Adherencia por frecuencia',
                                        value: latest.frequencyAdherencePct,
                                        description: 'Frecuencia de entrenamiento realizada',
                                    },
                                    {
                                        label: 'Adherencia a entrenamientos',
                                        value: latest.workoutAdherencePct,
                                        description: 'Sesiones completadas frente al plan',
                                    },
                                    {
                                        label: 'Adherencia a ejercicios',
                                        value: latest.exerciseAdherencePct,
                                        description: 'Ejercicios completados frente a los asignados',
                                    },
                                ].map((item) => (
                                    <div className="wm-breakdown-item" key={item.label}>
                                        <div className="wm-breakdown-copy">
                                            <strong>{item.label}</strong>
                                            <span>{item.description}</span>
                                        </div>

                                        <strong className="wm-breakdown-value">
                                            {formatNumber(item.value)}%
                                        </strong>

                                        <div
                                            className="wm-progress-track"
                                            role="progressbar"
                                            aria-label={item.label}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-valuenow={Math.max(
                                                0,
                                                Math.min(100, item.value),
                                            )}
                                        >
                                            <span
                                                style={{
                                                    width: `${Math.max(
                                                        0,
                                                        Math.min(100, item.value),
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <p className="wm-method-note">
                                    La adherencia ponderada es un indicador separado
                                    del cumplimiento por frecuencia, entrenamientos
                                    y ejercicios.
                                </p>
                            </div>
                        )}
                    </article>
                </section>

                <section className="wm-panel wm-activity-panel">
                    <div className="wm-panel-heading">
                        <div>
                            <span className="wm-panel-kicker">ACTIVIDAD</span>
                            <h2>Entrenamiento registrado</h2>
                            <p>
                                Datos de actividad asociados al último registro
                                semanal.
                            </p>
                        </div>
                        <span className="wm-panel-icon">
                            <Dumbbell size={19} />
                        </span>
                    </div>

                    {loading ? (
                        <div className="wm-activity-empty">
                            Cargando actividad…
                        </div>
                    ) : hasError || !latest ? (
                        <div className="wm-activity-empty">
                            {hasError
                                ? 'No fue posible consultar la actividad.'
                                : 'Todavía no hay actividad semanal registrada.'}
                        </div>
                    ) : (
                        <div className="wm-activity-grid">
                            <div className="wm-activity-item">
                                <span className="wm-activity-symbol">
                                    <CheckCircle2 size={18} />
                                </span>
                                <div>
                                    <span>Sesiones completadas</span>
                                    <strong>
                                        {latest.completedWorkouts}
                                        <small> / {latest.scheduledWorkouts} planificadas</small>
                                    </strong>
                                </div>
                            </div>

                            <div className="wm-activity-item">
                                <span className="wm-activity-symbol">
                                    <Dumbbell size={18} />
                                </span>
                                <div>
                                    <span>Ejercicios completados</span>
                                    <strong>
                                        {latest.completedExercises}
                                        <small> / {latest.assignedExercises} asignados</small>
                                    </strong>
                                </div>
                            </div>

                            <div className="wm-activity-item">
                                <span className="wm-activity-symbol">
                                    <Clock3 size={18} />
                                </span>
                                <div>
                                    <span>Tiempo de entrenamiento</span>
                                    <strong>
                                        {formatNumber(latest.totalTrainingMinutes)}
                                        <small> minutos</small>
                                    </strong>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {metrics.length > 1 && !loading && !hasError && (
                    <section className="wm-section">
                        <div className="wm-section-heading">
                            <div>
                                <h2>Historial semanal</h2>
                                <p>Registros anteriores devueltos por la API.</p>
                            </div>
                            <span className="wm-section-note">
                                {metrics.length} registros
                            </span>
                        </div>

                        <div className="wm-history-table-wrap">
                            <table className="wm-history-table">
                                <thead>
                                    <tr>
                                        <th>Semana</th>
                                        <th>Adherencia</th>
                                        <th>Sesiones</th>
                                        <th>Volumen ejecutado</th>
                                        <th>Riesgo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metrics.map((item) => (
                                        <tr key={item.weeklyMetricId}>
                                            <td>
                                                <strong>{formatDate(item.weekStartDate)}</strong>
                                                <span>{formatDate(item.weekEndDate)}</span>
                                            </td>
                                            <td>
                                                <div className="wm-history-adherence">
                                                    <strong>
                                                        {formatNumber(item.weightedAdherencePct)}%
                                                    </strong>
                                                    <span className="wm-history-track">
                                                        <i
                                                            style={{
                                                                width: `${Math.max(
                                                                    0,
                                                                    Math.min(100, item.weightedAdherencePct),
                                                                )}%`,
                                                            }}
                                                        />
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                {item.completedWorkouts} / {item.scheduledWorkouts}
                                            </td>
                                            <td>{formatNumber(item.executedVolume)}</td>
                                            <td>
                                                <span
                                                    className={`wm-risk risk-${String(
                                                        item.riskLevel,
                                                    ).toLowerCase()}`}
                                                >
                                                    {item.riskLevel || '—'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                <footer className="wm-footer">
                    <span>FitSense · Métricas semanales</span>
                    <span>
                        Los indicadores reflejan los registros recibidos desde la API.
                    </span>
                </footer>
            </main>
        </DashboardLayout>
    )
}
