import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/api'
import styles from './AdminTable.module.css'

const PAGE_SIZE = 15

function Accounts() {
  const { token } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => { setPage(1) }, [debouncedSearch])

  useEffect(() => {
    api.getAccounts(token)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => {
          if (a.isActive && !b.isActive) return -1
          if (!a.isActive && b.isActive) return 1
          return new Date(b.createdAt) - new Date(a.createdAt)
        })
        setAccounts(sorted)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [token])

  const handleToggleActive = async (id) => {
    if (!confirm('Ești sigur?')) return
    try {
      const res = await api.toggleAccountActive(token, id)
      if (!res.ok) { alert('Eroare.'); return }
      setAccounts(prev => {
        const updated = prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a)
        return updated.sort((a, b) => {
          if (a.isActive && !b.isActive) return -1
          if (!a.isActive && b.isActive) return 1
          return new Date(b.createdAt) - new Date(a.createdAt)
        })
      })
    } catch (err) {
      alert('Eroare: ' + err.message)
    }
  }

  const filtered = accounts.filter(a => {
    const q = debouncedSearch.toLowerCase()
    return (
      a.email.toLowerCase().includes(q) ||
      a.userName.toLowerCase().includes(q) ||
      (a.memberName && a.memberName.toLowerCase().includes(q))
    )
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (loading) return <div className={styles.loading}>Se încarcă...</div>

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Conturi</h1>
      </div>

      <div className={styles.formField} style={{ maxWidth: 360, marginBottom: '1.5rem' }}>
        <input
          placeholder="Caută după email, username sau nume..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Membru</th>
            <th>Rol</th>
            <th>Status</th>
            <th>Creat</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(account => (
            <tr key={account.id}>
              <td>{account.email}</td>
              <td>{account.userName}</td>
              <td>{account.memberName ?? '—'}</td>
              <td>{account.role}</td>
              <td>
                <span className={account.isActive ? styles.badgeVisible : styles.badgeHidden}>
                  {account.isActive ? 'Activ' : 'Inactiv'}
                </span>
              </td>
              <td>{new Date(account.createdAt).toLocaleDateString('ro-RO')}</td>
              <td className={styles.actions}>
                <button
                  className={account.isActive ? styles.btnDanger : styles.btnEdit}
                  onClick={() => handleToggleActive(account.id)}
                >
                  {account.isActive ? 'Dezactivează' : 'Activează'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', alignItems: 'center' }}>
          <button className={styles.btnEdit} onClick={() => setPage(p => p - 1)} disabled={page === 1}>←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} className={p === page ? styles.btnPrimary : styles.btnEdit} onClick={() => setPage(p)}>
              {p}
            </button>
          ))}
          <button className={styles.btnEdit} onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>→</button>
        </div>
      )}
    </div>
  )
}

export default Accounts