import styles from './Departments.module.css'

const departments = [
  { 
    emoji: "👥", 
    name: "Resurse Umane", 
    alias: "HR",
    description: "Recrutăm și integrăm noii membri ai asociației, asigurând un mediu de lucru sănătos și o echipă unită."
  },
  { 
    emoji: "💰", 
    name: "Fundraising", 
    alias: "FR",
    description: "Identificăm și atragem resurse financiare și parteneriate pentru a susține proiectele și evenimentele asociației."
  },
  { 
    emoji: "🎨", 
    name: "Imagine", 
    alias: "IMG",
    description: "Creăm identitatea vizuală a asociației prin design grafic, fotografie și conținut creativ pentru toate platformele."
  },
  { 
    emoji: "🎭", 
    name: "Socio-Cultural", 
    alias: "SOCIO",
    description: "Organizăm evenimente culturale și sociale care aduc împreună studenții facultății într-un spirit comunitar."
  },
  { 
    emoji: "📢", 
    name: "Relații Publice", 
    alias: "PR",
    description: "Gestionăm comunicarea externă a asociației și construim relații cu parteneri, media și comunitatea academică."
  },
  { 
    emoji: "⚖️", 
    name: "Reprezentare", 
    alias: "REPRE",
    description: "Reprezentăm interesele studenților în fața conducerii facultății și apărăm drepturile lor academice."
  },
]

function Departments() {
  return (
    <main>
      <section className={styles.section}>
        <h1 className={styles.title}>Departamente</h1>
        <div className={styles.grid}>
          {departments.map((dept, index) => (
            <div key={index} className={styles.card}>
              <span className={styles.emoji}>{dept.emoji}</span>
              <span className={styles.name}>{dept.name}</span>
              <span className={styles.alias}>{dept.alias}</span>
              <span className={styles.description}>{dept.description}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Departments