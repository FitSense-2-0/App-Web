export type ParticipantLevel = 'Principiante' | 'Intermedio' | 'Avanzado'
export type ParticipantStatus = 'Activo' | 'Inactivo'

export interface Participant {
    id: string
    name: string
    email: string
    level: ParticipantLevel
    goal: string
    adherence: number | null
    status: ParticipantStatus
    completedWorkouts: number
    scheduledWorkouts: number
    trainingMinutes: number
    plannedVolume: number
    executedVolume: number
    consecutiveSkips: number
    riskLevel: 'Bajo' | 'Medio' | 'Alto'
    lastWorkout: string
    interventions: {
        id: string
        date: string
        type: string
        reason: string
        previousAdherence: number
        resultingVolume: number
    }[]
    weeklyHistory: {
        week: string
        adherence: number
        completedWorkouts: number
        scheduledWorkouts: number
    }[]
}

export const demoParticipants: Participant[] = [
    {
        id: 'USR-001',
        name: 'Valeria Mendoza',
        email: 'valeria.mendoza@gmail.com',
        level: 'Principiante',
        goal: 'Mejorar condición física',
        adherence: 86,
        status: 'Activo',
        completedWorkouts: 4,
        scheduledWorkouts: 5,
        trainingMinutes: 165,
        plannedVolume: 4200,
        executedVolume: 3610,
        consecutiveSkips: 0,
        riskLevel: 'Bajo',
        lastWorkout: '2026-10-08',
        interventions: [
            {
                id: 'INT-001',
                date: '2026-10-05',
                type: 'Reducción de volumen',
                reason: 'Disminución de adherencia',
                previousAdherence: 68,
                resultingVolume: 3600,
            },
        ],
        weeklyHistory: [
            { week: '2026-09-17', adherence: 62, completedWorkouts: 3, scheduledWorkouts: 5 },
            { week: '2026-09-24', adherence: 68, completedWorkouts: 3, scheduledWorkouts: 5 },
            { week: '2026-10-01', adherence: 78, completedWorkouts: 4, scheduledWorkouts: 5 },
            { week: '2026-10-08', adherence: 86, completedWorkouts: 4, scheduledWorkouts: 5 },
        ],
    },
    {
        id: 'USR-002',
        name: 'Sebastián Torres',
        email: 'sebastian.torres@gmail.com',
        level: 'Intermedio',
        goal: 'Aumentar fuerza muscular',
        adherence: 94,
        status: 'Activo',
        completedWorkouts: 5,
        scheduledWorkouts: 5,
        trainingMinutes: 240,
        plannedVolume: 6800,
        executedVolume: 6520,
        consecutiveSkips: 0,
        riskLevel: 'Bajo',
        lastWorkout: '2026-10-09',
        interventions: [],
        weeklyHistory: [
            { week: '2026-09-18', adherence: 78, completedWorkouts: 4, scheduledWorkouts: 5 },
            { week: '2026-09-25', adherence: 84, completedWorkouts: 4, scheduledWorkouts: 5 },
            { week: '2026-10-02', adherence: 90, completedWorkouts: 5, scheduledWorkouts: 5 },
            { week: '2026-10-09', adherence: 94, completedWorkouts: 5, scheduledWorkouts: 5 },
        ],
    },
    {
        id: 'USR-003',
        name: 'Camila Rojas',
        email: 'camila.rojas@gmail.com',
        level: 'Principiante',
        goal: 'Crear hábito de ejercicio',
        adherence: 48,
        status: 'Activo',
        completedWorkouts: 2,
        scheduledWorkouts: 5,
        trainingMinutes: 55,
        plannedVolume: 3000,
        executedVolume: 1420,
        consecutiveSkips: 2,
        riskLevel: 'Alto',
        lastWorkout: '2026-10-03',
        interventions: [
            {
                id: 'INT-003',
                date: '2026-10-05',
                type: 'Ajuste de frecuencia',
                reason: 'Entrenamientos omitidos',
                previousAdherence: 48,
                resultingVolume: 2400,
            },
        ],
        weeklyHistory: [
            { week: '2026-09-12', adherence: 76, completedWorkouts: 4, scheduledWorkouts: 5 },
            { week: '2026-09-19', adherence: 65, completedWorkouts: 3, scheduledWorkouts: 5 },
            { week: '2026-09-26', adherence: 54, completedWorkouts: 3, scheduledWorkouts: 5 },
            { week: '2026-10-03', adherence: 48, completedWorkouts: 2, scheduledWorkouts: 5 },
        ],
    },
    {
        id: 'USR-004',
        name: 'Andrés Castillo',
        email: 'andres.castillo@gmail.com',
        level: 'Avanzado',
        goal: 'Mejorar resistencia',
        adherence: 73,
        status: 'Activo',
        completedWorkouts: 4,
        scheduledWorkouts: 5,
        trainingMinutes: 195,
        plannedVolume: 7500,
        executedVolume: 5810,
        consecutiveSkips: 1,
        riskLevel: 'Medio',
        lastWorkout: '2026-10-07',
        interventions: [
            {
                id: 'INT-004',
                date: '2026-10-06',
                type: 'Ajuste de duración',
                reason: 'Cumplimiento irregular',
                previousAdherence: 65,
                resultingVolume: 6000,
            },
        ],
        weeklyHistory: [
            { week: '2026-09-16', adherence: 82, completedWorkouts: 4, scheduledWorkouts: 5 },
            { week: '2026-09-23', adherence: 79, completedWorkouts: 4, scheduledWorkouts: 5 },
            { week: '2026-09-30', adherence: 65, completedWorkouts: 3, scheduledWorkouts: 5 },
            { week: '2026-10-07', adherence: 73, completedWorkouts: 4, scheduledWorkouts: 5 },
        ],
    },
    {
        id: 'USR-005',
        name: 'Luciana Paredes',
        email: 'luciana.paredes@gmail.com',
        level: 'Intermedio',
        goal: 'Mejorar composición corporal',
        adherence: 89,
        status: 'Activo',
        completedWorkouts: 4,
        scheduledWorkouts: 4,
        trainingMinutes: 180,
        plannedVolume: 5100,
        executedVolume: 4920,
        consecutiveSkips: 0,
        riskLevel: 'Bajo',
        lastWorkout: '2026-10-08',
        interventions: [],
        weeklyHistory: [
            { week: '2026-09-17', adherence: 72, completedWorkouts: 3, scheduledWorkouts: 4 },
            { week: '2026-09-24', adherence: 80, completedWorkouts: 3, scheduledWorkouts: 4 },
            { week: '2026-10-01', adherence: 85, completedWorkouts: 4, scheduledWorkouts: 4 },
            { week: '2026-10-08', adherence: 89, completedWorkouts: 4, scheduledWorkouts: 4 },
        ],
    },
    {
        id: 'USR-006',
        name: 'Diego Salazar',
        email: 'diego.salazar@gmail.com',
        level: 'Principiante',
        goal: 'Aumentar actividad diaria',
        adherence: null,
        status: 'Inactivo',
        completedWorkouts: 0,
        scheduledWorkouts: 4,
        trainingMinutes: 0,
        plannedVolume: 2800,
        executedVolume: 0,
        consecutiveSkips: 4,
        riskLevel: 'Alto',
        lastWorkout: '2026-09-20',
        interventions: [
            {
                id: 'INT-006',
                date: '2026-09-21',
                type: 'Ajuste de frecuencia',
                reason: 'Inactividad prolongada',
                previousAdherence: 35,
                resultingVolume: 1800,
            },
        ],
        weeklyHistory: [
            { week: '2026-09-06', adherence: 60, completedWorkouts: 3, scheduledWorkouts: 4 },
            { week: '2026-09-13', adherence: 45, completedWorkouts: 2, scheduledWorkouts: 4 },
            { week: '2026-09-20', adherence: 35, completedWorkouts: 1, scheduledWorkouts: 4 },
        ],
    },
    {
        id: 'USR-007',
        name: 'Mariana Vega',
        email: 'mariana.vega@gmail.com',
        level: 'Avanzado',
        goal: 'Mejorar rendimiento deportivo',
        adherence: 97,
        status: 'Activo',
        completedWorkouts: 5,
        scheduledWorkouts: 5,
        trainingMinutes: 275,
        plannedVolume: 8200,
        executedVolume: 8050,
        consecutiveSkips: 0,
        riskLevel: 'Bajo',
        lastWorkout: '2026-10-09',
        interventions: [],
        weeklyHistory: [
            { week: '2026-09-18', adherence: 88, completedWorkouts: 4, scheduledWorkouts: 5 },
            { week: '2026-09-25', adherence: 91, completedWorkouts: 5, scheduledWorkouts: 5 },
            { week: '2026-10-02', adherence: 95, completedWorkouts: 5, scheduledWorkouts: 5 },
            { week: '2026-10-09', adherence: 97, completedWorkouts: 5, scheduledWorkouts: 5 },
        ],
    },
    {
        id: 'USR-008',
        name: 'Gabriel Núñez',
        email: 'gabriel.nunez@example.com',
        level: 'Intermedio',
        goal: 'Mantener constancia',
        adherence: 61,
        status: 'Inactivo',
        completedWorkouts: 2,
        scheduledWorkouts: 4,
        trainingMinutes: 70,
        plannedVolume: 4300,
        executedVolume: 2200,
        consecutiveSkips: 3,
        riskLevel: 'Alto',
        lastWorkout: '2026-10-01',
        interventions: [],
        weeklyHistory: [
            { week: '2026-09-17', adherence: 78, completedWorkouts: 3, scheduledWorkouts: 4 },
            { week: '2026-09-24', adherence: 70, completedWorkouts: 3, scheduledWorkouts: 4 },
            { week: '2026-10-01', adherence: 61, completedWorkouts: 2, scheduledWorkouts: 4 },
        ],
    },
]
