
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
import './AnalyticsPage.css'

const trendData: { week: string; adherence: number }[] = []

const indicators = [
    {
        title: 'Adherencia ponderada',
        description: 'Cumplimiento global del plan',
        icon: TrendingUp,
    },
    {
        title: 'Entrenamientos completados',
        description: 'Sesiones finalizadas',
        icon: CheckCircle2,
    },
    {
        title: 'Volumen ejecutado',
        description: 'Volumen registrado de ejercicio',
        icon: Dumbbell,
    },
    {
        title: 'Intervenciones registradas',
        description: 'Ajustes aplicados al plan',
        icon: ClipboardList,
    },
]

export default function AnalyticsPage() {
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

                    <div className="analytics-hero-icon">
                        <BarChart3 size={35} />
                    </div>
                </section>

                <section className="section-heading">
                    <div>
                        <h2>Indicadores de seguimiento</h2>
                        <p>
                            Resumen de las métricas disponibles para el análisis.
                        </p>
                    </div>

                    <span className="pending-label">
                        <span className="status-dot" />
                        Sin datos disponibles
                    </span>
                </section>

                <section className="metrics-grid analytics-indicator-grid">
                    {indicators.map(({ title, description, icon: Icon }) => (
                        <article className="metric-card" key={title}>
                            <div className="metric-top">
                                <span className="metric-icon">
                                    <Icon size={19} />
                                </span>
                                <span className="metric-tag">ANÁLISIS</span>
                            </div>

                            <p>{title}</p>
                            <h3>—</h3>

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

                        {trendData.length > 0 ? (
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
                                            tickFormatter={(value) => `${value}%`}
                                        />

                                        <Tooltip
                                            formatter={(value) => [
                                                `${value}%`,
                                                'Adherencia',
                                            ]}
                                        />

                                        <Line
                                            type="monotone"
                                            dataKey="adherence"
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

                                <strong>Esperando datos de adherencia</strong>

                                <p>
                                    La tendencia aparecerá cuando existan métricas
                                    semanales disponibles.
                                </p>
                            </div>
                        )}
                    </article>

                    <article className="content-card analytics-chart-card">
                        <div className="card-heading">
                            <div>
                                <h2>Actividad y ajustes</h2>
                                <p>Seguimiento del plan de ejercicio</p>
                            </div>

                            <span className="card-icon">
                                <Activity size={18} />
                            </span>
                        </div>

                        <div className="analytics-empty">
                            <span className="analytics-empty-icon">
                                <ClipboardList size={23} />
                            </span>

                            <strong>Sin registros para comparar</strong>

                            <p>
                                Aquí se podrá consultar la actividad registrada y su
                                relación con las intervenciones, si la API proporciona
                                esos datos.
                            </p>

                            <Link
                                className="analytics-text-link"
                                to="/dashboard/interventions"
                            >
                                Consultar intervenciones
                                <span>→</span>
                            </Link>
                        </div>
                    </article>
                </section>

                <footer className="dashboard-footer">
                    <span>FitSense · Analítica</span>
                    <span>
                        Los análisis se actualizarán con los datos disponibles de la API.
                    </span>
                </footer>
            </div>
        </DashboardLayout>
    )
}
