import { useState } from 'react'
import styles from './Login.module.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    // wire to API later
    console.log(email, password)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.logo}>A4</h1>
        <p className={styles.sub}>Panou de administrare</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@a4.ro"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Parolă</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <span className={styles.error}>{error}</span>}
          <button type="submit" className={styles.btn}>Autentificare</button>
        </form>
      </div>
    </div>
  )
}

export default Login