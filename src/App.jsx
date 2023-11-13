import React, { useState, useEffect } from 'react';
import './App.css';
import YAML from 'js-yaml';

const defaultYaml = `title: Goblin
subtitle: Small humanoid (goblinoid), neutral evil
artist: Public Domain
image_path: Goblin.png
armor_class: 15 (Leather armor, shield)
max_hit_points: 7 (2d6)
speed: 30 ft.
strength: 8 (-1)
dexterity: 14 (+2)
constitution: 10 (+0)
intelligence: 10 (+0)
wisdom: 8 (-1)
charisma: 8 (-1)`;

function Preview({ yamlData }) {
  return (
    <div className="preview-container">
      {/* restante codice come prima */}
    </div>
  );
}

function App() {
  const [inputText, setInputText] = useState(defaultYaml);
  const [yamlData, setYamlData] = useState(null);

  const handleInputChange = (event) => {
    const newText = event.target.value;
    setInputText(newText);

    try {
      const parsedYaml = YAML.load(newText);
      setYamlData(parsedYaml);
    } catch (error) {
      console.error('Errore nel parsing YAML:', error);
      setYamlData(null);
    }
  };

  // Effetto useEffect per caricare il testo di default all'avvio
  useEffect(() => {
    try {
      const parsedYaml = YAML.load(defaultYaml);
      setYamlData(parsedYaml);
    } catch (error) {
      console.error('Errore nel parsing YAML:', error);
      setYamlData(null);
    }
  }, []);

  return (
    <div className="app-container">
      <textarea
        rows="16"  // Aumentato il numero di righe per visualizzare meglio il testo di default
        placeholder="Inserisci del testo YAML qui..."
        value={inputText}
        onChange={handleInputChange}
        className="text-input"
      />
      {yamlData && <Preview yamlData={yamlData} />}
    </div>
  );
}

export default App;
