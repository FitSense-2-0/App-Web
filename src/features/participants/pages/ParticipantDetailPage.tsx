import {

    Activity,

    ArrowLeft,

    CalendarDays,

    CheckCircle2,

    Clock3,

    Dumbbell,

    History,

    AlertTriangle,

} from 'lucide-react'

import {

    BarChart,

    CartesianGrid,

    Legend,

    Line,

    LineChart,

    ResponsiveContainer,

    Tooltip,

    XAxis,

    Bar,

    YAxis,

} from 'recharts'

import { Link, useParams } from 'react-router-dom'

import DashboardLayout from '../../../components/layout/DashboardLayout'

import { demoParticipants } from '../data/Participants'

import './ParticipantDetailPage.css'



const numberFormatter = new Intl.NumberFormat('es-PE')



function formatWeekLabel(value: string) {

    const date = new Date(`${value}T12:00:00Z`)

    if (Number.isNaN(date.getTime())) return value



    return new Intl.DateTimeFormat('es-PE', {

        day: '2-digit',

        month: 'short',

        timeZone: 'UTC',

    }).format(date)

}



function formatDate(value: string) {

    if (!value || value === '—') return 'Sin registro'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return value



    return new Intl.DateTimeFormat('es-PE', {

        day: '2-digit',

        month: 'long',

        year: 'numeric',

        timeZone: 'UTC',

    }).format(date)

}



export default function ParticipantDetailPage() {

    const { participantId } = useParams<{ participantId: string }>()

    const participant = demoParticipants.find((item) => item.id === participantId)



    if (!participant) {

        return (

            <DashboardLayout>

                <main className="participant-detail-page">

                    <Link to="/dashboard/participants" className="participant-detail-back">

                        <ArrowLeft size={18} />

                        Volver a participantes

                    </Link>

                    <section className="participant-detail-panel participant-detail-not-found">

                        <AlertTriangle size={30} />

                        <h1>Participante no encontrado</h1>

                        <p>No existe un participante con el código solicitado.</p>

                        <Link to="/dashboard/participants" className="participant-detail-action">

                            Ver participantes

                        </Link>

                    </section>

                </main>

            </DashboardLayout>

        )

    }



    const adherenceTone =

        participant.adherence === null

            ? 'Sin registros actuales'

            : participant.adherence >= 80

                ? 'Adherencia alta'

                : participant.adherence >= 60

                    ? 'Adherencia moderada'

                    : 'Adherencia baja'



    const workoutCompletionRate =

        participant.scheduledWorkouts > 0

            ? Math.round((participant.completedWorkouts / participant.scheduledWorkouts) * 100)

            : null



    const volumeCompletionRate =

        participant.plannedVolume > 0

            ? Math.round((participant.executedVolume / participant.plannedVolume) * 100)

            : null



    const chartHistory = [...participant.weeklyHistory]

        .sort((a, b) => a.week.localeCompare(b.week))

        .map((record) => ({

            ...record,

            weekLabel: formatWeekLabel(record.week),

        }))







    const adherenceChange =

        chartHistory.length >= 2

            ? chartHistory[chartHistory.length - 1].adherence -

            chartHistory[chartHistory.length - 2].adherence

            : null



    const riskClass = `participant-risk--${participant.riskLevel.toLowerCase()}`

    const volumeBarWidth = Math.min(100, Math.max(0, volumeCompletionRate ?? 0))



    return (

        <DashboardLayout>

            <main className="participant-detail-page">

                <Link to="/dashboard/participants" className="participant-detail-back">

                    <ArrowLeft size={18} />

                    Volver a participantes

                </Link>



                <header className="participant-detail-heading">

                    <div>

                        <span className="participant-detail-eyebrow">SEGUIMIENTO INDIVIDUAL</span>

                        <h1>Detalle del participante</h1>

                        <p>Consulta su perfil, evolución de adherencia y actividad de entrenamiento.</p>

                    </div>

                    <span className={`participant-status participant-status--${participant.status.toLowerCase()}`}>

                        {participant.status}

                    </span>

                </header>



                <section className="participant-detail-profile">

                    <div className="participant-detail-avatar" aria-hidden="true">

                        {participant.name.charAt(0).toUpperCase()}

                    </div>

                    <div className="participant-detail-identity">

                        <span>CÓDIGO DEL PARTICIPANTE</span>

                        <h2>{participant.name}</h2>

                        <p>{participant.email}</p>

                        <p>{participant.id} <span aria-hidden="true">·</span> {participant.level} <span aria-hidden="true">·</span> {participant.goal}</p>

                    </div>

                </section>



                <section className="participant-detail-metrics" aria-label="Resumen del participante">

                    <article className="participant-detail-card">

                        <div className="participant-detail-card-icon"><Activity size={20} /></div>

                        <span>ADHERENCIA SEMANAL</span>

                        <strong>{participant.adherence === null ? '—' : `${participant.adherence}%`}</strong>

                        <p>{adherenceTone}</p>

                    </article>



                    <article className="participant-detail-card">

                        <div className="participant-detail-card-icon"><CalendarDays size={20} /></div>

                        <span>ENTRENAMIENTOS</span>

                        <strong>{participant.completedWorkouts}/{participant.scheduledWorkouts}</strong>

                        <p>{workoutCompletionRate === null ? 'Sin sesiones programadas' : `${workoutCompletionRate}% de cumplimiento`}</p>

                    </article>



                    <article className="participant-detail-card">

                        <div className="participant-detail-card-icon"><History size={20} /></div>

                        <span>ADAPTACIONES</span>

                        <strong>{participant.interventions.length}</strong>

                        <p>Adaptaciones registradas para el participante</p>

                    </article>



                    <article className="participant-detail-card">

                        <div className="participant-detail-card-icon"><Clock3 size={20} /></div>

                        <span>TIEMPO DE ENTRENAMIENTO</span>

                        <strong>{numberFormatter.format(participant.trainingMinutes)} <small>min</small></strong>

                        <p>Tiempo registrado en el periodo</p>

                    </article>



                    <article className="participant-detail-card">

                        <div className="participant-detail-card-icon"><AlertTriangle size={20} /></div>

                        <span>NIVEL DE RIESGO</span>

                        <strong className={`participant-risk ${riskClass}`}>{participant.riskLevel}</strong>

                        <p>{participant.consecutiveSkips} sesiones omitidas consecutivamente</p>

                    </article>



                    <article className="participant-detail-card">

                        <div className="participant-detail-card-icon"><Dumbbell size={20} /></div>

                        <span>ÚLTIMO ENTRENAMIENTO</span>

                        <strong className="participant-detail-date-value">{formatDate(participant.lastWorkout)}</strong>

                        <p>Fecha del último registro disponible</p>

                    </article>

                </section>



                <section className="participant-detail-panel">

                    <div className="participant-detail-panel-heading">

                        <div>

                            <h2>Evolución de la adherencia</h2>

                            <p>Porcentaje semanal de cumplimiento registrado.</p>

                        </div>

                    </div>

                    {chartHistory.length > 0 ? (

                        <>

                            <div className="participant-detail-chart">

                                <ResponsiveContainer width="100%" height="100%">

                                    <LineChart

                                        data={chartHistory}

                                        margin={{ top: 10, right: 18, bottom: 8, left: 12 }}

                                    >

                                        <CartesianGrid stroke="#edf0e8" strokeDasharray="4 4" />

                                        <XAxis

                                            dataKey="weekLabel"

                                            padding={{ left: 12, right: 12 }}

                                            tickMargin={10}

                                            tickLine={false}

                                            axisLine={false}

                                        />

                                        <YAxis

                                            width={48}

                                            domain={[0, 100]}

                                            tickFormatter={(value) => `${value}%`}

                                            tick={{ fill: '#7c8476', fontSize: 11 }}

                                            axisLine={false}

                                            tickLine={false}

                                        />

                                        <Tooltip formatter={(value) => [`${value}%`, 'Adherencia']} contentStyle={{ borderRadius: 10, border: '1px solid #e5e8df' }} />

                                        <Line type="monotone" dataKey="adherence" name="Adherencia" stroke="#748e36" strokeWidth={3} dot={{ r: 4, fill: '#748e36', strokeWidth: 2, stroke: '#ffffff' }} activeDot={{ r: 6 }} />

                                    </LineChart>

                                </ResponsiveContainer>

                            </div>

                            {adherenceChange !== null && (

                                <p className={`participant-adherence-change ${adherenceChange < 0 ? 'is-negative' : ''}`}>

                                    {adherenceChange > 0

                                        ? `Subió ${adherenceChange} puntos porcentuales respecto a la semana anterior.`

                                        : adherenceChange < 0

                                            ? `Bajó ${Math.abs(adherenceChange)} puntos porcentuales respecto a la semana anterior.`

                                            : 'Se mantuvo igual que la semana anterior.'}

                                </p>

                            )}

                        </>

                    ) : (

                        <div className="participant-detail-empty"><Activity size={28} /><strong>Sin registros semanales</strong><p>Aún no hay datos de adherencia para mostrar.</p></div>

                    )}

                </section>



                <section className="participant-detail-panel">

                    <div className="participant-detail-panel-heading">

                        <div>

                            <h2>Entrenamientos por semana</h2>

                            <p>Comparación entre sesiones programadas y completadas.</p>

                        </div>

                    </div>

                    {chartHistory.length > 0 ? (

                        <div className="participant-detail-chart">

                            <ResponsiveContainer width="100%" height="100%">

                                <BarChart data={chartHistory} margin={{ top: 12, right: 16, left: -12, bottom: 4 }}>

                                    <CartesianGrid stroke="#edf0e8" strokeDasharray="4 4" />

                                    <XAxis dataKey="weekLabel" tick={{ fill: '#7c8476', fontSize: 11 }} axisLine={false} tickLine={false} />

                                    <YAxis allowDecimals={false} tick={{ fill: '#7c8476', fontSize: 11 }} axisLine={false} tickLine={false} />

                                    <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e8df' }} />

                                    <Legend />

                                    <Bar dataKey="scheduledWorkouts" name="Programados" fill="#dce7c5" radius={[5, 5, 0, 0]} />

                                    <Bar dataKey="completedWorkouts" name="Completados" fill="#748e36" radius={[5, 5, 0, 0]} />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                    ) : (

                        <div className="participant-detail-empty"><strong>Sin registros de entrenamiento</strong></div>

                    )}

                </section>



                <section className="participant-detail-panel">

                    <div className="participant-detail-panel-heading">

                        <div>

                            <h2>Volumen del entrenamiento</h2>

                            <p>Comparación del volumen planificado frente al volumen ejecutado.</p>

                        </div>

                    </div>

                    <div className="participant-volume-summary">

                        <div className="participant-volume-values">

                            <div className="participant-volume-value">

                                <span>Volumen planificado</span>

                                <strong>{numberFormatter.format(participant.plannedVolume)}</strong>

                            </div>

                            <div className="participant-volume-value">

                                <span>Volumen ejecutado</span>

                                <strong>{numberFormatter.format(participant.executedVolume)}</strong>

                            </div>

                        </div>

                        <div className="participant-volume-track" role="progressbar" aria-label="Volumen ejecutado respecto al plan" aria-valuemin={0} aria-valuemax={100} aria-valuenow={volumeBarWidth}>

                            <div className="participant-volume-fill" style={{ width: `${volumeBarWidth}%` }} />

                        </div>

                        <div className="participant-volume-footer">

                            <span>Porcentaje del volumen planificado</span>

                            <strong>{volumeCompletionRate === null ? '—' : `${volumeCompletionRate}%`}</strong>

                        </div>

                    </div>

                </section>



                <section className="participant-detail-panel participant-followup-panel">
                    <div className="participant-detail-panel-heading">
                        <div>
                            <h2>Análisis de continuidad</h2>
                            <p>Lectura de la evolución reciente para identificar cuándo conviene dar seguimiento.</p>
                        </div>
                    </div>

                    <div className="participant-followup-grid">
                        <article className="participant-followup-item">
                            <span className="participant-followup-icon">
                                <Activity size={19} />
                            </span>
                            <div className="participant-followup-content">
                                <span className="participant-followup-label">Tendencia de adherencia</span>
                                <strong>
                                    {adherenceChange === null
                                        ? 'Sin tendencia'
                                        : adherenceChange > 0
                                            ? 'En mejora'
                                            : adherenceChange < 0
                                                ? 'En descenso'
                                                : 'Estable'}
                                </strong>
                                <p>
                                    {adherenceChange === null
                                        ? 'Se necesitan al menos dos registros semanales para comparar la evolución.'
                                        : adherenceChange > 0
                                            ? `Aumentó ${adherenceChange} puntos porcentuales desde el registro anterior.`
                                            : adherenceChange < 0
                                                ? `Disminuyó ${Math.abs(adherenceChange)} puntos porcentuales desde el registro anterior.`
                                                : 'El porcentaje se mantiene igual respecto al registro anterior.'}
                                </p>
                            </div>
                        </article>

                        <article className="participant-followup-item">
                            <span className={`participant-followup-icon ${adherenceChange !== null && adherenceChange < 0 ? 'participant-followup-icon--warning' : ''}`}>
                                <History size={19} />
                            </span>
                            <div className="participant-followup-content">
                                <span className="participant-followup-label">Lectura del seguimiento</span>
                                <strong>
                                    {participant.status === 'Inactivo'
                                        ? 'Requiere reactivación'
                                        : participant.riskLevel === 'Alto'
                                            ? 'Atención prioritaria'
                                            : participant.riskLevel === 'Medio'
                                                ? 'Seguimiento preventivo'
                                                : 'Continuidad favorable'}
                                </strong>
                                <p>
                                    {participant.status === 'Inactivo'
                                        ? 'El participante figura como inactivo. Conviene revisar si necesita apoyo para retomar el plan.'
                                        : participant.riskLevel === 'Alto'
                                            ? 'Prioriza revisar posibles barreras y acordar un objetivo de entrenamiento realista.'
                                            : participant.riskLevel === 'Medio'
                                                ? 'Realiza un seguimiento preventivo para detectar dificultades antes de que aumenten.'
                                                : 'Mantén el seguimiento habitual y refuerza las conductas que favorecen la constancia.'}
                                </p>
                            </div>
                        </article>

                        <article className="participant-followup-item participant-followup-item--recommendation">
                            <span className="participant-followup-icon">
                                <CheckCircle2 size={19} />
                            </span>
                            <div className="participant-followup-content">
                                <span className="participant-followup-label">Próxima acción sugerida</span>
                                <strong>
                                    {participant.status === 'Inactivo' || participant.riskLevel === 'Alto' || (adherenceChange !== null && adherenceChange < 0)
                                        ? 'Contactar y revisar el plan'
                                        : participant.riskLevel === 'Medio'
                                            ? 'Programar una revisión'
                                            : 'Mantener el acompañamiento'}
                                </strong>
                                <p>
                                    {participant.status === 'Inactivo' || participant.riskLevel === 'Alto' || (adherenceChange !== null && adherenceChange < 0)
                                        ? 'Conversar sobre las dificultades recientes antes de proponer cambios en la rutina.'
                                        : participant.riskLevel === 'Medio'
                                            ? 'Confirmar que la frecuencia y la carga del plan siguen siendo adecuadas.'
                                            : 'Revisar la evolución en el próximo registro semanal.'}
                                </p>
                            </div>
                        </article>
                    </div>
                </section>

                <section className="participant-detail-panel">

                    <div className="participant-detail-panel-heading">

                        <div>

                            <h2>Historial de adaptaciones</h2>

                            <p>Registro de ajustes asociados al plan de ejercicio.</p>

                        </div>

                    </div>

                    {participant.interventions.length > 0 ? (

                        <div className="participant-interventions-list">

                            {participant.interventions.map((intervention) => (

                                <article className="participant-intervention-item" key={intervention.id}>

                                    <div className="participant-intervention-icon"><CheckCircle2 size={18} /></div>

                                    <div className="participant-intervention-content">

                                        <div className="participant-intervention-title-row">

                                            <h3>{intervention.type}</h3>

                                            <span>{formatDate(intervention.date)}</span>

                                        </div>

                                        <p>{intervention.reason}</p>

                                        <div className="participant-intervention-meta">

                                            <span>Adherencia previa: <strong>{intervention.previousAdherence}%</strong></span>

                                            <span>Volumen resultante: <strong>{numberFormatter.format(intervention.resultingVolume)}</strong></span>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>

                    ) : (

                        <div className="participant-detail-empty"><History size={26} /><strong>Sin adaptaciones registradas</strong><p>Este participante no tiene adaptaciones registradas.</p></div>

                    )}

                </section>



            </main>

        </DashboardLayout>

    )

}
