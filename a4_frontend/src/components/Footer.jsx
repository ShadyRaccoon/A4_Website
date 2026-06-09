import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.logo}>A4</span>
          <p>Asociația Studenților din Facultatea de Arhitectură și Urbanism</p>
        </div>
        <div className={styles.column}>
          <h4>Despre</h4>
          <Link to="/about">Despre noi</Link>
          <Link to="/departments">Departamente</Link>
          <Link to="/articles">Articole</Link>
        </div>
        <div className={styles.column}>
          <h4>Contact</h4>
          <a href="mailto:contact@a4.ro">contact@a4.ro</a>
          <a href="tel:+40700000000">+40 700 000 000</a>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} A4. Toate drepturile rezervate.</span>
      </div>
    </footer>
  )
}

export default Footer