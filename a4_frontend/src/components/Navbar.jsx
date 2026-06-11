import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

function isDeviceRegistered() {
  return document.cookie.split(';').some(c => c.trim().startsWith('DeviceId='))
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const deviceRegistered = isDeviceRegistered()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
    setOpen(false)
  }

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.logo}>A4</NavLink>

      <button className={styles.burger} onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`${styles.links} ${open ? styles.open : ''}`}>
        <li><NavLink to="/" end className={({ isActive }) => isActive ? styles.activeLink : ''} onClick={() => setOpen(false)}>Home</NavLink></li>
        <li><NavLink to="/articles" className={({ isActive }) => isActive ? styles.activeLink : ''} onClick={() => setOpen(false)}>Articles</NavLink></li>
        <li><NavLink to="/departments" className={({ isActive }) => isActive ? styles.activeLink : ''} onClick={() => setOpen(false)}>Departments</NavLink></li>
        <li><NavLink to="/contacts" className={({ isActive }) => isActive ? styles.activeLink : ''} onClick={() => setOpen(false)}>Contacts</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) => isActive ? styles.activeLink : ''} onClick={() => setOpen(false)}>About</NavLink></li>
        {deviceRegistered && token && (
          <li><NavLink to="/panou" className={({ isActive }) => isActive ? styles.activeLink : ''} onClick={() => setOpen(false)}>Panou</NavLink></li>
        )}
        {deviceRegistered && (
          token
            ? <li><button className={styles.authBtn} onClick={handleLogout}>Logout</button></li>
            : <li><NavLink to="/admin/login" className={({ isActive }) => isActive ? styles.activeLink : ''} onClick={() => setOpen(false)}>Login</NavLink></li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar