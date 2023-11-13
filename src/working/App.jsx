import React, { useState, useEffect } from 'react';
import './App.css';
import YAML from 'js-yaml';
import html2pdf from 'html2pdf.js';

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
charisma: 8 (-1)

actions:
  - name: Scimitar
    description: "Slashes with a sharp scimitar."
    attack_bonus: +4
    reach: "5 ft."
    damage: "5 (1d6 + 2) slashing damage."

  - name: Shortbow
    description: "Shoots a shortbow arrow."
    attack_bonus: +4
    range: "80/320 ft."
    damage: "5 (1d6 + 2) piercing damage."

loot:
  - name: Gold Pouch
    description: "A small pouch containing 10 gold pieces."
  - name: Rusty Key
    description: "An old key with a rusty appearance."
`;

function Preview({ yamlData, imageUrl }) {
  return (
    <div className="preview-container">
      <div className="image-title-container">
        <h2>{yamlData.title}</h2>
        {imageUrl && <img src={imageUrl} alt={yamlData.title} />}
      </div>
      <div className="info-container">
        <p>{yamlData.subtitle}</p>
        <p><strong>Challenge Rating:</strong> {yamlData.challenge_rating}</p>
        <p><strong>Experience Points:</strong> {yamlData.experience_points}</p>
        <p><strong>Armor Class:</strong> {yamlData.armor_class}</p>
        <p><strong>Speed:</strong> {yamlData.speed}</p>
        <p><strong>Max Hit Points:</strong> {yamlData.max_hit_points}</p>

        <div className="attributes-container">
          <div className="attribute">
            <div className="attribute-name"><strong>Strength</strong></div>
            <div className="attribute-value">{yamlData.strength}</div>
          </div>
          <div className="attribute">
            <div className="attribute-name"><strong>Dexterity</strong></div>
            <div className="attribute-value">{yamlData.dexterity}</div>
          </div>
          <div className="attribute">
            <div className="attribute-name"><strong>Constitution</strong></div>
            <div className="attribute-value">{yamlData.constitution}</div>
          </div>
          <div className="attribute">
            <div className="attribute-name"><strong>Intelligence</strong></div>
            <div className="attribute-value">{yamlData.intelligence}</div>
          </div>
          <div className="attribute">
            <div className="attribute-name"><strong>Wisdom</strong></div>
            <div className="attribute-value">{yamlData.wisdom}</div>
          </div>
          <div className="attribute">
            <div className="attribute-name"><strong>Charisma</strong></div>
            <div className="attribute-value">{yamlData.charisma}</div>
          </div>
        </div>
      </div>

      {yamlData.actions && (
        <div className="actions-container">
          <h3>Actions</h3>
          {yamlData.actions.map((action, index) => (
            <div key={index} className="action">
              <p><strong>{action.name}</strong></p>
              <p>{action.description}</p>
              <p><strong>Attack Bonus:</strong> {action.attack_bonus}</p>
              <p><strong>Reach:</strong> {action.reach}</p>
              <p><strong>Damage:</strong> {action.damage}</p>
              {index < yamlData.actions.length - 1 && <hr />}
            </div>
          ))}
        </div>
      )}

      {yamlData.loot && (
        <div className="loot-container">
          <h3>Loot</h3>
          {yamlData.loot.map((loot, index) => (
            <div key={index} className="loot">
              <p><strong>{loot.name}</strong></p>
              <p>{loot.description}</p>
              {index < yamlData.loot.length - 1 && <hr />}
            </div>
          ))}
        </div>
      )}
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
