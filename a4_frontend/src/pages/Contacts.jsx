import styles from './Contacts.module.css'

function Contacts() {
  return (
    <main>
      <section className={styles.section}>
        <h1 className={styles.title}>Contact</h1>
        <div className={styles.grid}>
          <div className={styles.info}>
            <div className={styles.block}>
              <h3>Adresă</h3>
              <p>Traian Lalescu 2<br />Timișoara 300223</p>
            </div>
            <div className={styles.block}>
              <h3>Email</h3>
              <a href="mailto:contact@a4.ro">contact@a4.ro</a>
            </div>
            <div className={styles.block}>
              <h3>Telefon</h3>
              <a href="tel:+40700000000">+40 700 000 000</a>
            </div>
            <div className={styles.block}>
              <h3>Social Media</h3>
              <a href="#">Instagram</a>
              <a href="#">Facebook</a>
            </div>
          </div>
          <div className={styles.map}>
            <iframe
              title="Locație A4"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2782.4!2d21.2246!3d45.7489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47455d84a949a0bf%3A0x0!2sTraian+Lalescu+2%2C+Timi%C8%99oara!5e0!3m2!1sro!2sro!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contacts