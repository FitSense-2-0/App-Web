
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    CalendarDays,
    RefreshCw,
    TrendingUp,
} from 'lucide-react'
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
import { getApiErrorMessage } from '../../../services/api'
import './AnalyticsPage.css'

interface TrendPoint {
    week: string
    date: string
    adherence: number
}

function formatNumber(value: number | null | undefined): string {
    if (value == null || !Number.isFinite(Number(value))) return '—'

    return Number(value).toLocaleString('es-PE', {
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

function getVariation(current: number, previous: number) {
    const difference = current - previous

    return {
        difference,
        label: `${difference > 0 ? '+' : ''}${formatNumber(difference)} pp`,
    }
}

function AdherenceBar({
    label,
    value,
    description,
}: {
    label: string
    value: number | null | undefined
    description: string
}) {
    const valid = value != null && Number.isFinite(Number(value))
    const percentage = valid
        ? Math.min(100, Math.max(0, Number(value)))
        : 0

    return (
        <div className="analytics-breakdown-item">
            <div className="analytics-breakdown-top">
                <div>
                    <strong>{label}</strong>
                    <span>{description}</span>
                </div>

                <strong className="analytics-breakdown-value">
                    {valid ? `${formatNumber(value)}%` : '—'}
                </strong>
            </div>

            <div
                className="analytics-progress-track"
                role="progressbar"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={valid ? percentage : 0}
            >
                <div
                    className="analytics-progress-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

export default function AnalyticsPage() {
    const [metrics, setMetrics] = useState<WeeklyMetrics[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadAnalytics = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const history = await metricsService.getWeeklyHistory()

            const orderedMetrics = [...history]
                .filter(item =>
                    Number.isFinite(Number(item.weightedAdherencePct)),
                )
                .sort(
                    (a, b) =>
                        new Date(a.weekStartDate).getTime() -
                        new Date(b.weekStartDate).getTime(),
                )

            setMetrics(orderedMetrics)
        } catch (err) {
            setMetrics([])
            setError(getApiErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void loadAnalytics()
    }, [loadAnalytics])

    const latestMetrics = metrics[metrics.length - 1]

    const previousMetrics =
        metrics.length > 1 ? metrics[metrics.length - 2] : undefined

    const trendData: TrendPoint[] = useMemo(
        () =>
            metrics.map(item => ({
                week: formatDate(item.weekStartDate),
                date: item.weekStartDate,
                adherence: Math.min(
                    100,
                    Math.max(0, Number(item.weightedAdherencePct)),
                ),
            })),
        [metrics],
    )

    const adherenceVariation =
        latestMetrics && previousMetrics
            ? getVariation(
                Number(latestMetrics.weightedAdherencePct),
                Number(previousMetrics.weightedAdherencePct),
            )
            : null

    const variationIsPositive =
        adherenceVariation !== null &&
        adherenceVariation.difference > 0

    const variationIsNegative =
        adherenceVariation !== null &&
        adherenceVariation.difference < 0

    return (
        <DashboardLayout>
            <main className="analytics-page">
                <header className="analytics-heading">
                    <div>
                        <span className="analytics-eyebrow">
                            ANÁLISIS DE DATOS
                        </span>

                        <h1>Analíticas</h1>

                        <p>
                            Analiza la evolución de la adherencia y compara
                            los resultados de diferentes semanas.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="analytics-refresh-button"
                        onClick={() => void loadAnalytics()}
                        disabled={loading}
                    >
                        <RefreshCw size={16} />
                        {loading ? 'Actualizando…' : 'Actualizar datos'}
                    </button>
                </header>

                {error && (
                    <section className="analytics-alert" role="alert">
                        <div>
                            <strong>
                                No se pudieron cargar las métricas
                            </strong>
                            <p>{error}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => void loadAnalytics()}
                            disabled={loading}
                        >
                            Reintentar
                        </button>
                    </section>
                )}

                <section className="analytics-analysis-header">
                    <div className="analytics-analysis-icon">
                        <BarChart3 size={23} />
                    </div>

                    <div>
                        <h2>Análisis de adherencia</h2>
                        <p>
                            {latestMetrics
                                ? `Último registro semanal: ${formatDate(latestMetrics.weekStartDate)}`
                                : 'La información se mostrará cuando existan registros semanales.'}
                        </p>
                    </div>

                    <span className="analytics-record-count">
                        <CalendarDays size={15} />
                        {metrics.length} semanas
                    </span>
                </section>

                <section className="analytics-primary-grid">
                    <article className="analytics-panel analytics-trend-panel">
                        <div className="analytics-panel-heading">
                            <div>
                                <span className="analytics-section-kicker">
                                    TENDENCIA TEMPORAL
                                </span>

                                <h2>Adherencia por semana</h2>

                                <p>
                                    Evolución del porcentaje de adherencia
                                    ponderada registrado.
                                </p>
                            </div>

                            <span className="analytics-panel-icon">
                                <TrendingUp size={19} />
                            </span>
                        </div>

                        {loading ? (
                            <div className="analytics-state">
                                <span className="analytics-loader" />
                                <strong>Cargando evolución</strong>
                                <p>Consultando los registros semanales.</p>
                            </div>
                        ) : trendData.length > 0 ? (
                            <>
                                <div className="analytics-chart">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart
                                            data={trendData}
                                            margin={{
                                                top: 12,
                                                right: 14,
                                                left: -15,
                                                bottom: 4,
                                            }}
                                        >
                                            <CartesianGrid
                                                stroke="#e9ecdf"
                                                strokeDasharray="4 4"
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="week"
                                                tickLine={false}
                                                axisLine={false}
                                                minTickGap={22}
                                                tick={{
                                                    fill: '#7b8475',
                                                    fontSize: 10,
                                                }}
                                            />

                                            <YAxis
                                                domain={[0, 100]}
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{
                                                    fill: '#7b8475',
                                                    fontSize: 10,
                                                }}
                                                tickFormatter={value =>
                                                    `${value}%`
                                                }
                                            />

                                            <Tooltip
                                                labelFormatter={(_, payload) => {
                                                    const point = payload?.[0]
                                                        ?.payload as
                                                        | TrendPoint
                                                        | undefined

                                                    return point
                                                        ? `Semana del ${formatDate(point.date)}`
                                                        : ''
                                                }}
                                                formatter={value => [
                                                    `${formatNumber(Number(value))}%`,
                                                    'Adherencia ponderada',
                                                ]}
                                            />

                                            <Line
                                                type="monotone"
                                                dataKey="adherence"
                                                name="Adherencia ponderada"
                                                stroke="#748e36"
                                                strokeWidth={3}
                                                dot={{
                                                    r: 4,
                                                    fill: '#c7fe38',
                                                    stroke: '#748e36',
                                                    strokeWidth: 2,
                                                }}
                                                activeDot={{ r: 6 }}
                                                connectNulls={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="analytics-chart-legend">
                                    <span className="analytics-legend-dot" />
                                    Adherencia ponderada

                                    <span className="analytics-chart-note">
                                        {trendData.length === 1
                                            ? 'Se necesita otra semana para comparar.'
                                            : `${trendData.length} registros en orden cronológico.`}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="analytics-state">
                                <span className="analytics-state-icon">
                                    <TrendingUp size={24} />
                                </span>

                                <strong>Sin registros para analizar</strong>

                                <p>
                                    La gráfica aparecerá cuando el servicio
                                    devuelva métricas semanales.
                                </p>
                            </div>
                        )}
                    </article>

                    <article className="analytics-panel analytics-comparison-panel">
                        <div className="analytics-panel-heading">
                            <div>
                                <span className="analytics-section-kicker">
                                    COMPARACIÓN
                                </span>

                                <h2>Variación semanal</h2>

                                <p>
                                    Diferencia entre los dos últimos registros
                                    disponibles.
                                </p>
                            </div>

                            <span className="analytics-panel-icon">
                                <Activity size={19} />
                            </span>
                        </div>

                        {loading ? (
                            <div className="analytics-state compact">
                                <span className="analytics-loader" />
                                <p>Calculando comparación…</p>
                            </div>
                        ) : latestMetrics &&
                            previousMetrics &&
                            adherenceVariation ? (
                            <>
                                <div className="analytics-comparison-value">
                                    <span
                                        className={
                                            variationIsPositive
                                                ? 'analytics-variation positive'
                                                : variationIsNegative
                                                    ? 'analytics-variation negative'
                                                    : 'analytics-variation neutral'
                                        }
                                    >
                                        {variationIsPositive ? (
                                            <ArrowUpRight size={22} />
                                        ) : variationIsNegative ? (
                                            <ArrowDownRight size={22} />
                                        ) : (
                                            <Activity size={20} />
                                        )}

                                        {adherenceVariation.label}
                                    </span>

                                    <span className="analytics-comparison-caption">
                                        Variación de adherencia
                                    </span>
                                </div>

                                <div className="analytics-comparison-rows">
                                    <div>
                                        <span>Registro anterior</span>
                                        <strong>
                                            {formatNumber(
                                                previousMetrics.weightedAdherencePct,
                                            )}
                                            %
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Registro más reciente</span>
                                        <strong>
                                            {formatNumber(
                                                latestMetrics.weightedAdherencePct,
                                            )}
                                            %
                                        </strong>
                                    </div>
                                </div>

                                <p className="analytics-method-note">
                                    La diferencia se expresa en puntos
                                    porcentuales (pp), no como crecimiento
                                    porcentual relativo.
                                </p>
                            </>
                        ) : (
                            <div className="analytics-state compact">
                                <span className="analytics-state-icon">
                                    <Activity size={23} />
                                </span>

                                <strong>Comparación no disponible</strong>

                                <p>
                                    Se necesitan al menos dos registros
                                    semanales para calcular la variación.
                                </p>
                            </div>
                        )}
                    </article>
                </section>

                <section className="analytics-panel analytics-breakdown-panel">
                    <div className="analytics-panel-heading">
                        <div>
                            <span className="analytics-section-kicker">
                                DESGLOSE
                            </span>

                            <h2>Componentes de la adherencia</h2>

                            <p>
                                Indicadores correspondientes al registro
                                semanal más reciente disponible.
                            </p>
                        </div>

                        <span className="analytics-panel-icon">
                            <BarChart3 size={19} />
                        </span>
                    </div>

                    {loading ? (
                        <div className="analytics-state compact">
                            <span className="analytics-loader" />
                            <p>Cargando componentes…</p>
                        </div>
                    ) : latestMetrics ? (
                        <div className="analytics-breakdown-grid">
                            <AdherenceBar
                                label="Adherencia de frecuencia"
                                value={latestMetrics.frequencyAdherencePct}
                                description="Cumplimiento de la frecuencia prevista"
                            />

                            <AdherenceBar
                                label="Adherencia de entrenamientos"
                                value={latestMetrics.workoutAdherencePct}
                                description="Sesiones realizadas frente a las previstas"
                            />

                            <AdherenceBar
                                label="Adherencia de ejercicios"
                                value={latestMetrics.exerciseAdherencePct}
                                description="Ejercicios completados frente a los asignados"
                            />
                        </div>
                    ) : (
                        <div className="analytics-state compact">
                            <strong>Sin componentes para mostrar</strong>

                            <p>
                                No se recibieron métricas semanales para
                                construir este desglose.
                            </p>
                        </div>
                    )}
                </section>

                <footer className="analytics-footer">
                    <span>FitSense · Analíticas</span>

                    <span>
                        Análisis basado en los registros semanales devueltos
                        por el servicio.
                    </span>
                </footer>
            </main>
        </DashboardLayout>
    )
}
