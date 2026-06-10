import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/api'
import styles from './AdminTable.module.css'

function Members() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getMembers(token)
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [token])

  const handleMarkLeft = async (id) => {
    if (!confirm('Ești sigur?')) return
    try {
      await api.markMemberLeft(token, id)
      setMembers(members.map(m => m.memberId === id ? { ...m, leaveDate: 'left' } : m))
    } catch (err) {
      alert('Eroare: ' + err.message)
    }
  }

  if (loading) return <div className={styles.loading}>Se încarcă...</div>

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
            <tr key={member.memberId}>
              <td>{member.firstName} {member.lastName}</td>
              <td>{member.faculty}</td>
              <td>{member.email}</td>
              <td>{member.joinDate}</td>
              <td>
                <span className={member.leaveDate ? styles.badgeHidden : styles.badgeVisible}>
                  {member.leaveDate ? 'Plecat' : 'Activ'}
                </span>
              </td>
              <td className={styles.actions}>
                <button className={styles.btnEdit}>Editează</button>
                {!member.leaveDate && (
                  <button className={styles.btnDanger} onClick={() => handleMarkLeft(member.memberId)}>
                    Marchează ca plecat
                  </button>
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