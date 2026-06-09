import { useNavigate } from 'react-router-dom'
import styles from './AdminTable.module.css'

const posts = [
  { id: 1, title: "Workshop de Design Urban", author: "Bogdan M.", date: "12 Mai 2024", hidden: false },
  { id: 2, title: "Excursie la Viena", author: "Ana P.", date: "3 Apr 2024", hidden: true },
  { id: 3, title: "Concurs Studențesc", author: "Mihai D.", date: "20 Mar 2024", hidden: false },
]

function Posts() {
  const navigate = useNavigate()

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Postări</h1>
        <button className={styles.btnPrimary} onClick={() => navigate('/panou/postari/nou')}>
          + Postare nouă
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Titlu</th>
            <th>Autor</th>
            <th>Dată</th>
            <th>Status</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.author}</td>
              <td>{post.date}</td>
              <td>
                <span className={post.hidden ? styles.badgeHidden : styles.badgeVisible}>
                  {post.hidden ? 'Ascuns' : 'Vizibil'}
                </span>
              </td>
              <td className={styles.actions}>
                <button className={styles.btnEdit}>Editează</button>
                <button className={styles.btnSecondary}>{post.hidden ? 'Afișează' : 'Ascunde'}</button>
                <button className={styles.btnDanger}>Șterge</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Posts