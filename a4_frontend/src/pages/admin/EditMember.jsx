import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/api'
import styles from './NewPost.module.css'

function EditMember() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { token } = useAuth()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    faculty: '',
    email: '',
    phoneNumber: '',
    leaveDate: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getMembers(token)
      .then(res => res.json())
      .then(members => {
        const member = members.find(m => m.memberId === parseInt(id))
        if (!member) { navigate('/panou/membri'); return }
        setForm({
          firstName: member.firstName,
          lastName: member.lastName,
          faculty: member.faculty,
          email: member.email,
          phoneNumber: member.phoneNumber,
          leaveDate: member.leaveDate ?? ''
        })
        setLoading(false)
      })
  }, [id, token])

  const handleSubmit = async () => {
    try {
      const res = await api.updateMember(token, parseInt(id), {
        firstName: form.firstName,
        lastName: form.lastName,
        faculty: form.faculty,
        email: form.email,
        phoneNumber: form.phoneNumber,
        leaveDate: form.leaveDate || null
      })
      if (!res.ok) { alert('Eroare la actualizare.'); return }
      navigate('/panou/membri')
    } catch (err) {
      alert('Eroare: ' + err.message)
    }
  }

  if (loading) return <div>Se încarcă...</div>

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Editează membru</h1>
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Prenume</label>
            <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>Nume</label>
            <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          </div>
        </div>
        <div className={styles.field}>
          <label>Facultate</label>
          <input value={form.faculty} onChange={e => setForm({ ...form, faculty: e.target.value })} />
        </div>
        <div className={styles.field}>
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className={styles.field}>
          <label>Telefon</label>
          <input value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
        </div>
        <div className={styles.field}>
          <label>Data plecării (opțional)</label>
          <input type="date" value={form.leaveDate} onChange={e => setForm({ ...form, leaveDate: e.target.value })} />
        </div>
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={() => navigate('/panou/membri')}>Anulează</button>
          <button
            className={styles.btnPreview}
            onClick={handleSubmit}
            disabled={!form.firstName || !form.lastName || !form.email}
          >
            Salvează
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditMember