// Son las consultas de métricas semanales existentes

import api from './api'

export interface WeeklyMetrics {
    weeklyMetricId: string
    planId: string
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
        const response = await api.get<WeeklyMetrics[]>(
            '/users/me/metrics/weekly',
        )

        return response.data
    },

    async getWeek(weekStartDate: string): Promise<WeeklyMetrics> {
        const response = await api.get<WeeklyMetrics>(
            `/users/me/metrics/weekly/${weekStartDate}`,
        )

        return response.data
    },
}