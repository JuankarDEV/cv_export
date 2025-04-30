import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PersonalInfoForm from './components/PersonalInfoForm';

// src/App.jsx
function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Constructor de CV</h1>
      <p>¡Vamos a empezar a construir tu currículum!</p>
      <PersonalInfoForm/>
    </div>
  );
}

export default App;

