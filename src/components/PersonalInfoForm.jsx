import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import Swal from "sweetalert2";
import { FaEnvelope, FaPhone } from "react-icons/fa";

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    width: "500px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#fff",
    color: "#000",
    boxShadow: "inset 0 0 10px #0ff, inset 0 0 20px #0ff",
    borderRadius: "10px",
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
    color: "#0ff",
  },
};

function parseLista(texto, tipo) {
  if (!texto || typeof texto !== "string") return [];

  try {
    // Si es un JSON válido directamente, úsalo
    const parsed = JSON.parse(texto);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // No es JSON, intentar separarlo manualmente
  }

  // Parse manual: cada línea representa un ítem
  const lineas = texto.split(",").map((linea) => linea.trim()).filter(Boolean);

  if (tipo === "experiencia") {
    return lineas.map((linea) => {
      const [puesto = "", empresa = "", fecha = "", descripcion = ""] = linea.split("|");
      return { puesto, empresa, fecha, descripcion };
    });
  } else if (tipo === "educacion") {
    return lineas.map((linea) => {
      const [titulo = "", institucion = "", fecha = ""] = linea.split("|");
      return { titulo, institucion, fecha };
    });
  }

  return [];
}


function CVTemplate({ formData }) {
  const { nombre, email, telefono, perfil, experiencia, educacion } = formData;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.name}>{nombre || "Tu Nombre"}</h1>
        <p>
          <FaEnvelope style={{ marginRight: "8px" }} />
          {email || "correo@ejemplo.com"} |{" "}
          <FaPhone style={{ marginRight: "8px" }} /> {telefono || "000 000 000"}
        </p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Perfil</h2>
        <p>{perfil || "Breve resumen profesional o personal."}</p>
      </div>

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

function handleUploadError() {
  Swal.fire({
    icon: "error",
    title: "Error al subir el documento",
    text: "Falta la columna 'Nombre' en el archivo. Por favor, revisa el Excel.",
    confirmButtonText: "Reintentar",
    background: "#1a1a1a",
    color: "#fff",
    confirmButtonColor: "#0ff",
  });
}

function PersonalInfoForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    perfil: "",
    experiencia: [],
    educacion: [],
  });

  const fileInputRef = useRef();

  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      if (json.length === 0) {
        handleUploadError();
        return;
      }

      const primeraFila = json[0];

      if (!primeraFila.Nombre) {
        handleUploadError();
        return;
      }

      setFormData({
        nombre: primeraFila.Nombre || "",
        email: primeraFila.Email || "",
        telefono: primeraFila.Movil || "",
        perfil: primeraFila.Descripcion || "",
        experiencia: parseLista(primeraFila.Experiencia, "experiencia"),
        educacion: parseLista(primeraFila.Educacion, "educacion"),
      });
    };

    reader.readAsArrayBuffer(file);
    e.target.value = ""
  };

  const exportToPDF = () => {
    const element = document.getElementById("cv-pdf");
    html2pdf()
      .from(element)
      .set({
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: "cv_profesional.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  };

  return (
    <div>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleExcelChange}
        accept=".xlsx, .xls"
      />
      <button
        style={{ marginBottom: "20px" }}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        Cargar y Procesar Excel
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <div id="cv-pdf" style={{ width: "700px", margin: "0 auto" }}>
          <CVTemplate formData={formData} />
        </div>
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
