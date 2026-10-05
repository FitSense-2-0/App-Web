import api from './api'

export interface CurrentUser {
    userId: number | string
    email: string
    fullName: string
}

export const userService = {
    async getMe(): Promise<CurrentUser> {
        const { data } = await api.get<CurrentUser>(
            '/users/me',
        )

        if (
            !data ||
            data.userId == null ||
            !data.email ||
            !data.fullName
        ) {
            throw new Error(
                'El servidor devolvió información de usuario incompleta.',
            )
        }

        return data
    },
}