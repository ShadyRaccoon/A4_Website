import { useState } from 'react'
import styles from './AdminTable.module.css'

const accounts = [
  { id: 1, email: "bogdan@a4.ro", username: "bogdan", role: "Admin", active: true },
  { id: 2, email: "ana@a4.ro", username: "ana", role: "Birou", active: true },
  { id: 3, email: "mihai@a4.ro", username: "mihai", role: "Membru", active: false },
]

function Accounts() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ email: '', username: '', role: 'Membru' })

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Conturi</h1>
        <button className={styles.btnPrimary} onClick={() => setShowForm(true)}>+ Cont nou</button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Cont nou</h2>
          <div className={styles.formField}>
            <label>Email</label>
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@a4.ro" />
          </div>
          <div className={styles.formField}>
            <label>Username</label>
            <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="username" />
          </div>
          <div className={styles.formField}>
            <label>Rol</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option>Membru</option>
              <option>Birou</option>
              <option>Admin</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button className={styles.btnEdit} onClick={() => setShowForm(false)}>Anulează</button>
            <button className={styles.btnPrimary} onClick={() => setShowForm(false)}>Creează și trimite email</button>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Rol</th>
            <th>Status</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td>{account.email}</td>
              <td>{account.username}</td>
              <td>{account.role}</td>
              <td>
                <span className={account.active ? styles.badgeVisible : styles.badgeHidden}>
                  {account.active ? 'Activ' : 'Inactiv'}
                </span>
              </td>
              <td className={styles.actions}>
                <button className={account.active ? styles.btnDanger : styles.btnEdit}>
                  {account.active ? 'Dezactivează' : 'Activează'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Accounts