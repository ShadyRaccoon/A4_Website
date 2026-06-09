import styles from './Hero.module.css'
import heroImg from '../assets/hero.png'

function Hero() {
  return (
    <section className={styles.hero}>
      <img src={heroImg} alt="A4 hero" className={styles.bg} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1>A4</h1>
        <p>Asociația Studenților din Facultatea de Arhitectură și Urbanism</p>
      </div>
    </section>
  )
}

export default Hero