import { Link } from 'react-router-dom'
import { useState } from 'react'
import styles from './Navbar.module.css'

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>A4</Link>
      
      <button className={styles.burger} onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`${styles.links} ${open ? styles.open : ''}`}>
        <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
        <li><Link to="/articles" onClick={() => setOpen(false)}>Articles</Link></li>
        <li><Link to="/departments" onClick={() => setOpen(false)}>Departments</Link></li>
        <li><Link to="/contacts" onClick={() => setOpen(false)}>Contacts</Link></li>
        <li><Link to="/about" onClick={() => setOpen(false)}>About</Link></li>
        <li><Link to="/panou">Panou</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar