
import { ArrowLeft, Activity, CalendarDays, History, UserRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import './ParticipantDetailPage.css'

export default function ParticipantDetailPage() {
    const { participantId } = useParams<{ participantId: string }>()

    return (
        <DashboardLayout>
            <main className="participant-detail-page">
                <Link
                    to="/dashboard/participants"
                    className="participant-detail-back"
                >
                    <ArrowLeft size={18} />
                    Volver a participantes
                </Link>

                <header className="participant-detail-heading">
                    <div>
                        <span className="participant-detail-eyebrow">
                            SEGUIMIENTO INDIVIDUAL
                        </span>
                        <h1>Detalle del participante</h1>
                        <p>
                            Consulta la adherencia, evolución y adaptaciones del plan
                            de ejercicio.
                        </p>
                    </div>

                    <span className="participant-detail-pending">
                        Datos pendientes
                    </span>
                </header>

                <section className="participant-detail-profile">
                    <div className="participant-detail-avatar">
                        <UserRound size={26} />
                    </div>

                    <div className="participant-detail-identity">
                        <span>CÓDIGO DEL PARTICIPANTE</span>
                        <h2>{participantId ?? 'No especificado'}</h2>
                        <p>
                            El perfil se mostrará cuando se conecte el endpoint
                            administrativo.
                        </p>
                    </div>
                </section>

                <section className="participant-detail-metrics">
                    <article className="participant-detail-card">
                        <div className="participant-detail-card-icon">
                            <Activity size={20} />
                        </div>
                        <span>ADHERENCIA SEMANAL</span>
                        <strong>—</strong>
                        <p>Pendiente de métricas reales</p>
                    </article>

                    <article className="participant-detail-card">
                        <div className="participant-detail-card-icon">
                            <CalendarDays size={20} />
                        </div>
                        <span>SEMANA REGISTRADA</span>
                        <strong>—</strong>
                        <p>Pendiente de historial semanal</p>
                    </article>

                    <article className="participant-detail-card">
                        <div className="participant-detail-card-icon">
                            <History size={20} />
                        </div>
                        <span>ADAPTACIONES DEL PLAN</span>
                        <strong>—</strong>
                        <p>Pendiente de historial de adaptaciones</p>
                    </article>
                </section>

                <section className="participant-detail-panel">
                    <div className="participant-detail-panel-heading">
                        <div>
                            <h2>Evolución de la adherencia</h2>
                            <p>
                                Historial semanal del cumplimiento del plan de ejercicio.
                            </p>
                        </div>
                    </div>

                    <div className="participant-detail-empty">
                        <Activity size={28} />
                        <strong>Aún no hay métricas disponibles</strong>
                        <p>
                            Aquí se mostrarán los registros semanales proporcionados
                            por el backend.
                        </p>
                    </div>
                </section>

                <section className="participant-detail-panel">
                    <div className="participant-detail-panel-heading">
                        <div>
                            <h2>Historial de adaptaciones</h2>
                            <p>
                                Seguimiento de los ajustes realizados en el plan de ejercicio.
                            </p>
                        </div>
                    </div>

                    <div className="participant-detail-empty">
                        <History size={28} />
                        <strong>Aún no hay adaptaciones disponibles</strong>
                        <p>
                            Los ajustes se mostrarán cuando exista un endpoint que
                            permita consultar su historial.
                        </p>
                    </div>
                </section>

                <p className="participant-detail-notice">
                    La información individual y las métricas se cargarán desde
                    el backend. Esta pantalla no genera ni estima datos.
                </p>
            </main>
        </DashboardLayout>
    )
}