import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/api'
import styles from './PostPreview.module.css'

function PostPreview() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { token } = useAuth()

  if (!state) {
    navigate('/panou/postari/nou')
    return null
  }

  const { form, imagePreview, image, existingPictureId, editId } = state

  const handlePublish = async () => {
    try {
      let pictureId = existingPictureId ?? null

      if (image) {
        const uploadRes = await api.uploadImage(token, image)
        if (!uploadRes.ok) { alert('Eroare la upload imagine.'); return }
        const blobUrl = await uploadRes.text()

        const pictureRes = await api.savePicture(token, blobUrl)
        if (!pictureRes.ok) { alert('Eroare la salvare imagine.'); return }
        const pictureData = await pictureRes.json()
        pictureId = pictureData.pictureId
      }

      const dto = { title: form.title, body: form.body, pictureId }

      const res = editId
        ? await api.updatePost(token, editId, dto)
        : await api.createPost(token, dto)

      if (!res.ok) { alert('Eroare: ' + await res.text()); return }

      navigate('/panou/postari')
    } catch (err) {
      alert('Eroare la publicare: ' + err.message)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <button className={styles.btnBack} onClick={() => navigate(
          editId ? `/panou/postari/editeaza/${editId}` : '/panou/postari/nou',
          { state }
        )}>
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