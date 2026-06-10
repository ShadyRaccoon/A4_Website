import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, requiredRole }) {
  const { token, user } = useAuth()

  if (!token) return <Navigate to="/admin/login" />

  if (requiredRole && user?.role !== requiredRole)
    return <Navigate to="/panou" />

  return children
}

export default ProtectedRoute