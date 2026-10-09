
import { useMemo, useState } from 'react'
import {
    Search,
    Users,
    UserRound,
    UserCheck,
    ChevronRight,
    SlidersHorizontal,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './ParticipantsPage.css'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { demoParticipants } from '../data/Participants'

export default function ParticipantsPage() {
    const [search, setSearch] = useState('')
    const [level, setLevel] = useState('Todos')
    const [status, setStatus] = useState('Todos')

    const filteredParticipants = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        return demoParticipants.filter((participant) => {
            const matchesSearch =
                !normalizedSearch ||
                participant.name.toLowerCase().includes(normalizedSearch) ||
                participant.email.toLowerCase().includes(normalizedSearch) ||
                participant.id.toLowerCase().includes(normalizedSearch)

            const matchesLevel =
                level === 'Todos' || participant.level === level

            const matchesStatus =
                status === 'Todos' || participant.status === status

            return matchesSearch && matchesLevel && matchesStatus
        })
    }, [search, level, status])

    const activeCount = demoParticipants.filter(
        (participant) => participant.status === 'Activo',
    ).length

    const participantsWithAdherence = demoParticipants.filter(
        (participant) => participant.adherence !== null,
    )

    const averageAdherence = participantsWithAdherence.length
        ? Math.round(
            participantsWithAdherence.reduce(
                (sum, participant) => sum + (participant.adherence ?? 0),
                0,
            ) / participantsWithAdherence.length,
        )
        : null

    return (
        <DashboardLayout>
            <main className="participants-page">
                <header className="participants-header">
                    <div>
                        <div className="participants-eyebrow">
                            <Users size={15} />
                            GESTIÓN DE USUARIOS
                        </div>
                        <h1>Participantes</h1>
                        <p>
                            Consulta los perfiles y el seguimiento de adherencia
                            de los participantes de FitSense.
                        </p>
                    </div>

                    <div className="participants-header-icon" aria-hidden="true">
                        <UserRound size={27} />
                    </div>
                </header>

                <section className="participants-summary" aria-label="Resumen de participantes">
                    <article className="participants-summary-card">
                        <div className="participants-summary-icon">
                            <Users size={20} />
                        </div>
                        <div>
                            <span className="participants-summary-label">
                                Participantes registrados
                            </span>
                            <strong>{demoParticipants.length}</strong>
                            <small>Perfiles disponibles</small>
                        </div>
                    </article>

                    <article className="participants-summary-card">
                        <div className="participants-summary-icon">
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <span className="participants-summary-label">
                                Participantes activos
                            </span>
                            <strong>{activeCount}</strong>
                            <small>
                                {Math.round((activeCount / demoParticipants.length) * 100)}% del total
                            </small>
                        </div>
                    </article>

                    <article className="participants-summary-card">
                        <div className="participants-summary-icon">
                            <SlidersHorizontal size={20} />
                        </div>
                        <div>
                            <span className="participants-summary-label">
                                Adherencia promedio
                            </span>
                            <strong>
                                {averageAdherence === null ? '—' : `${averageAdherence}%`}
                            </strong>
                            <small>Usuarios con registros de adherencia</small>
                        </div>
                    </article>
                </section>

                <section className="participants-content">
                    <div className="participants-content-heading">
                        <div>
                            <h2>Directorio de participantes</h2>
                            <p>Busca y filtra perfiles para consultar su seguimiento.</p>
                        </div>
                        <span className="participants-count">
                            {filteredParticipants.length}{' '}
                            {filteredParticipants.length === 1 ? 'participante' : 'participantes'}
                        </span>
                    </div>

                    <div className="participants-filters">
                        <label className="participants-search">
                            <Search size={18} aria-hidden="true" />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Buscar por nombre, correo o código..."
                                aria-label="Buscar participantes"
                            />
                        </label>

                        <label className="participants-select-wrapper">
                            <span>Nivel</span>
                            <select
                                value={level}
                                onChange={(event) => setLevel(event.target.value)}
                                aria-label="Filtrar por nivel"
                            >
                                <option value="Todos">Todos los niveles</option>
                                <option value="Principiante">Principiante</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Avanzado">Avanzado</option>
                            </select>
                        </label>

                        <label className="participants-select-wrapper">
                            <span>Estado</span>
                            <select
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                aria-label="Filtrar por estado"
                            >
                                <option value="Todos">Todos los estados</option>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </label>
                    </div>

                    <div className="participants-table-wrapper">
                        <table className="participants-table">
                            <thead>
                                <tr>
                                    <th>Participante</th>
                                    <th>Nivel</th>
                                    <th>Objetivo</th>
                                    <th>Adherencia semanal</th>
                                    <th>Estado</th>
                                    <th>
                                        <span className="visually-hidden">Acciones</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredParticipants.length > 0 ? (
                                    filteredParticipants.map((participant) => (
                                        <tr key={participant.id}>
                                            <td>
                                                <div className="participant-identity">
                                                    <div className="participant-avatar">
                                                        {participant.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <strong>{participant.name}</strong>
                                                        <span>{participant.email}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>{participant.level}</td>
                                            <td>{participant.goal}</td>
                                            <td>
                                                {participant.adherence === null
                                                    ? '—'
                                                    : `${participant.adherence}%`}
                                            </td>
                                            <td>
                                                <span
                                                    className={`participant-status participant-status--${participant.status.toLowerCase()}`}
                                                >
                                                    {participant.status}
                                                </span>
                                            </td>
                                            <td>
                                                <Link
                                                    className="participant-view-link"
                                                    to={`/dashboard/participants/${encodeURIComponent(participant.id)}`}
                                                    aria-label={`Ver detalle de ${participant.name}`}
                                                >
                                                    Ver detalle<ChevronRight size={15} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="participants-empty">
                                                <div className="participants-empty-icon">
                                                    <Search size={24} />
                                                </div>
                                                <h3>No se encontraron participantes</h3>
                                                <p>
                                                    Prueba cambiando los términos de búsqueda
                                                    o los filtros seleccionados.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <footer className="participants-footer">
                        Directorio de prueba para explorar los perfiles y las funciones
                        de seguimiento del panel.
                    </footer>
                </section>
            </main>
        </DashboardLayout>
    )
}
