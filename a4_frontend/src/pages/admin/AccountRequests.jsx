import { useState } from 'react'
import styles from './AdminTable.module.css'

const requests = [
  { id: 1, requester: "bogdan@a4.ro", member: "Bogdan Mladin", status: "Pending" },
  { id: 2, requester: "ana@a4.ro", member: "Ana Pop", status: "Pending" },
  { id: 3, requester: "mihai@a4.ro", member: "Mihai Dumitrescu", status: "Accepted" },
]

function AccountRequests() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ memberId: '' })

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Cereri Cont</h1>
        <button className={styles.btnPrimary} onClick={() => setShowForm(true)}>+ Cerere nouă</button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Cerere nouă</h2>
          <div className={styles.formField}>
            <label>ID Membru</label>
            <input value={form.memberId} onChange={e => setForm({ ...form, memberId: e.target.value })} placeholder="ID-ul membrului" />
          </div>
          <div className={styles.formActions}>
            <button className={styles.btnEdit} onClick={() => setShowForm(false)}>Anulează</button>
            <button className={styles.btnPrimary} onClick={() => setShowForm(false)}>Trimite cerere</button>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Solicitant</th>
            <th>Membru</th>
            <th>Status</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.requester}</td>
              <td>{req.member}</td>
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
              <td className={styles.actions}>
                {req.status === 'Pending' && <>
                  <button className={styles.btnEdit}>Acceptă</button>
                  <button className={styles.btnDanger}>Refuză</button>
                </>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AccountRequests