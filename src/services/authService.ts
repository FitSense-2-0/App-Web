// Este servicio presupone que el backend acepta email y password y devuelve los campos indicados.

import api from './api'

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthenticatedUser {
    userId: string
    email: string
    fullName: string
    token: string
}

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthenticatedUser> {
        const response = await api.post<AuthenticatedUser>(
            '/auth/login',
            credentials,
        )

        return response.data
    },
}