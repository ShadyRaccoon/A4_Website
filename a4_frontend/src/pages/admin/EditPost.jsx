import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/api'
import styles from './NewPost.module.css'

function EditPost() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { token } = useAuth()
  const [form, setForm] = useState({ title: '', body: '' })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [existingPictureId, setExistingPictureId] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef()

  useEffect(() => {
    api.getAllPosts(token)
      .then(res => res.json())
      .then(posts => {
        const post = posts.find(p => p.postId === parseInt(id))
        if (!post) { navigate('/panou/postari'); return }
        setForm({ title: post.title, body: post.body })
        setExistingPictureId(post.pictureId)
        if (post.pictureUrl) {
          setImagePreview(`http://localhost:5242/api/blobstorage/download?url=${encodeURIComponent(post.pictureUrl)}`)
        }
        setLoading(false)
      })
  }, [id, token])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
      setExistingPictureId(null)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
      setExistingPictureId(null)
    }
  }

  const handlePreview = () => {
    if (!form.title || !form.body) return
    navigate('/panou/postari/preview', {
      state: { form, imagePreview, image, existingPictureId, editId: parseInt(id) }
    })
  }

  if (loading) return <div>Se încarcă...</div>

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Editează postare</h1>
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Titlu</label>
          <input
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Titlul postării"
          />
        </div>
        <div className={styles.field}>
          <label>Conținut</label>
          <textarea
            value={form.body}
            onChange={e => setForm({ ...form, body: e.target.value })}
            placeholder="Scrie conținutul postării..."
            rows={10}
          />
        </div>
        <div className={styles.field}>
          <label>Imagine</label>
          <div
            className={`${styles.dropzone} ${dragging ? styles.dragging : ''} ${imagePreview ? styles.hasImage : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className={styles.dropzoneImg} />
            ) : (
              <div className={styles.dropzoneHint}>
                <span>Trage imaginea aici</span>
                <span className={styles.dropzoneSub}>sau click pentru a selecta</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          {imagePreview && (
            <button
              className={styles.removeImg}
              onClick={() => { setImage(null); setImagePreview(null); setExistingPictureId(null) }}
            >
              Șterge imaginea
            </button>
          )}
        </div>
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={() => navigate('/panou/postari')}>
            Anulează
          </button>
          <button
            className={styles.btnPreview}
            onClick={handlePreview}
            disabled={!form.title || !form.body}
          >
            Previzualizează
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditPost