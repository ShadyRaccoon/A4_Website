import styles from './FeaturedPost.module.css'

const featured = {
  title: "Workshop de Design Urban — Explorând Spațiile Publice",
  body: "Am organizat un workshop intensiv de design urban unde studenții au explorat concepte inovatoare de amenajare a spațiilor publice din Timișoara. Evenimentul a reunit peste 40 de participanți.",
  author: "Bogdan M.",
  date: "12 Mai 2024",
  image: "https://placehold.co/800x500/e8b84b/1a1a1a"
}

function FeaturedPost() {
  return (
    <section className={styles.featured}>
      <div className={styles.text}>
        <h1>{featured.title}</h1>
        <hr className={styles.divider} />
        <p>{featured.body}</p>
        <hr className={styles.divider} />
        <span className={styles.meta}>{featured.author} · {featured.date}</span>
      </div>
      <div className={styles.image}>
        <img src={featured.image} alt={featured.title} />
      </div>
      
    </section>
  )
}

export default FeaturedPost