import React, { useState } from 'react';
import './App.css';  // Assicurati di avere un file CSS associato per le tue regole di stile.

function App() {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <div className="app-container">
      <textarea
        rows="4"  // Puoi impostare il numero di righe desiderato
        placeholder="Inserisci del testo qui..."
        value={inputText}
        onChange={handleInputChange}
        className="text-input"
      />
    </div>
  );
}

export default App;
