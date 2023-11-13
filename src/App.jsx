import React, { useState, useEffect } from 'react';
import './App.css';
import YAML from 'js-yaml';

const defaultYaml = `title: Goblin
subtitle: Small humanoid (goblinoid), neutral evil
challenge_rating: 1/4
experience_points: 50
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
        <p>Challenge Rating: {yamlData.challenge_rating}</p>
        <p>Experience Points: {yamlData.experience_points}</p>
                <p>Armor class: {yamlData.armor_class}</p>
        <p>Speed: {yamlData.speed}</p>
        <p>Max hit points: {yamlData.max_hit_points}</p>

        <div className="attributes-container">
          <div className="attribute">
            <div className="attribute-name">Strength</div>
            <div className="attribute-value">{yamlData.strength}</div>
          </div>
          <div className="attribute">
            <div className="attribute-name">Dexterity</div>
            <div className="attribute-value">{yamlData.dexterity}</div>
          </div>
          <div className="attribute">
            <div className="attribute-name">Constitution</div>
            <div className="attribute-value">{yamlData.constitution}</div>
          </div>
          <div className="attribute">
            <div className="attribute-name">Intelligence</div>
            <div className="attribute-value">{yamlData.intelligence}</div>
          </div>
          <div className="attribute">
            <div className="attribute-name">Wisdom</div>
            <div className="attribute-value">{yamlData.wisdom}</div>
          </div>
          <div className="attribute">
            <div className="attribute-name">Charisma</div>
            <div className="attribute-value">{yamlData.charisma}</div>
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
      <div className="text-input-container">
        <textarea
          rows="16"
          placeholder="Inserisci del testo YAML qui..."
          value={inputText}
          onChange={handleInputChange}
          className="text-input"
        />
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="image-input"
      />
      {yamlData && imageUrl && (
        <div className="preview-container background-container">
          <Preview yamlData={yamlData} imageUrl={imageUrl} />
        </div>
      )}
    </div>
  );
}
export default App;
