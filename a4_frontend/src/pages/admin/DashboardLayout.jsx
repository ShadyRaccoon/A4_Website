import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import styles from './DashboardLayout.module.css'

function DashboardLayout({ role }) {
  return (
    <div className={styles.layout}>
      <Sidebar role={role} />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout