import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/api'
import styles from './AdminTable.module.css'

const PAGE_SIZE = 15

function Devices() {
  const { token } = useAuth()
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [deviceEmail, setDeviceEmail] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => { setPage(1) }, [debouncedSearch])

  useEffect(() => {
    api.getDevices(token)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => {
          if (a.isActive && !b.isActive) return -1
          if (!a.isActive && b.isActive) return 1
          return new Date(b.registeredAt) - new Date(a.registeredAt)
        })
        setDevices(sorted)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [token])

  const handleDeactivate = async (id) => {
    if (!confirm('Ești sigur?')) return
    try {
      const res = await api.deactivateDevice(token, id)
      if (!res.ok) { alert('Eroare.'); return }
      setDevices(prev => {
        const updated = prev.map(d => d.registeredDeviceId === id ? { ...d, isActive: false } : d)
        return updated.sort((a, b) => {
          if (a.isActive && !b.isActive) return -1
          if (!a.isActive && b.isActive) return 1
          return new Date(b.registeredAt) - new Date(a.registeredAt)
        })
      })
    } catch (err) {
      alert('Eroare: ' + err.message)
    }
  }

  const handleSendToken = async () => {
    if (!deviceEmail) return
    setSending(true)
    try {
      const res = await api.sendDeviceTokenByEmail(token, deviceEmail)
      if (!res.ok) {
        const msg = await res.text()
        alert(msg)
        return
      }
      alert('Token trimis!')
      setDeviceEmail('')
      setShowForm(false)
    } catch (err) {
      alert('Eroare: ' + err.message)
    } finally {
      setSending(false)
    }
  }

  const filtered = devices.filter(d => {
    const q = debouncedSearch.toLowerCase()
    return d.userEmail.toLowerCase().includes(q)
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (loading) return <div className={styles.loading}>Se încarcă...</div>

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Dispozitive</h1>
        <button className={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>
          + Adaugă dispozitiv
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Trimite token înregistrare</h2>
          <div className={styles.formField}>
            <label>Email cont</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={deviceEmail}
              onChange={e => setDeviceEmail(e.target.value)}
            />
          </div>
          <div className={styles.formActions}>
            <button className={styles.btnEdit} onClick={() => { setShowForm(false); setDeviceEmail('') }}>
              Anulează
            </button>
            <button className={styles.btnPrimary} onClick={handleSendToken} disabled={!deviceEmail || sending}>
              {sending ? 'Se trimite...' : 'Trimite token'}
            </button>
          </div>
        </div>
      )}

      <div className={styles.formField} style={{ maxWidth: 360, marginBottom: '1.5rem' }}>
        <input
          placeholder="Caută după email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Utilizator</th>
            <th>Înregistrat</th>
            <th>Status</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(device => (
            <tr key={device.registeredDeviceId}>
              <td>{device.userEmail}</td>
              <td>{new Date(device.registeredAt).toLocaleDateString('ro-RO')}</td>
              <td>
                <span className={device.isActive ? styles.badgeVisible : styles.badgeHidden}>
                  {device.isActive ? 'Activ' : 'Inactiv'}
                </span>
              </td>
              <td className={styles.actions}>
                {device.isActive && (
                  <button className={styles.btnDanger} onClick={() => handleDeactivate(device.registeredDeviceId)}>
                    Dezactivează
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

export default Devices