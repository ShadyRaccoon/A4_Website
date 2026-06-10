import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './AdminTable.module.css'

function AdminDepartments() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5242/api/department', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <div className={styles.loading}>Se încarcă...</div>

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Departamente</h1>
        <span style={{ fontFamily: 'var(--font-meta)', fontSize: '0.9rem', opacity: 0.5 }}>
          {departments.length} departamente
        </span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nume</th>
            <th>Alias</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(dept => (
            <tr
              key={dept.departmentId}
              onClick={() => navigate(`/panou/departamente/${dept.departmentId}`)}
              style={{ cursor: 'pointer' }}
            >
              <td>{dept.name}</td>
              <td>{dept.alias}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminDepartments