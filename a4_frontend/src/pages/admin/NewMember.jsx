import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NewPost.module.css'

function NewMember() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    faculty: '',
    email: '',
    phoneNumber: '',
    joinDate: ''
  })

  const handleSubmit = () => {
    // wire to API later
    console.log(form)
    navigate('/panou/membri')
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Membru nou</h1>
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Prenume</label>
            <input
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
              placeholder="Prenume"
            />
          </div>
          <div className={styles.field}>
            <label>Nume</label>
            <input
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
              placeholder="Nume"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Facultate</label>
          <input
            value={form.faculty}
            onChange={e => setForm({ ...form, faculty: e.target.value })}
            placeholder="Facultatea de Arhitectură și Urbanism"
          />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="email@example.com"
          />
        </div>

        <div className={styles.field}>
          <label>Telefon</label>
          <input
            value={form.phoneNumber}
            onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
            placeholder="+40 700 000 000"
          />
        </div>

        <div className={styles.field}>
          <label>Data intrării</label>
          <input
            type="date"
            value={form.joinDate}
            onChange={e => setForm({ ...form, joinDate: e.target.value })}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={() => navigate('/panou/membri')}>
            Anulează
          </button>
          <button
            className={styles.btnPreview}
            onClick={handleSubmit}
            disabled={!form.firstName || !form.lastName || !form.email || !form.joinDate}
          >
            Adaugă membru
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewMember