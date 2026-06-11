import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/api'
import styles from './AdminTable.module.css'

const PAGE_SIZE = 15

function AccountRequests() {
  const { token } = useAuth()
  const [requests, setRequests] = useState([])
  const [eligibleMembers, setEligibleMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [memberSearch, setMemberSearch] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => { setPage(1) }, [debouncedSearch])

  useEffect(() => {
    Promise.all([
      api.getAccountRequests(token).then(res => res.json()),
      fetch('http://localhost:5242/api/member/eligible-for-account', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json())
    ])
      .then(([reqs, members]) => {
        setRequests(reqs)
        setEligibleMembers(members)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [token])

  const handleSubmit = async () => {
    if (!selectedMemberId) return
    try {
      const res = await api.createRequest(token, { requestedMemberId: parseInt(selectedMemberId) })
      if (!res.ok) {
        const msg = await res.text()
        alert(msg)
        return
      }
      const newReq = await res.json()
      setRequests(prev => [newReq, ...prev])
      setEligibleMembers(prev => prev.filter(m => m.memberId !== parseInt(selectedMemberId)))
      setSelectedMemberId('')
      setMemberSearch('')
      setShowForm(false)
    } catch (err) {
      alert('Eroare: ' + err.message)
    }
  }

  const handleAccept = async (id) => {
    try {
      const res = await api.acceptRequest(token, id)
      if (!res.ok) { alert('Eroare la acceptare.'); return }
      setRequests(prev => prev.map(r => r.accountRequestId === id ? { ...r, status: 'Accepted' } : r))
    } catch (err) {
      alert('Eroare: ' + err.message)
    }
  }

  const handleDeny = async (id) => {
    try {
      const res = await api.denyRequest(token, id)
      if (!res.ok) { alert('Eroare la refuzare.'); return }
      setRequests(prev => prev.map(r => r.accountRequestId === id ? { ...r, status: 'Denied' } : r))
    } catch (err) {
      alert('Eroare: ' + err.message)
    }
  }

  const filtered = requests.filter(r => {
    const q = debouncedSearch.toLowerCase()
    return (
      r.requestedMemberName.toLowerCase().includes(q) ||
      r.authorEmail.toLowerCase().includes(q)
    )
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const filteredEligible = eligibleMembers.filter(m => {
    const q = memberSearch.toLowerCase()
    return (
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q)
    )
  })

  if (loading) return <div className={styles.loading}>Se încarcă...</div>

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Cereri Cont</h1>
        <button className={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>
          + Cerere nouă
        </button>
      </div>

      
      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Cerere nouă</h2>
          <div className={styles.formField}>
            <label>Caută membru</label>
            <input
              placeholder="Caută după nume sau email..."
              value={memberSearch}
              onChange={e => { setMemberSearch(e.target.value); setSelectedMemberId('') }}
            />
            {memberSearch && !selectedMemberId && (
              <div style={{
                border: '1px solid rgba(26,26,26,0.1)',
                borderRadius: '4px',
                marginTop: '0.25rem',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {filteredEligible.length === 0 ? (
                  <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem', opacity: 0.5 }}>
                    Niciun rezultat
                  </div>
                ) : filteredEligible.map(m => (
                  <div
                    key={m.memberId}
                    onClick={() => { setSelectedMemberId(m.memberId); setMemberSearch(`${m.firstName} ${m.lastName}`) }}
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
                <span>{memberSearch}</span>
                <button
                  onClick={() => { setSelectedMemberId(''); setMemberSearch('') }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, fontSize: '0.8rem' }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          <div className={styles.formActions}>
            <button className={styles.btnEdit} onClick={() => { setShowForm(false); setSelectedMemberId(''); setMemberSearch('') }}>
              Anulează
            </button>
            <button className={styles.btnPrimary} onClick={handleSubmit} disabled={!selectedMemberId}>
              Trimite cerere
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
            <th>Solicitant</th>
            <th>Membru</th>
            <th>Status</th>
            <th>Dată</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(req => (
            <tr key={req.accountRequestId}>
              <td>{req.authorEmail}</td>
              <td>{req.requestedMemberName}</td>
              <td>
                <span className={
                  req.status === 'Accepted' ? styles.badgeVisible :
                  req.status === 'Denied' ? styles.badgeHidden :
                  styles.badgePending
                }>
                  {req.status === 'Accepted' ? 'Acceptat' :
                   req.status === 'Denied' ? 'Refuzat' : 'În așteptare'}
                </span>
              </td>
              <td>{new Date(req.createdAt).toLocaleDateString('ro-RO')}</td>
              <td className={styles.actions}>
                {req.status === 'Pending' && <>
                  <button className={styles.btnEdit} onClick={() => handleAccept(req.accountRequestId)}>Acceptă</button>
                  <button className={styles.btnDanger} onClick={() => handleDeny(req.accountRequestId)}>Refuză</button>
                </>}
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

export default AccountRequests