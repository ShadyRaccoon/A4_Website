import { useLocation, useNavigate } from 'react-router-dom'
import styles from './PostPreview.module.css'

function PostPreview() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state) {
    navigate('/panou/postari/nou')
    return null
  }

  const { form, imagePreview } = state

  const handlePublish = () => {
    // wire to API later — upload image then create post
    console.log('publish', state)
    navigate('/panou/postari')
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <button className={styles.btnBack} onClick={() => navigate('/panou/postari/nou', { state })}>
          ← Înapoi la editare
        </button>
        <button className={styles.btnPublish} onClick={handlePublish}>
          Publică
        </button>
      </div>

      <article className={styles.article}>
        {imagePreview && (
          <img src={imagePreview} alt={form.title} className={styles.image} />
        )}
        <h1 className={styles.title}>{form.title}</h1>
        <p className={styles.body}>{form.body}</p>
      </article>
    </div>
  )
}

export default PostPreview