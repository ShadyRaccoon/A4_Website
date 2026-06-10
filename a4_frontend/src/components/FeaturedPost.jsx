import { useState, useEffect } from 'react'
import { api } from '../api/api'
import styles from './FeaturedPost.module.css'

function FeaturedPost() {
  const [post, setPost] = useState(null)

  useEffect(() => {
    api.getPosts()
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) setPost(data[0])
      })
      .catch(err => console.error(err))
  }, [])

  if (!post) return null

  return (
    <section className={styles.featured}>
      <div className={styles.text}>
        <h1>{post.title}</h1>
        <hr className={styles.divider} />
        <p>{post.body}</p>
        <hr className={styles.divider} />
        <span className={styles.meta}>{post.authorName} · {new Date(post.createdAt).toLocaleDateString('ro-RO')}</span>
      </div>
      <div className={styles.image}>
        {post.pictureUrl ? (
          <img src={`http://localhost:5242/api/blobstorage/download?url=${encodeURIComponent(post.pictureUrl)}`} alt={post.title} />
        ) : (
          <img src="https://placehold.co/800x500/e8b84b/1a1a1a" alt={post.title} />
        )}
      </div>
    </section>
  )
}

export default FeaturedPost