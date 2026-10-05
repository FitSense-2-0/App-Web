import api from './api'

export interface Intervention {
    interventionId: number | string
    sourcePlanId: number | string | null
    resultingPlanId: number | string | null
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
        const { data } = await api.get<Intervention[]>(
            '/users/me/interventions',
        )

        if (!Array.isArray(data)) {
            throw new Error(
                'El servidor no devolvió un historial válido.',
            )
        }

        return data
    },
}