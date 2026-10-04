
import {
    Activity,
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    CalendarDays,
    ClipboardList,
    Clock3,
    SlidersHorizontal,
    Zap,
} from 'lucide-react'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import './InterventionsPage.css'

const interventionSummary = [
    {
        title: 'Intervenciones registradas',
        value: '—',
        description: 'Ajustes aplicados al plan',
        icon: ClipboardList,
    },
    {
        title: 'Volumen ajustado',
        value: '—',
        description: 'Variación del volumen semanal',
        icon: Activity,
    },
    {
        title: 'Adherencia posterior',
        value: '—',
        description: 'Cumplimiento después del ajuste',
        icon: SlidersHorizontal,
    },
]

export default function InterventionsPage() {
    return (
        <DashboardLayout>
            <div className="interventions-page">
                <header className="interventions-heading">
                    <div>
                        <span className="interventions-eyebrow">
                            PERSONALIZACIÓN DEL ENTRENAMIENTO
                        </span>

                        <h1>Intervenciones</h1>

                        <p>
                            Consulta los ajustes realizados al plan de ejercicio
                            y el seguimiento de sus resultados.
                        </p>
                    </div>

                    <span className="interventions-date-label">
                        <CalendarDays size={17} />
                        Historial de ajustes
                    </span>
                </header>

                <section className="interventions-hero">
                    <div className="interventions-hero-copy">
                        <span className="interventions-hero-label">
                            <span />
                            AJUSTES PERSONALIZADOS
                        </span>

                        <h2>Un plan que se adapta a tu progreso.</h2>

                        <p>
                            Revisa las intervenciones registradas, los cambios
                            aplicados a tu entrenamiento y la evolución de la
                            adherencia después de cada ajuste.
                        </p>
                    </div>

                    <div
                        className="interventions-hero-visual"
                        aria-hidden="true"
                    >
                        <div className="interventions-hero-ring">
                            <div className="interventions-hero-icon">
                                <Zap size={34} strokeWidth={1.8} />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="interventions-section">
                    <div className="interventions-section-heading">
                        <div>
                            <h2>Resumen de intervenciones</h2>
                            <p>
                                Indicadores de los ajustes y sus resultados.
                            </p>
                        </div>

                        <span className="interventions-pending-badge">
                            <span />
                            Pendiente de datos
                        </span>
                    </div>

                    <div className="interventions-summary-grid">
                        {interventionSummary.map(
                            ({ title, value, description, icon: Icon }) => (
                                <article
                                    className="interventions-summary-card"
                                    key={title}
                                >
                                    <div className="interventions-summary-top">
                                        <span className="interventions-summary-icon">
                                            <Icon
                                                size={20}
                                                strokeWidth={1.9}
                                            />
                                        </span>

                                        <span className="interventions-summary-tag">
                                            RESUMEN
                                        </span>
                                    </div>

                                    <h3>{title}</h3>

                                    <strong className="interventions-summary-value">
                                        {value}
                                    </strong>

                                    <p>{description}</p>
                                </article>
                            ),
                        )}
                    </div>
                </section>

                <section className="interventions-history-panel">
                    <div className="interventions-panel-heading">
                        <div>
                            <h2>Historial de intervenciones</h2>
                            <p>
                                Registro de ajustes y resultados posteriores.
                            </p>
                        </div>

                        <span className="interventions-panel-icon">
                            <ClipboardList size={19} />
                        </span>
                    </div>

                    <div className="interventions-empty-state">
                        <span className="interventions-empty-icon">
                            <SlidersHorizontal size={26} />
                        </span>

                        <h3>Aún no hay intervenciones registradas</h3>

                        <p>
                            Cuando existan registros disponibles, podrás
                            consultar el motivo del ajuste, los cambios
                            realizados y los resultados posteriores.
                        </p>

                        <span className="interventions-empty-note">
                            <Clock3 size={15} />
                            El historial aparecerá al disponer de datos.
                        </span>
                    </div>
                </section>

                <section className="interventions-explanation-panel">
                    <div className="interventions-explanation-heading">
                        <span className="interventions-explanation-icon">
                            <Activity size={19} />
                        </span>

                        <div>
                            <h2>¿Qué puedes consultar?</h2>
                            <p>
                                Información útil para interpretar los ajustes
                                del plan.
                            </p>
                        </div>
                    </div>

                    <div className="interventions-explanation-grid">
                        <article className="interventions-explanation-item">
                            <span className="interventions-explanation-symbol">
                                <SlidersHorizontal size={18} />
                            </span>

                            <div>
                                <h3>Tipo de ajuste</h3>
                                <p>
                                    Cambios de volumen, duración, frecuencia
                                    o dificultad, cuando estén registrados.
                                </p>
                            </div>

                            <ArrowRight
                                className="interventions-explanation-arrow"
                                size={17}
                            />
                        </article>

                        <article className="interventions-explanation-item">
                            <span className="interventions-explanation-symbol">
                                <ArrowDownRight size={18} />
                            </span>

                            <div>
                                <h3>Variación del plan</h3>
                                <p>
                                    Diferencia entre el volumen anterior y el
                                    volumen resultante del ajuste.
                                </p>
                            </div>

                            <ArrowRight
                                className="interventions-explanation-arrow"
                                size={17}
                            />
                        </article>

                        <article className="interventions-explanation-item">
                            <span className="interventions-explanation-symbol">
                                <ArrowUpRight size={18} />
                            </span>

                            <div>
                                <h3>Resultado posterior</h3>
                                <p>
                                    Evolución de la adherencia después de la
                                    intervención, si existe ese registro.
                                </p>
                            </div>

                            <ArrowRight
                                className="interventions-explanation-arrow"
                                size={17}
                            />
                        </article>
                    </div>
                </section>

                <footer className="interventions-footer">
                    <span>FitSense · Intervenciones</span>
                    <span>
                        La información se mostrará cuando esté disponible en la API.
                    </span>
                </footer>
            </div>
        </DashboardLayout>
    )
}
