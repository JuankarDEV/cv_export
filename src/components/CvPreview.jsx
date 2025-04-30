// src/components/CVPreview.jsx
function CVTemplate({ formData }) {
  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      padding: "2rem",
      maxWidth: "800px",
      margin: "0 auto",
      backgroundColor: "#fff",
      color: "#000",
    },
    header: {
      borderBottom: "2px solid #0ff",
      paddingBottom: "1rem",
      marginBottom: "2rem",
    },
    name: {
      fontSize: "2.5rem",
      color: "#0ff",
      margin: "0",
    },
    section: {
      marginBottom: "2rem",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      borderBottom: "1px solid #ccc",
      marginBottom: "0.5rem",
    },
  };
  
  const {
    nombre,
    email,
    telefono,
    perfil,
    experiencia,
    educacion,
  } = formData;

  return (
    <div style={styles.container}>
      {/* CABECERA */}
      <div style={styles.header}>
        <h1 style={styles.name}>{nombre || "Tu Nombre"}</h1>
        <p>{email || "correo@ejemplo.com"} | {telefono || "000 000 000"}</p>
      </div>

      {/* PERFIL PERSONAL */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Perfil</h2>
        <p>{perfil || "Breve resumen profesional o personal."}</p>
      </div>

      {/* EXPERIENCIA */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Experiencia</h2>
        <ul>
          {(experiencia || []).map((item, idx) => (
            <li key={idx}>
              <strong>{item.puesto}</strong> - {item.empresa} ({item.fecha})
              <p>{item.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* EDUCACIÓN */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Educación</h2>
        <ul>
          {(educacion || []).map((item, idx) => (
            <li key={idx}>
              <strong>{item.titulo}</strong> - {item.institucion} ({item.fecha})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
