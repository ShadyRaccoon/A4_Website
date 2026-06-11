import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api/api'

function PostView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getPostById(id)
      .then(res => {
        if (!res.ok) { navigate('/articles'); return }
        return res.json()
      })
      .then(data => { if (data) setPost(data) })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Se încarcă...</div>
  if (!post) return null

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      {post.pictureUrl && (
        <img
          src={`http://localhost:5242/api/blobstorage/download?url=${encodeURIComponent(post.pictureUrl)}`}
          alt={post.title}
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '4px', marginBottom: '2rem' }}
        />
      )}
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1rem' }}>{post.title}</h1>
      <div style={{ fontFamily: 'var(--font-meta)', fontSize: '0.85rem', opacity: 0.5, marginBottom: '2rem' }}>
        {post.authorName} · {new Date(post.createdAt).toLocaleDateString('ro-RO')}
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid rgba(26,26,26,0.1)', marginBottom: '2rem' }} />
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', lineHeight: '1.9', whiteSpace: 'pre-wrap' }}>
        {post.body}
      </p>
      <div style={{ marginTop: '3rem' }}>
        <button
          onClick={() => navigate('/articles')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-meta)', opacity: 0.5 }}
        >
          ← Înapoi la articole
        </button>
      </div>
    </div>
  )
}

export default PostView