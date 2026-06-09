import { useState } from 'react'
import styles from './AdminTable.module.css'

const devices = [
  { id: 1, deviceId: "abc123", user: "bogdan@a4.ro", registeredAt: "1 Ian 2024", active: true },
  { id: 2, deviceId: "def456", user: "ana@a4.ro", registeredAt: "5 Feb 2024", active: true },
  { id: 3, deviceId: "ghi789", user: "mihai@a4.ro", registeredAt: "10 Mar 2024", active: false },
]

function Devices() {
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Dispozitive</h1>
        <button className={styles.btnPrimary} onClick={() => setShowForm(true)}>+ Adaugă dispozitiv</button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Adaugă dispozitiv</h2>
          <div className={styles.formField}>
            <label>Email utilizator</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@a4.ro" />
          </div>
          <p className={styles.formHint}>Utilizatorul va primi un link de înregistrare pe email. Dispozitivul se înregistrează la accesarea linkului.</p>
          <div className={styles.formActions}>
            <button className={styles.btnEdit} onClick={() => setShowForm(false)}>Anulează</button>
            <button className={styles.btnPrimary} onClick={() => setShowForm(false)}>Trimite link</button>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Device ID</th>
            <th>Utilizator</th>
            <th>Înregistrat</th>
            <th>Status</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(device => (
            <tr key={device.id}>
              <td className={styles.mono}>{device.deviceId}</td>
              <td>{device.user}</td>
              <td>{device.registeredAt}</td>
              <td>
                <span className={device.active ? styles.badgeVisible : styles.badgeHidden}>
                  {device.active ? 'Activ' : 'Inactiv'}
                </span>
              </td>
              <td className={styles.actions}>
                {device.active && (
                  <button className={styles.btnDanger}>Dezactivează</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Devices