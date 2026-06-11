import { useNavigate, useOutletContext } from 'react-router-dom'
import styles from './Dashboard.module.css'

const allCards = {
  member: [
    { emoji: '📝', label: 'Postări', path: '/panou/postari' },
  ],
  bureau: [
    { emoji: '📝', label: 'Postări', path: '/panou/postari' },
    { emoji: '👥', label: 'Membri', path: '/panou/membri' },
    { emoji: '🏢', label: 'Departamente', path: '/panou/departamente' },
    { emoji: '📋', label: 'Cereri Cont', path: '/panou/cereri' },
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

function Dashboard() {
  const navigate = useNavigate()
  const { role } = useOutletContext()
  const cards = allCards[role] || allCards.member

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Panou</h1>
      <div className={styles.grid}>
        {cards.map((card, index) => (
          <div key={index} className={styles.card} onClick={() => navigate(card.path)}>
            <span className={styles.emoji}>{card.emoji}</span>
            <span className={styles.label}>{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard