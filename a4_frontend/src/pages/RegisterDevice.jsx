import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './admin/Login.module.css'

function RegisterDevice() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Token lipsă.')
      return
    }

    const deviceId = crypto.randomUUID()

    fetch('http://localhost:5242/api/device/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, deviceIdentifier: deviceId })
    })
      .then(async res => {
        if (res.ok) {
          document.cookie = `DeviceId=${deviceId}; path=/; max-age=31536000`
          setStatus('success')
          setMessage('Dispozitivul a fost înregistrat cu succes.')
        } else {
          const text = await res.text()
          setStatus('error')
          setMessage(text || 'Token invalid sau expirat.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Eroare de conexiune.')
      })
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>A₄</div>
        <p className={styles.subtitle}>Înregistrare dispozitiv</p>
        {status === 'loading' && <p>Se procesează...</p>}
        {status === 'success' && (
          <>
            <p style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>
            <button className={styles.btn} onClick={() => navigate('/admin/login')}>
              Mergi la autentificare
            </button>
          </>
        )}
        {status === 'error' && (
          <p style={{ color: 'red' }}>{message}</p>
        )}
      </div>
    </div>
  )
}

export default RegisterDevice