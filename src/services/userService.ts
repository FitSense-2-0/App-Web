
import api from './api'

export interface CurrentUser {
    userId: string
    email: string
    fullName: string
}

export const userService = {
    async getMe(): Promise<CurrentUser> {
        const response = await api.get<CurrentUser>('/users/me')
        return response.data
    },
}
