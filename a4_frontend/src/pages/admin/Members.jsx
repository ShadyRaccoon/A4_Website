import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/api'
import styles from './AdminTable.module.css'

const PAGE_SIZE = 15

function Members() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    api.getMembers(token)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => {
          // active before left
          if (!a.leaveDate && b.leaveDate) return -1
          if (a.leaveDate && !b.leaveDate) return 1
          // within same group, most recent join date first
          return new Date(b.joinDate) - new Date(a.joinDate)
        })
        setMembers(sorted)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [token])

  const handleMarkLeft = async (id) => {
    if (!confirm('Ești sigur?')) return
    try {
      const res = await api.markMemberLeft(token, id)
      if (!res.ok) { alert('Eroare.'); return }
      setMembers(prev => {
        const updated = prev.map(m => m.memberId === id ? { ...m, leaveDate: new Date().toISOString() } : m)
        return updated.sort((a, b) => {
          if (!a.leaveDate && b.leaveDate) return -1
          if (a.leaveDate && !b.leaveDate) return 1
          return new Date(b.joinDate) - new Date(a.joinDate)
        })
      })
    } catch (err) {
      alert('Eroare: ' + err.message)
    }
  }

  const filtered = members.filter(m => {
    const q = search.toLowerCase()
    return (
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.faculty.toLowerCase().includes(q)
    )
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // reset to page 1 when search changes
  useEffect(() => { setPage(1) }, [search])

  if (loading) return <div className={styles.loading}>Se încarcă...</div>

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Membri</h1>
        <button className={styles.btnPrimary} onClick={() => navigate('/panou/membri/nou')}>
          + Membru nou
        </button>
      </div>

      <div className={styles.formField} style={{ maxWidth: 360, marginBottom: '1.5rem' }}>
        <input
          placeholder="Caută după nume, email, facultate..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
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
          {paginated.map(member => (
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
                <button className={styles.btnEdit} onClick={() => navigate(`/panou/membri/editeaza/${member.memberId}`)}>
                  Editează
                </button>
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

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', alignItems: 'center' }}>
          <button
            className={styles.btnEdit}
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={p === page ? styles.btnPrimary : styles.btnEdit}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className={styles.btnEdit}
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

export default Members