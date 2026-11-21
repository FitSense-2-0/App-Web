import api from './api'

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthenticatedUser {
    userId: number | string
    email: string
    fullName: string
    token: string
}

const TOKEN_KEY = 'kora_token'
const USER_KEY = 'kora_user'

export const authService = {
    async login(
        credentials: LoginRequest,
    ): Promise<AuthenticatedUser> {
        const email = credentials.email.trim().toLowerCase()

        const { data } = await api.post<AuthenticatedUser>(
            '/auth/login',
            {
                email,
                password: credentials.password,
            },
        )

        if (
            !data ||
            !data.token ||
            !data.email ||
            !data.fullName ||
            data.userId == null
        ) {
            throw new Error(
                'La respuesta de autenticación no tiene el formato esperado.',
            )
        }

        const user: AuthenticatedUser = {
            userId: data.userId,
            email: data.email,
            fullName: data.fullName,
            token: data.token,
        }

        localStorage.setItem(TOKEN_KEY, user.token)

        localStorage.setItem(
            USER_KEY,
            JSON.stringify({
                userId: user.userId,
                email: user.email,
                fullName: user.fullName,
            }),
        )

        return user
    },


    getToken(): string | null {
        return localStorage.getItem('kora_token')
    },

    isAuthenticated(): boolean {
        return Boolean(this.getToken())
    },

    logout(): void {
        localStorage.removeItem('kora_token')
        localStorage.removeItem('kora_user')
    },

    getCachedUser(): Omit<AuthenticatedUser, 'token'> | null {
        const value = localStorage.getItem(USER_KEY)

        if (!value) return null

        try {
            return JSON.parse(value) as Omit<
                AuthenticatedUser,
                'token'
            >
        } catch {
            localStorage.removeItem(USER_KEY)
            return null
        }
    },
}