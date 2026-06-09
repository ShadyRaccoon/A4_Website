import styles from './AdminTable.module.css'

const departments = [
  { id: 1, name: "Resurse Umane", alias: "HR" },
  { id: 2, name: "Fundraising", alias: "FR" },
  { id: 3, name: "Imagine", alias: "IMG" },
  { id: 4, name: "Socio-Cultural", alias: "SOCIO" },
  { id: 5, name: "Relații Publice", alias: "PR" },
  { id: 6, name: "Reprezentare", alias: "REPRE" },
]

function AdminDepartments() {
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Departamente</h1>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nume</th>
            <th>Alias</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(dept => (
            <tr key={dept.id}>
              <td>{dept.name}</td>
              <td>{dept.alias}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminDepartments