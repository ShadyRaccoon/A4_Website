import styles from './Achievements.module.css'

const stats = [
  { value: "9999+", label: "Studenți Reprezentați" },
  { value: "9999+", label: "Membri" },
  { value: "9999+", label: "Ani de Activitate" }
]

function Achievements() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.card}>
            <span className={styles.value}>{stat.value}</span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Achievements