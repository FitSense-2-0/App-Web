
import axios, { AxiosError } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim()

if (!baseURL) {
    throw new Error(
        'Falta configurar VITE_API_BASE_URL en el archivo de entorno.',
    )
}

const api = axios.create({
    baseURL: baseURL.replace(/\/+$/, ''),
    timeout: 20_000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; detail?: string }>) => {
        return Promise.reject(error)
    },
)

export function getApiErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        if (!error.response) {
            return 'No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo nuevamente.'
        }

        const status = error.response.status
        const data = error.response.data as
            | { message?: string; detail?: string }
            | undefined

        if (status === 400) {
            return data?.message ?? data?.detail ??
                'La solicitud contiene datos incorrectos.'
        }

        if (status === 401) {
            return 'La solicitud requiere credenciales válidas para acceder al servicio.'
        }

        if (status === 403) {
            return 'No tienes permisos para realizar esta operación.'
        }

        if (status === 404) {
            return 'No se encontró el recurso solicitado.'
        }

        if (status === 429) {
            return 'Se realizaron demasiadas solicitudes. Inténtalo más tarde.'
        }

        if (status >= 500) {
            return 'El servidor presenta un problema. Inténtalo más tarde.'
        }

        return data?.message ?? data?.detail ??
            'No se pudo completar la solicitud.'
    }

    return 'Ocurrió un error inesperado.'
}

export default api