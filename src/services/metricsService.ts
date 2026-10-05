import api from './api'

export interface WeeklyMetrics {
    weeklyMetricId: number | string
    planId: number | string
    weekNumber: number
    weekStartDate: string
    weekEndDate: string
    hasActivePlan: boolean
    scheduledWorkouts: number
    validWorkouts: number
    completedWorkouts: number
    skippedWorkouts: number
    assignedExercises: number
    completedExercises: number
    weightedAdherencePct: number
    frequencyAdherencePct: number
    workoutAdherencePct: number
    exerciseAdherencePct: number
    plannedWeekVolume: number
    executedVolume: number
    totalTrainingMinutes: number
    averageSessionRpe: number | null
    averageSatisfaction: number | null
    consecutiveSkips: number
    daysSinceLastWorkout: number
    dominantSkipReason: string | null
    riskScore: number
    riskLevel: string
    dropout: boolean
    calculationVersion: string
    calculatedAt: string
}

export const metricsService = {
    async getWeeklyHistory(): Promise<WeeklyMetrics[]> {
        const { data } = await api.get<WeeklyMetrics[]>(
            '/users/me/metrics/weekly',
        )

        if (!Array.isArray(data)) {
            throw new Error(
                'El servidor no devolvió una lista válida de métricas.',
            )
        }

        return data
    },

    async getWeek(
        weekStartDate: string,
    ): Promise<WeeklyMetrics> {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStartDate)) {
            throw new Error(
                'La fecha debe tener el formato YYYY-MM-DD.',
            )
        }

        const { data } = await api.get<WeeklyMetrics>(
            `/users/me/metrics/weekly/${weekStartDate}`,
        )

        return data
    },
}
