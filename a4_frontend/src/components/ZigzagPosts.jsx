import styles from './ZigzagPosts.module.css'

const posts = [
  {
    id: 1,
    title: "Workshop de Design Urban",
    body: "Am organizat un workshop intensiv de design urban unde studenții au explorat concepte inovatoare de amenajare a spațiilor publice.",
    date: "12 Mai 2024",
    author: "Bogdan M.",
    image: "https://placehold.co/600x400/e8b84b/1a1a1a"
  },
  {
    id: 2,
    title: "Excursie de Studiu la Viena",
    body: "Membrii asociației au vizitat cele mai importante clădiri de arhitectură modernă din Viena, o experiență de neuitat.",
    date: "3 Aprilie 2024",
    author: "Ana P.",
    image: "https://placehold.co/600x400/1a1a1a/f5f0e8"
  },
  {
    id: 3,
    title: "Concurs de Proiecte Studențești",
    body: "A patra ediție a concursului anual de proiecte studențești a adunat peste 50 de participanți din toată țara.",
    date: "20 Martie 2024",
    author: "Mihai D.",
    image: "https://placehold.co/600x400/e8b84b/1a1a1a"
  }
]

function ZigzagPosts() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Ultimele Articole</h2>
      {posts.map((post, index) => (
        <div
          key={post.id}
          className={`${styles.post} ${index % 2 !== 0 ? styles.reversed : ''}`}
        >
          <div className={styles.image}>
            <img src={post.image} alt={post.title} />
          </div>
          <div className={styles.content}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <span className={styles.meta}>{post.author} · {post.date}</span>
          </div>
        </div>
      ))}
    </section>
  )
}

export default ZigzagPosts