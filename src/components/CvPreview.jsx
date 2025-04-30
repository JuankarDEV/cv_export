// src/components/CVPreview.jsx
function CVPreview({ formData }) {
  return (
    <div style={{ padding: "2rem", border: "2px solid #ccc", borderRadius: "8px" }}>
      <h2>Vista Previa del CV</h2>
      <p><strong>Nombre:</strong> {formData.nombre || "No ingresado"}</p>
      <p><strong>Email:</strong> {formData.email || "No ingresado"}</p>
      <p><strong>Teléfono:</strong> {formData.telefono || "No ingresado"}</p>
    </div>
  );
}

export default CVPreview;
