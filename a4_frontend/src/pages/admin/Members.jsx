import styles from './AdminTable.module.css'
import { useNavigate } from 'react-router-dom'

const members = [
  { id: 1, name: "Bogdan Mladin", faculty: "Arhitectură", email: "bogdan@a4.ro", joinDate: "Oct 2023", left: false },
  { id: 2, name: "Ana Pop", faculty: "Urbanism", email: "ana@a4.ro", joinDate: "Oct 2022", left: false },
  { id: 3, name: "Mihai Dumitrescu", faculty: "Arhitectură", email: "mihai@a4.ro", joinDate: "Mar 2024", left: true },
]

function Members() {
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Membri</h1>
        <button className={styles.btnPrimary} onClick={() => navigate('/panou/membri/nou')}>
          + Membru nou
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nume</th>
            <th>Facultate</th>
            <th>Email</th>
            <th>Data intrării</th>
            <th>Status</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.faculty}</td>
              <td>{member.email}</td>
              <td>{member.joinDate}</td>
              <td>
                <span className={member.left ? styles.badgeHidden : styles.badgeVisible}>
                  {member.left ? 'Plecat' : 'Activ'}
                </span>
              </td>
              <td className={styles.actions}>
                <button className={styles.btnEdit}>Editează</button>
                {!member.left && (
                  <button className={styles.btnDanger}>Marchează ca plecat</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Members