import React, { useState } from 'react';
import './App.css';
import YAML from 'js-yaml';  // Assicurati di installare la libreria js-yaml tramite npm o yarn

function Preview({ yamlData }) {
  return (
    <div className="preview-container">
      <h2>{yamlData.title}</h2>
      <p>{yamlData.subtitle}</p>
      <p>Artist: {yamlData.artist}</p>
      <img src={yamlData.image_path} alt={yamlData.title} />
      <p>Armor Class: {yamlData.armor_class}</p>
      <p>Max Hit Points: {yamlData.max_hit_points}</p>
      <p>Speed: {yamlData.speed}</p>
      <div className="attributes">
        <div>
          <strong>Strength</strong>
          <p>{yamlData.strength}</p>
        </div>
        <div>
          <strong>Dexterity</strong>
          <p>{yamlData.dexterity}</p>
        </div>
        <div>
          <strong>Constitution</strong>
          <p>{yamlData.constitution}</p>
        </div>
        <div>
          <strong>Intelligence</strong>
          <p>{yamlData.intelligence}</p>
        </div>
        <div>
          <strong>Wisdom</strong>
          <p>{yamlData.wisdom}</p>
        </div>
        <div>
          <strong>Charisma</strong>
          <p>{yamlData.charisma}</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [inputText, setInputText] = useState('');
  const [yamlData, setYamlData] = useState(null);

  const handleInputChange = (event) => {
    const newText = event.target.value;
    setInputText(newText);

    try {
      const parsedYaml = YAML.load(newText);
      setYamlData(parsedYaml);
    } catch (error) {
      // Gestire eventuali errori di parsing YAML
      console.error('Errore nel parsing YAML:', error);
      setYamlData(null);
    }
  };

  return (
    <div className="app-container">
      <textarea
        rows="4"
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
