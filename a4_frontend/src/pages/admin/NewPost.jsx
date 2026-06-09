import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NewPost.module.css'

function NewPost() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', body: '' })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handlePreview = () => {
    if (!form.title || !form.body) return
    navigate('/panou/postari/preview', {
      state: { form, imagePreview, image }
    })
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Postare nouă</h1>

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
              onClick={() => { setImage(null); setImagePreview(null) }}
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

export default NewPost