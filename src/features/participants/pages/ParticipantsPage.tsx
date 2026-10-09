
import { useMemo, useState } from "react";
import {
    Search,
    Users,
    UserRound,
    UserCheck,
    ChevronRight,
    SlidersHorizontal,
    Info,
} from "lucide-react";
import "./ParticipantsPage.css";
import DashboardLayout from "../../../components/layout/DashboardLayout";

type ParticipantLevel = "Principiante" | "Intermedio" | "Avanzado";
type ParticipantStatus = "Activo" | "Inactivo";

interface Participant {
    id: string;
    name: string;
    email: string;
    level: ParticipantLevel;
    goal: string;
    adherence: number | null;
    status: ParticipantStatus;
}

// La colección empieza vacía: no se muestran participantes ficticios.
const participants: Participant[] = [];

export default function ParticipantsPage() {
    const [search, setSearch] = useState("");
    const [level, setLevel] = useState("Todos");
    const [status, setStatus] = useState("Todos");

    const filteredParticipants = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return participants.filter((participant) => {
            const matchesSearch =
                !normalizedSearch ||
                participant.name.toLowerCase().includes(normalizedSearch) ||
                participant.email.toLowerCase().includes(normalizedSearch) ||
                participant.id.toLowerCase().includes(normalizedSearch);

            const matchesLevel =
                level === "Todos" || participant.level === level;

            const matchesStatus =
                status === "Todos" || participant.status === status;

            return matchesSearch && matchesLevel && matchesStatus;
        });
    }, [search, level, status]);

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

                <section
                    className="participants-summary"
                    aria-label="Resumen de participantes"
                >
                    <article className="participants-summary-card">
                        <div className="participants-summary-icon">
                            <Users size={20} />
                        </div>

                        <div>
                            <span className="participants-summary-label">
                                Participantes registrados
                            </span>
                            <strong>—</strong>
                            <small>Pendiente de integración</small>
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
                            <strong>—</strong>
                            <small>Pendiente de integración</small>
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
                            <strong>—</strong>
                            <small>Sin datos disponibles</small>
                        </div>
                    </article>
                </section>

                <section className="participants-content">
                    <div className="participants-content-heading">
                        <div>
                            <h2>Directorio de participantes</h2>
                            <p>Busca y filtra los perfiles disponibles.</p>
                        </div>

                        <span className="participants-count">
                            {filteredParticipants.length} participantes
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
                                        <span className="visually-hidden">
                                            Acciones
                                        </span>
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
                                                    ? "—"
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
                                                <a
                                                    className="participant-view-link"
                                                    href={`/dashboard/participants/${encodeURIComponent(participant.id)}`}
                                                    aria-label={`Ver participante ${participant.name}`}
                                                >
                                                    Ver perfil <ChevronRight size={15} />
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="participants-empty">
                                                <div className="participants-empty-icon">
                                                    {search || level !== "Todos" || status !== "Todos" ? (
                                                        <Search size={24} />
                                                    ) : (
                                                        <Users size={25} />
                                                    )}
                                                </div>

                                                <h3>
                                                    {search || level !== "Todos" || status !== "Todos"
                                                        ? "No se encontraron participantes"
                                                        : "Aún no hay participantes para mostrar"}
                                                </h3>

                                                <p>
                                                    {search || level !== "Todos" || status !== "Todos"
                                                        ? "Prueba cambiando los términos de búsqueda o los filtros."
                                                        : "El directorio se completará cuando se integre el servicio de consulta de participantes."}
                                                </p>

                                                {!search && level === "Todos" && status === "Todos" && (
                                                    <div className="participants-pending-note">
                                                        <Info size={15} />
                                                        <span>
                                                            La pantalla está preparada para la integración
                                                            con el backend.
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <footer className="participants-footer">
                        <span>
                            Los datos reales aparecerán cuando esté disponible el servicio
                            administrativo.
                        </span>
                    </footer>
                </section>
            </main>
        </DashboardLayout>
    );
}