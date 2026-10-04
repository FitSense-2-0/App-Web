import api from './api'

export interface Intervention {
    interventionId: string
    sourcePlanId: string
    resultingPlanId: string
    triggerAdherencePct: number | null
    triggerSkipReason: string | null
    adjustmentTypes: string[]
    targetVolumeChangePct: number | null
    previousWeekVolume: number | null
    resultingWeekVolume: number | null
    actualVolumeChangePct: number | null
    daysChange: number | null
    difficultyChange: number | null
    durationChangePct: number | null
    loadChangePct: number | null
    messageShown: string | null
    ruleVersion: string
    appliedAt: string
    adherenceAfterPct: number | null
    outcome: string | null
}

export const interventionsService = {
    async getHistory(): Promise<Intervention[]> {
        const response = await api.get<Intervention[]>(
            '/users/me/interventions',
        )

        return response.data
    },
}