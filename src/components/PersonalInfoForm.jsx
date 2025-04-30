import React, { useState, useRef } from "react";
import * as XLSX from "xlsx"; // Asegúrate de tener esto instalado: npm install xlsx
import html2pdf from "html2pdf.js";
import Swal from "sweetalert2";

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

function PersonalInfoForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });

  const fileInputRef = useRef();

  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      if (json.length > 0) {
        const primeraFila = json[0];
        setFormData({
          nombre: primeraFila.Nombre || "",
          email: primeraFila.Email || "",
          telefono: primeraFila.Movil || "",
        });
      }

      console.log(json); 
    };

    reader.readAsArrayBuffer(file);
  };

  const exportToPDF = () => {
    const element = document.getElementById("cv-preview");
    html2pdf().from(element).save("cv.pdf");
  };

  return (
    <div>
      <input  type="file" ref={fileInputRef} onChange={handleExcelChange} accept=".xlsx, .xls" />
      <button onClick={() => fileInputRef.current && fileInputRef.current.click()}>
        Cargar y Procesar Excel
      </button>

      <div id="cv-preview">
        <CVPreview formData={formData} />
      </div>

      <button
        onClick={exportToPDF}
        style={{
          marginTop: "2rem",
          backgroundColor: "#0ff",
          color: "#000",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
        }}
      >
        Exportar a PDF
      </button>
    </div>
  );
}

export default PersonalInfoForm;
