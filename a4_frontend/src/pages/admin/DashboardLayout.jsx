import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import styles from './DashboardLayout.module.css'

function DashboardLayout() {
  const { user } = useAuth()
  const role = user?.role?.toLowerCase() ?? 'member'

  return (
    <div className={styles.layout}>
      <Sidebar role={role} />
      <main className={styles.content}>
        <Outlet context={{ role }} />
      </main>
    </div>
  )
}

export default DashboardLayout