import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/api'
import styles from './AdminTable.module.css'


function Posts() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getAllPosts(token)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  const handleToggleHidden = async (id) => {
    try {
      await api.toggleHidden(token, id)
      setPosts(posts.map(p => p.postId === id ? { ...p, isHidden: !p.isHidden } : p))
    } catch (err) {
      alert('Eroare: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Ești sigur că vrei să ștergi această postare?')) return
    try {
      await api.deletePost(token, id)
      setPosts(posts.filter(p => p.postId !== id))
    } catch (err) {
      alert('Eroare: ' + err.message)
    }
  }

  if (loading) return <div className={styles.loading}>Se încarcă...</div>
  if (error) return <div className={styles.loading}>Eroare: {error}</div>

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Postări</h1>
        <button className={styles.btnPrimary} onClick={() => navigate('/panou/postari/nou')}>
          + Postare nouă
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Titlu</th>
            <th>Autor</th>
            <th>Dată</th>
            <th>Status</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.postId}>
              <td>{post.title}</td>
              <td>{post.authorName}</td>
              <td>{new Date(post.createdAt).toLocaleDateString('ro-RO')}</td>
              <td>
                <span className={post.isHidden ? styles.badgeHidden : styles.badgeVisible}>
                  {post.isHidden ? 'Ascuns' : 'Vizibil'}
                </span>
              </td>
              <td className={styles.actions}>
                <button className={styles.btnEdit} onClick={() => navigate(`/panou/postari/editeaza/${post.postId}`)}>
                  Editează
                </button>
                <button className={styles.btnSecondary} onClick={() => handleToggleHidden(post.postId)}>
                  {post.isHidden ? 'Afișează' : 'Ascunde'}
                </button>
                <button className={styles.btnDanger} onClick={() => handleDelete(post.postId)}>
                  Șterge
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Posts