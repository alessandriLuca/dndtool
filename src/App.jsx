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

function Preview({ yamlData, imageUrl }) {
  return (
    <div className="preview-container">
      <div className="image-title-container">
        <h2>{yamlData.title}</h2>
        {imageUrl && <img src={imageUrl} alt={yamlData.title} />}
      </div>
      <div className="info-container">
        <p>{yamlData.subtitle}</p>
        <p>Artist: {yamlData.artist}</p>
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
    </div>
  );
}





function App() {
  const [inputText, setInputText] = useState(defaultYaml);
  const [yamlData, setYamlData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    }
  };

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
        rows="16"
        placeholder="Inserisci del testo YAML qui..."
        value={inputText}
        onChange={handleInputChange}
        className="text-input"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="image-input"
      />
      {yamlData && (
        <div className="preview-container background-container">
          <Preview yamlData={yamlData} imageUrl={imageUrl} />
        </div>
      )}
      {/* Aggiungi il div per il logo fuori dalla preview */}
      <div className="logo-container">
        <img src="./assets/logo.png" alt="Logo" />
      </div>
    </div>
  );
}

export default App;
