
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Activity,
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Clock3,
    RefreshCw,
    SlidersHorizontal,
    Zap,
} from 'lucide-react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
    interventionsService,
    type Intervention,
} from '../../../services/interventionsService'
import { getApiErrorMessage } from '../../../services/api'
import './InterventionsPage.css'

function formatNumber(value: number | null | undefined): string {
    if (value == null || !Number.isFinite(Number(value))) return '—'

    return Number(value).toLocaleString('es-PE', {
        maximumFractionDigits: 2,
    })
}

function formatDate(value: string, includeTime = false): string {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return value || 'Fecha no disponible'

    return date.toLocaleString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    })
}

function formatSignedPercentage(value: number | null | undefined): string {
    if (value == null || !Number.isFinite(Number(value))) return '—'

    const number = Number(value)
    return `${number > 0 ? '+' : ''}${formatNumber(number)}%`
}

export default function InterventionsPage() {
    const [interventions, setInterventions] = useState<Intervention[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadInterventions = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const data = await interventionsService.getHistory()

            const orderedData = [...data].sort(
                (a, b) =>
                    new Date(b.appliedAt).getTime() -
                    new Date(a.appliedAt).getTime(),
            )

            setInterventions(orderedData)
        } catch (err: unknown) {
            setError(getApiErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void loadInterventions()
    }, [loadInterventions])

    const latestWithAdherence = useMemo(
        () => interventions.find(item => item.adherenceAfterPct != null),
        [interventions],
    )

    const volumeChanges = useMemo(
        () =>
            interventions
                .map(item => item.actualVolumeChangePct)
                .filter(
                    (value): value is number =>
                        value != null && Number.isFinite(Number(value)),
                ),
        [interventions],
    )

    const averageVolumeChange =
        volumeChanges.length > 0
            ? volumeChanges.reduce((sum, value) => sum + value, 0) /
            volumeChanges.length
            : null

    const summaryItems = [
        {
            title: 'Intervenciones registradas',
            value: interventions.length.toLocaleString('es-PE'),
            description: 'Registros devueltos por el servicio',
            icon: ClipboardList,
        },
        {
            title: 'Variación media del volumen',
            value: formatSignedPercentage(averageVolumeChange),
            description:
                volumeChanges.length > 0
                    ? `Calculada sobre ${volumeChanges.length} registros con variación`
                    : 'Sin variaciones registradas',
            icon: Activity,
        },
        {
            title: 'Adherencia posterior',
            value:
                latestWithAdherence?.adherenceAfterPct == null
                    ? '—'
                    : `${formatNumber(latestWithAdherence.adherenceAfterPct)}%`,
            description: latestWithAdherence
                ? `Registro del ${formatDate(latestWithAdherence.appliedAt)}`
                : 'Sin resultados posteriores registrados',
            icon: SlidersHorizontal,
        },
    ]

    return (
        <DashboardLayout>
            <main className="interventions-page">
                <header className="interventions-heading">
                    <div>
                        <span className="interventions-eyebrow">
                            PERSONALIZACIÓN DEL ENTRENAMIENTO
                        </span>

                        <h1>Intervenciones</h1>

                        <p>
                            Consulta los ajustes registrados en el plan de
                            ejercicio, sus variaciones y los resultados
                            posteriores disponibles.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="interventions-refresh-button"
                        onClick={() => void loadInterventions()}
                        disabled={loading}
                    >
                        <RefreshCw size={16} />
                        {loading ? 'Actualizando…' : 'Actualizar historial'}
                    </button>
                </header>

                <section className="interventions-hero">
                    <div className="interventions-hero-copy">
                        <span className="interventions-hero-label">
                            <span />
                            AJUSTES PERSONALIZADOS
                        </span>

                        <h2>Un plan que se adapta a tu progreso.</h2>

                        <p>
                            Revisa cuándo se registró cada intervención,
                            qué cambios se aplicaron y qué datos de adherencia
                            están disponibles para su seguimiento.
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
                    <section
                        className="interventions-error"
                        role="alert"
                    >
                        <span className="interventions-error-icon">
                            <Activity size={20} />
                        </span>

                        <div>
                            <strong>
                                No se pudo cargar el historial
                            </strong>
                            <p>{error}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => void loadInterventions()}
                            disabled={loading}
                        >
                            Reintentar
                        </button>
                    </section>
                )}

                <section className="interventions-section">
                    <div className="interventions-section-heading">
                        <div>
                            <h2>Resumen de intervenciones</h2>
                            <p>
                                Indicadores calculados a partir de los
                                registros disponibles.
                            </p>
                        </div>

                        <span
                            className={`interventions-status ${loading
                                ? 'is-loading'
                                : error
                                    ? 'is-error'
                                    : interventions.length > 0
                                        ? 'is-available'
                                        : 'is-empty'
                                }`}
                        >
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
                        {summaryItems.map(
                            ({ title, value, description, icon: Icon }) => (
                                <article
                                    className="interventions-summary-card"
                                    key={title}
                                >
                                    <div className="interventions-summary-top">
                                        <span className="interventions-summary-icon">
                                            <Icon size={20} />
                                        </span>
                                        <span className="interventions-summary-tag">
                                            RESUMEN
                                        </span>
                                    </div>

                                    <h3>{title}</h3>

                                    <strong className="interventions-summary-value">
                                        {loading ? '…' : error ? '—' : value}
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
                            <span className="interventions-eyebrow">
                                REGISTROS
                            </span>
                            <h2>Historial de intervenciones</h2>
                            <p>
                                Ajustes ordenados del más reciente al más
                                antiguo.
                            </p>
                        </div>

                        <span className="interventions-panel-icon">
                            <ClipboardList size={19} />
                        </span>
                    </div>

                    {loading ? (
                        <div className="interventions-empty-state">
                            <span className="interventions-loader" />
                            <h3>Cargando intervenciones…</h3>
                            <p>
                                Consultando los registros del servicio.
                            </p>
                        </div>
                    ) : error ? (
                        <div className="interventions-empty-state">
                            <span className="interventions-empty-icon">
                                <Activity size={25} />
                            </span>
                            <h3>Historial no disponible</h3>
                            <p>
                                No podemos confirmar si existen intervenciones
                                hasta recuperar la respuesta del servicio.
                            </p>
                            <button
                                type="button"
                                onClick={() => void loadInterventions()}
                                disabled={loading}
                            >
                                Reintentar consulta
                            </button>
                        </div>
                    ) : interventions.length === 0 ? (
                        <div className="interventions-empty-state">
                            <span className="interventions-empty-icon">
                                <SlidersHorizontal size={26} />
                            </span>
                            <h3>Aún no hay intervenciones registradas</h3>
                            <p>
                                Los registros aparecerán aquí cuando el
                                servicio devuelva intervenciones guardadas.
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
                                                    'Intervención registrada'}
                                            </h3>

                                            <p>
                                                <CalendarDays size={14} />
                                                {formatDate(item.appliedAt, true)}
                                            </p>
                                        </div>

                                        <span className="interventions-record-badge">
                                            <CheckCircle2 size={14} />
                                            Registrada
                                        </span>
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
                                            <span>
                                                Adherencia que activó el ajuste
                                            </span>
                                            <strong>
                                                {item.triggerAdherencePct == null
                                                    ? 'Sin registro'
                                                    : `${formatNumber(item.triggerAdherencePct)}%`}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Volumen anterior</span>
                                            <strong>
                                                {item.previousWeekVolume == null
                                                    ? 'Sin registro'
                                                    : formatNumber(item.previousWeekVolume)}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Volumen resultante</span>
                                            <strong>
                                                {item.resultingWeekVolume == null
                                                    ? 'Sin registro'
                                                    : formatNumber(item.resultingWeekVolume)}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Variación real del volumen</span>
                                            <strong
                                                className={
                                                    item.actualVolumeChangePct == null
                                                        ? ''
                                                        : item.actualVolumeChangePct > 0
                                                            ? 'interventions-value-positive'
                                                            : item.actualVolumeChangePct < 0
                                                                ? 'interventions-value-negative'
                                                                : ''
                                                }
                                            >
                                                {formatSignedPercentage(
                                                    item.actualVolumeChangePct,
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Adherencia posterior</span>
                                            <strong>
                                                {item.adherenceAfterPct == null
                                                    ? 'Pendiente de registro'
                                                    : `${formatNumber(item.adherenceAfterPct)}%`}
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
                            <h2>Cómo interpretar los registros</h2>
                            <p>
                                Qué representa cada dato de una intervención.
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
                                    Tipos de modificación registrados por el
                                    servicio. Si no se proporcionan, se indica
                                    que el dato no está especificado.
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
                                <h3>Variación del volumen</h3>
                                <p>
                                    Porcentaje de cambio informado para comparar
                                    el volumen anterior con el resultante.
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
                                    Porcentaje de adherencia posterior cuando
                                    existe un valor registrado. Su presencia
                                    no demuestra por sí sola que el ajuste
                                    haya causado el resultado.
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
                            : error
                                ? 'No se pudo verificar la información del servicio.'
                                : 'Información basada en los registros devueltos por el servicio.'}
                    </span>
                </footer>
            </main>
        </DashboardLayout>
    )
}