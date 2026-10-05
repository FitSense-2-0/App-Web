
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
import { useEffect, useState } from 'react'
import {
    interventionsService,
    type Intervention,
} from '../../../services/interventionsService'
import { getApiErrorMessage } from '../../../services/api'

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
    const [interventions, setInterventions] = useState<Intervention[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    async function loadInterventions() {
        setLoading(true)
        setError('')

        try {
            const data = await interventionsService.getHistory()
            setInterventions(
                [...data].sort(
                    (a, b) =>
                        new Date(b.appliedAt).getTime() -
                        new Date(a.appliedAt).getTime(),
                ),
            )
        } catch (err: unknown) {
            setError(getApiErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadInterventions()
    }, [])

    const latestWithAdherence = interventions.find(
        item => item.adherenceAfterPct != null,
    )

    const volumeChanges = interventions
        .map(item => item.actualVolumeChangePct)
        .filter((value): value is number => value != null)

    const averageVolumeChange =
        volumeChanges.length > 0
            ? volumeChanges.reduce((sum, value) => sum + value, 0) /
            volumeChanges.length
            : null

    const interventionSummary = [
        {
            title: 'Intervenciones registradas',
            value: interventions.length.toLocaleString('es-PE'),
            description: 'Ajustes devueltos por la API',
            icon: ClipboardList,
        },
        {
            title: 'Variación media del volumen',
            value:
                averageVolumeChange == null
                    ? '—'
                    : `${averageVolumeChange > 0 ? '+' : ''}${averageVolumeChange.toLocaleString('es-PE', { maximumFractionDigits: 1 })}%`,
            description: 'Promedio de variaciones registradas',
            icon: Activity,
        },
        {
            title: 'Adherencia posterior',
            value:
                latestWithAdherence?.adherenceAfterPct == null
                    ? '—'
                    : `${latestWithAdherence.adherenceAfterPct}%`,
            description: latestWithAdherence
                ? `Registro del ${new Date(latestWithAdherence.appliedAt).toLocaleDateString('es-PE')}`
                : 'Sin resultados posteriores registrados',
            icon: SlidersHorizontal,
        },
    ]

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
                            Revisa los ajustes registrados, los cambios aplicados
                            y los resultados posteriores disponibles.
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

                {error && (
                    <div className="interventions-empty-state" role="alert">
                        <h3>No se pudo cargar el historial</h3>
                        <p>{error}</p>
                        <button
                            type="button"
                            onClick={() => void loadInterventions()}
                        >
                            Reintentar
                        </button>
                    </div>
                )}

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
                            {loading
                                ? 'Cargando datos'
                                : error
                                    ? 'Error de conexión'
                                    : interventions.length > 0
                                        ? 'Datos disponibles'
                                        : 'Sin registros'}
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
                                            <Icon size={20} strokeWidth={1.9} />
                                        </span>
                                        <span className="interventions-summary-tag">
                                            RESUMEN
                                        </span>
                                    </div>

                                    <h3>{title}</h3>
                                    <strong className="interventions-summary-value">
                                        {loading ? '…' : value}
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

                    {loading ? (
                        <div className="interventions-empty-state">
                            <Clock3 size={25} />
                            <h3>Cargando intervenciones…</h3>
                            <p>Consultando los registros de la API.</p>
                        </div>
                    ) : interventions.length === 0 ? (
                        <div className="interventions-empty-state">
                            <span className="interventions-empty-icon">
                                <SlidersHorizontal size={26} />
                            </span>
                            <h3>
                                {error
                                    ? 'Historial no disponible'
                                    : 'Aún no hay intervenciones registradas'}
                            </h3>
                            <p>
                                {error
                                    ? 'No fue posible obtener los registros del servidor.'
                                    : 'Los ajustes aparecerán aquí cuando la API devuelva intervenciones registradas.'}
                            </p>
                        </div>
                    ) : (
                        <div className="interventions-live-history">
                            {interventions.map(item => (
                                <article
                                    className="interventions-live-card"
                                    key={item.interventionId}
                                >
                                    <div className="interventions-live-card-heading">
                                        <span className="interventions-summary-icon">
                                            <SlidersHorizontal size={20} />
                                        </span>
                                        <div>
                                            <h3>
                                                {item.messageShown ||
                                                    'Ajuste personalizado del plan'}
                                            </h3>
                                            <p>
                                                <CalendarDays size={14} />
                                                {new Date(
                                                    item.appliedAt,
                                                ).toLocaleString('es-PE')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="interventions-live-details">
                                        <div>
                                            <span>Tipo de ajuste</span>
                                            <strong>
                                                {item.adjustmentTypes?.length
                                                    ? item.adjustmentTypes.join(', ')
                                                    : 'No especificado'}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Adherencia que activó el ajuste</span>
                                            <strong>
                                                {item.triggerAdherencePct == null
                                                    ? '—'
                                                    : `${item.triggerAdherencePct}%`}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Volumen anterior</span>
                                            <strong>
                                                {item.previousWeekVolume == null
                                                    ? '—'
                                                    : item.previousWeekVolume.toLocaleString('es-PE')}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Volumen resultante</span>
                                            <strong>
                                                {item.resultingWeekVolume == null
                                                    ? '—'
                                                    : item.resultingWeekVolume.toLocaleString('es-PE')}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Variación real del volumen</span>
                                            <strong>
                                                {item.actualVolumeChangePct == null
                                                    ? '—'
                                                    : `${item.actualVolumeChangePct > 0 ? '+' : ''}${item.actualVolumeChangePct}%`}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Adherencia posterior</span>
                                            <strong>
                                                {item.adherenceAfterPct == null
                                                    ? 'Pendiente de registro'
                                                    : `${item.adherenceAfterPct}%`}
                                            </strong>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section className="interventions-explanation-panel">
                    <div className="interventions-explanation-heading">
                        <span className="interventions-explanation-icon">
                            <Activity size={19} />
                        </span>
                        <div>
                            <h2>¿Qué puedes consultar?</h2>
                            <p>
                                Información para interpretar los ajustes del plan.
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
                                    Cambios registrados en volumen, duración,
                                    frecuencia o dificultad.
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
                                    Comparación del volumen anterior con el
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
                                    Adherencia posterior, cuando ese dato
                                    esté disponible.
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
                        {loading
                            ? 'Cargando información…'
                            : 'Información obtenida de la API de FitSense.'}
                    </span>
                </footer>
            </div>
        </DashboardLayout>
    )
}