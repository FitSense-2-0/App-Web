
import { useEffect, useState } from 'react'
import {
    Activity,
    ArrowDownToLine,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Dumbbell,
    TrendingUp,
} from 'lucide-react'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
    metricsService,
    type WeeklyMetrics,
} from '../../../services/metricsService'
import './WeeklyMetricsPage.css'
import { getApiErrorMessage } from '../../../services/api'

export default function WeeklyMetricsPage() {
    const [metrics, setMetrics] = useState<WeeklyMetrics[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        async function loadMetrics() {
            try {
                setLoading(true)
                setError('')

                const data = await metricsService.getWeeklyHistory()

                if (active) {
                    const ordered = [...data].sort(
                        (a, b) =>
                            new Date(b.weekStartDate).getTime() -
                            new Date(a.weekStartDate).getTime(),
                    )
                    setMetrics(ordered)
                }
            } catch (error: unknown) {
                if (active) {
                    setError(getApiErrorMessage(error))
                }
            } finally {
                if (active) setLoading(false)
            }
        }

        void loadMetrics()

        return () => {
            active = false
        }
    }, [])

    const latest = metrics[0] ?? null

    const indicators = [
        {
            title: 'Adherencia ponderada',
            value: latest ? `${latest.weightedAdherencePct}%` : '—',
            description: 'Cumplimiento global del plan',
            icon: TrendingUp,
        },
        {
            title: 'Entrenamientos completados',
            value: latest ? String(latest.completedWorkouts) : '—',
            description: 'Sesiones finalizadas',
            icon: CheckCircle2,
        },
        {
            title: 'Volumen ejecutado',
            value: latest
                ? latest.executedVolume.toLocaleString('es-PE')
                : '—',
            description: 'Volumen de ejercicio registrado',
            icon: Dumbbell,
        },
        {
            title: 'Tiempo de entrenamiento',
            value: latest ? `${latest.totalTrainingMinutes} min` : '—',
            description: 'Minutos de actividad registrados',
            icon: Clock3,
        },
    ]

    return (
        <DashboardLayout>
            <div className="weekly-metrics-page">
                <header className="weekly-metrics-heading">
                    <div>
                        <span className="weekly-metrics-eyebrow">
                            SEGUIMIENTO DEL ENTRENAMIENTO
                        </span>

                        <h1>Métricas semanales</h1>

                        <p>
                            Revisa tu cumplimiento, el volumen de ejercicio y
                            la evolución de tus sesiones.
                        </p>
                    </div>

                    <span className="weekly-metrics-date">
                        <CalendarDays size={17} />
                        {latest
                            ? `${latest.weekStartDate} — ${latest.weekEndDate}`
                            : 'Resumen semanal'}
                    </span>
                </header>

                <section className="weekly-metrics-intro">
                    <div className="weekly-metrics-intro-copy">
                        <span className="weekly-metrics-intro-label">
                            <span />
                            TU CONSTANCIA, EN PERSPECTIVA
                        </span>

                        <h2>Los pequeños avances también cuentan.</h2>

                        <p>
                            Consulta las métricas de tu plan para comprender
                            cómo estás avanzando y dónde puedes mejorar.
                        </p>
                    </div>

                    <div
                        className="weekly-metrics-intro-icon"
                        aria-hidden="true"
                    >
                        <Activity size={38} strokeWidth={1.7} />
                    </div>
                </section>

                {loading && (
                    <div
                        className="weekly-metrics-loading-state"
                        role="status"
                        aria-live="polite"
                    >
                        <span className="weekly-metrics-loading-indicator" aria-hidden="true" />

                        <div>
                            <strong>Cargando tus métricas</strong>
                            <p>
                                Estamos consultando tu adherencia y actividad semanal.
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="weekly-metrics-empty" role="alert">
                        <span className="weekly-metrics-empty-icon" aria-hidden="true">
                            <Activity size={24} />
                        </span>

                        <strong>No se pudieron cargar las métricas</strong>

                        <p>
                            No fue posible obtener la información del servidor.
                            Verifica la conexión e inténtalo nuevamente.
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                <section className="weekly-metrics-section">
                    <div className="weekly-metrics-section-heading">
                        <div>
                            <h2>Resumen de la semana</h2>
                            <p>
                                {latest
                                    ? 'Indicadores de la última semana registrada.'
                                    : 'Indicadores de cumplimiento y actividad física.'}
                            </p>
                        </div>

                        <span className="weekly-metrics-status">
                            <span />
                            {loading
                                ? 'Cargando datos'
                                : error
                                    ? 'Error de conexión'
                                    : latest
                                        ? 'Datos disponibles'
                                        : 'Sin registros'}
                        </span>
                    </div>

                    <div className="weekly-metrics-grid">
                        {indicators.map(
                            ({ title, value, description, icon: Icon }) => (
                                <article className="weekly-metric-card" key={title}>
                                    <div className="weekly-metric-card-top">
                                        <span className="weekly-metric-icon">
                                            <Icon size={20} strokeWidth={1.9} />
                                        </span>

                                        <span className="weekly-metric-category">
                                            SEMANAL
                                        </span>
                                    </div>

                                    <h3>{title}</h3>

                                    <div className="weekly-metric-value">
                                        {loading ? '…' : value}
                                    </div>

                                    <p>{description}</p>
                                </article>
                            ),
                        )}
                    </div>
                </section>

                <section className="weekly-metrics-detail-grid">
                    <article className="weekly-metrics-panel weekly-metrics-adherence">
                        <div className="weekly-metrics-panel-heading">
                            <div>
                                <h2>Detalle de adherencia</h2>
                                <p>
                                    Comparación entre el plan y la actividad registrada.
                                </p>
                            </div>

                            <span className="weekly-metrics-panel-icon">
                                <TrendingUp size={19} />
                            </span>
                        </div>

                        <div className="weekly-metrics-empty">
                            {loading ? (
                                <strong>Cargando detalle semanal…</strong>
                            ) : latest ? (
                                <>
                                    <strong>
                                        Adherencia ponderada: {latest.weightedAdherencePct}%
                                    </strong>
                                    <p>
                                        Frecuencia: {latest.frequencyAdherencePct}% ·
                                        Entrenamientos: {latest.workoutAdherencePct}% ·
                                        Ejercicios: {latest.exerciseAdherencePct}%.
                                    </p>
                                    <p>
                                        Semana del {latest.weekStartDate} al {latest.weekEndDate}.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <span className="weekly-metrics-empty-icon">
                                        <Activity size={24} />
                                    </span>
                                    <strong>
                                        {error
                                            ? 'Detalle no disponible'
                                            : 'No hay métricas semanales disponibles'}
                                    </strong>
                                    <p>
                                        {error
                                            ? 'No fue posible obtener datos del servidor.'
                                            : 'El detalle aparecerá cuando la API devuelva registros semanales.'}
                                    </p>
                                </>
                            )}
                        </div>
                    </article>

                    <article className="weekly-metrics-panel weekly-metrics-activity">
                        <div className="weekly-metrics-panel-heading">
                            <div>
                                <h2>Actividad registrada</h2>
                                <p>Sesiones y volumen ejecutado.</p>
                            </div>

                            <span className="weekly-metrics-panel-icon">
                                <Dumbbell size={19} />
                            </span>
                        </div>

                        <div className="weekly-metrics-activity-list">
                            <div className="weekly-metrics-activity-row">
                                <span className="weekly-metrics-activity-symbol">
                                    <CheckCircle2 size={17} />
                                </span>
                                <div>
                                    <strong>Sesiones completadas</strong>
                                    <p>Entrenamientos finalizados</p>
                                </div>
                                <span className="weekly-metrics-activity-value">
                                    {loading ? '…' : latest?.completedWorkouts ?? '—'}
                                </span>
                            </div>

                            <div className="weekly-metrics-activity-row">
                                <span className="weekly-metrics-activity-symbol">
                                    <Dumbbell size={17} />
                                </span>
                                <div>
                                    <strong>Ejercicios completados</strong>
                                    <p>Ejercicios registrados</p>
                                </div>
                                <span className="weekly-metrics-activity-value">
                                    {loading ? '…' : latest?.completedExercises ?? '—'}
                                </span>
                            </div>

                            <div className="weekly-metrics-activity-row">
                                <span className="weekly-metrics-activity-symbol">
                                    <Clock3 size={17} />
                                </span>
                                <div>
                                    <strong>Tiempo de entrenamiento</strong>
                                    <p>Duración acumulada</p>
                                </div>
                                <span className="weekly-metrics-activity-value">
                                    {loading
                                        ? '…'
                                        : latest
                                            ? `${latest.totalTrainingMinutes} min`
                                            : '—'}
                                </span>
                            </div>
                        </div>

                        <p className="weekly-metrics-activity-note">
                            <ArrowDownToLine size={15} />
                            Datos obtenidos de las métricas semanales.
                        </p>
                    </article>
                </section>

                {metrics.length > 1 && (
                    <section className="weekly-metrics-section">
                        <div className="weekly-metrics-section-heading">
                            <div>
                                <h2>Historial semanal</h2>
                                <p>Registros anteriores disponibles en la API.</p>
                            </div>
                        </div>

                        <div className="weekly-metrics-history">
                            {metrics.map(item => (
                                <article
                                    className="weekly-metric-card"
                                    key={item.weeklyMetricId}
                                >
                                    <h3>
                                        {item.weekStartDate} — {item.weekEndDate}
                                    </h3>
                                    <p>
                                        Adherencia: {item.weightedAdherencePct}% ·
                                        Sesiones: {item.completedWorkouts}/
                                        {item.scheduledWorkouts}
                                    </p>
                                    <p>
                                        Volumen ejecutado:{' '}
                                        {item.executedVolume.toLocaleString('es-PE')}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                <footer className="weekly-metrics-footer">
                    <span>FitSense · Métricas semanales</span>
                    <span>
                        {loading
                            ? 'Cargando información…'
                            : 'Información procedente de la API de FitSense.'}
                    </span>
                </footer>
            </div>
        </DashboardLayout>
    )
}
