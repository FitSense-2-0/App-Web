
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function ProtectedRoute() {
    const location = useLocation()

    const hasLocalSession =
        localStorage.getItem('kora_local_session') === 'true'

    if (!hasLocalSession) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        )
    }

    return <Outlet />
}