import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './AdminTable.module.css'

const PAGE_SIZE = 15

function DepartmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [department, setDepartment] = useState(null)
  const [members, setMembers] = useState([])
  const [availableMembers, setAvailableMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [addSearch, setAddSearch] = useState('')

  const BASE_URL = 'http://localhost:5242/api'
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/department/${id}`, { headers }).then(res => res.json()),
      fetch(`${BASE_URL}/department/${id}/members`, { headers }).then(res => res.json()),
      fetch(`${BASE_URL}/department/${id}/available-members`, { headers }).then(res => res.json()),
    ])
      .then(([dept, memberList, available]) => {
        setDepartment(dept)
        setMembers(sortMembers(memberList))
        setAvailableMembers(available)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id, token])

  const sortMembers = (list) => list.sort((a, b) => {
    if (!a.leaveDate && b.leaveDate) return -1
    if (a.leaveDate && !b.leaveDate) return 1
    return new Date(b.joinDate) - new Date(a.joinDate)
  })

  const handleAdd = async () => {
    if (!selectedMemberId) return
    try {
      const res = await fetch(`${BASE_URL}/department/${id}/members`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ memberId: parseInt(selectedMemberId) })
      })
      if (!res.ok) { alert('Eroare la adăugare.'); return }
      const newMember = await res.json()
      setMembers(prev => sortMembers([...prev, newMember]))
      setAvailableMembers(prev => prev.filter(m => m.memberId !== parseInt(selectedMemberId)))
      setSelectedMemberId('')
      setAddSearch('')
      setShowAdd(false)
    } catch (err) {
      alert('Eroare: ' + err.message)
    }
  }

  const handleRemove = async (memberId) => {
    if (!confirm('Ești sigur?')) return
    try {
      const res = await fetch(`${BASE_URL}/department/${id}/members/${memberId}`, {
        method: 'DELETE',
        headers
      })
      if (!res.ok) { alert('Eroare la eliminare.'); return }
      const removed = members.find(m => m.memberId === memberId)
      setMembers(prev => prev.filter(m => m.memberId !== memberId))
      if (removed && !removed.leaveDate) {
        setAvailableMembers(prev => [...prev, removed])
      }
    } catch (err) {
      alert('Eroare: ' + err.message)
    }
  }

  const filtered = members.filter(m => {
    const q = debouncedSearch.toLowerCase()
    return (
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q)
    )
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [debouncedSearch])

  if (loading) return <div className={styles.loading}>Se încarcă...</div>

  return (
    <div>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className={styles.btnEdit} onClick={() => navigate('/panou/departamente')}>
            ← Înapoi
          </button>
          <h1 className={styles.title}>{department?.name}</h1>
          <span style={{ fontFamily: 'var(--font-meta)', fontSize: '0.85rem', opacity: 0.5 }}>
            {department?.alias}
          </span>
        </div>
        <button className={styles.btnPrimary} onClick={() => setShowAdd(!showAdd)}>
          + Adaugă membru
        </button>
      </div>

      {showAdd && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Adaugă membru în departament</h2>
          <div className={styles.formField}>
            <label>Caută membru</label>
            <input
              placeholder="Caută după nume sau email..."
              value={addSearch}
              onChange={e => { setAddSearch(e.target.value); setSelectedMemberId('') }}
            />
            {addSearch && !selectedMemberId && (
              <div style={{
                border: '1px solid rgba(26,26,26,0.1)',
                borderRadius: '4px',
                marginTop: '0.25rem',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {availableMembers.filter(m => {
                  const q = addSearch.toLowerCase()
                  return (
                    m.firstName.toLowerCase().includes(q) ||
                    m.lastName.toLowerCase().includes(q) ||
                    m.email.toLowerCase().includes(q)
                  )
                }).length === 0 ? (
                  <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem', opacity: 0.5 }}>
                    Niciun rezultat
                  </div>
                ) : availableMembers
                    .filter(m => {
                      const q = addSearch.toLowerCase()
                      return (
                        m.firstName.toLowerCase().includes(q) ||
                        m.lastName.toLowerCase().includes(q) ||
                        m.email.toLowerCase().includes(q)
                      )
                    })
                    .map(m => (
                      <div
                        key={m.memberId}
                        onClick={() => { setSelectedMemberId(m.memberId); setAddSearch(`${m.firstName} ${m.lastName}`) }}
                        style={{
                          padding: '0.75rem 1rem',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid rgba(26,26,26,0.06)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(26,26,26,0.04)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {m.firstName} {m.lastName}
                        <span style={{ opacity: 0.5, marginLeft: '0.5rem', fontSize: '0.8rem' }}>{m.email}</span>
                      </div>
                    ))}
              </div>
            )}
            {selectedMemberId && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(232, 184, 75, 0.15)',
                borderRadius: '4px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{addSearch}</span>
                <button
                  onClick={() => { setSelectedMemberId(''); setAddSearch('') }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, fontSize: '0.8rem' }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          <div className={styles.formActions}>
            <button className={styles.btnEdit} onClick={() => { setShowAdd(false); setSelectedMemberId(''); setAddSearch('') }}>
              Anulează
            </button>
            <button className={styles.btnPrimary} onClick={handleAdd} disabled={!selectedMemberId}>
              Adaugă
            </button>
          </div>
        </div>
      )}

      <div className={styles.formField} style={{ maxWidth: 360, marginBottom: '1.5rem' }}>
        <input
          placeholder="Caută după nume sau email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nume</th>
            <th>Email</th>
            <th>În departament din</th>
            <th>Data plecării</th>
            <th>Status</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((member, index) => (
            <tr key={`${member.memberId}-${index}`}>
              <td>{member.firstName} {member.lastName}</td>
              <td>{member.email}</td>
              <td>{member.joinDate}</td>
              <td>{member.leaveDate ?? '—'}</td>
              <td>
                <span className={member.leaveDate ? styles.badgeHidden : styles.badgeVisible}>
                  {member.leaveDate ? 'Inactiv' : 'Activ'}
                </span>
              </td>
              <td className={styles.actions}>
                {!member.leaveDate && (
                  <button className={styles.btnDanger} onClick={() => handleRemove(member.memberId)}>
                    Elimină
                  </button>
                )}
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

export default DepartmentDetail