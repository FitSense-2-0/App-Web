// El cliente centraliza las solicitudes HTTP y adjunta el token cuando exista una sesión autenticada.

import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('fitsense_token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default api