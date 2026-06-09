import styles from './About.module.css'

const sections = [
  {
    title: "Cine suntem",
    content: [
      "Asociația de la 4 este organizația non-guvernamentală și non-profit a studenților Facultății de Arhitectură din Timișoara. Cunoscută datorită conferințelor, expozițiilor, workshop-urilor, training-urilor, concursurilor și activităților de destindere realizate pentru studenții arhitecți, A4 devine o entitate ce promovează o educație alternativă celei academice.",
      "Odată cu vechimea Asociației crește și aria de influență a acțiunilor noastre, conturând în prezent proiecte care rezonează și pentru cei din afara nișei."
    ]
  },
  {
    title: "Misiunea noastră",
    content: [
      "Asociația de la 4 își propune să reprezinte interesele și drepturile studenților Facultății de Arhitectură din Timișoara, să dezvolte competențele profesionale și calitățile personale ale studenților Facultății și să contureze identitatea acestora.",
      "De asemenea, se angajează la responsabilizarea față de fondul construit și construibil, a studenților arhitecți și nu numai."
    ]
  },
  {
    year: "2009",
    title: "Începuturile",
    content: [
      "Primele manifestări ale ceea ce un an mai târziu purta numele de Asociația de la Patru, au avut loc în toamna anului 2009, când se coagulează un grup de studenți dornici de a exprima un punct de vedere comun.",
      "Unul dintre primele evenimente A4, Manifestul Urban de comemorare a 20 de ani de la Revoluția din 1989, marchează timp de o săptămână strada Alba Iulia și deschide seria acțiunilor A4."
    ]
  }
]

function About() {
  return (
    <main>
      <section className={styles.section}>
        <h1 className={styles.pageTitle}>Despre noi</h1>
        <div className={styles.timeline}>
          {sections.map((item, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.marker}>
                <div className={styles.dot} />
              </div>
              <div className={styles.card}>
                {item.year && <span className={styles.year}>{item.year}</span>}
                <h2>{item.title}</h2>
                {item.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default About