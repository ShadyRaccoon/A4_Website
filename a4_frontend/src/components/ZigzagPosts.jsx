import { useState, useEffect } from 'react'
import { api } from '../api/api'
import { Link } from 'react-router-dom'
import styles from './ZigzagPosts.module.css'

function ZigzagPosts() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    api.getPosts()
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Ultimele Articole</h2>
      {posts.map((post, index) => (
        <div
          key={post.postId}
          className={`${styles.post} ${index % 2 !== 0 ? styles.reversed : ''}`}
        >
          <div className={styles.image}>
            {post.pictureUrl ? (
              <img src={`http://localhost:5242/api/blobstorage/download?url=${encodeURIComponent(post.pictureUrl)}`} alt={post.title} />
            ) : (
              <img src="https://placehold.co/600x400/e8b84b/1a1a1a" alt={post.title} />
            )}
          </div>
          <div className={styles.content}>
            <Link to={`/articles/${post.postId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3>{post.title}</h3>
            </Link>
            <p>{post.body}</p>
            <span className={styles.meta}>{post.authorName} · {new Date(post.createdAt).toLocaleDateString('ro-RO')}</span>
          </div>
        </div>
      ))}
    </section>
  )
}

export default ZigzagPosts