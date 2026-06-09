import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const sidebarItems = {
  member: [
    { emoji: '📝', label: 'Postări', path: '/panou/postari' },
  ],
  bureau: [
    { emoji: '📝', label: 'Postări', path: '/panou/postari' },
    { emoji: '👥', label: 'Membri', path: '/panou/membri' },
    { emoji: '🏢', label: 'Departamente', path: '/panou/departamente' },
  ],
  admin: [
    { emoji: '📝', label: 'Postări', path: '/panou/postari' },
    { emoji: '👥', label: 'Membri', path: '/panou/membri' },
    { emoji: '🏢', label: 'Departamente', path: '/panou/departamente' },
    { emoji: '🔐', label: 'Conturi', path: '/panou/conturi' },
    { emoji: '📋', label: 'Cereri Cont', path: '/panou/cereri' },
    { emoji: '📱', label: 'Dispozitive', path: '/panou/dispozitive' },
  ]
}

function Sidebar({ role = 'admin' }) {
  const [open, setOpen] = useState(true)
  const items = sidebarItems[role] || sidebarItems.member

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : styles.closed}`}>
      <button className={styles.toggle} onClick={() => setOpen(!open)}>
        {open ? '◀' : '▶'}
      </button>
      <nav className={styles.nav}>
        {items.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.emoji}>{item.emoji}</span>
            {open && <span className={styles.label}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar