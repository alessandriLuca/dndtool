// Preview.js

import React from 'react';
import './YamlTool.css'; // Assicurati che il percorso del file CSS sia corretto

function Preview({ yamlData, imageUrl }) {
  return (
    <div className="preview-container">
      <div className="left-section">
        <h2 className="title">{yamlData.title}</h2>
        {imageUrl && <img src={imageUrl} alt={yamlData.title} className="character-image" />}
        <div className="character-stats">
          <h3>Stats</h3>
          <hr />
          <p><strong>Armor Class:</strong> {yamlData.armor_class}</p>
          <p><strong>Speed:</strong> {yamlData.speed}</p>
          <p><strong>Max Hit Points:</strong> {yamlData.max_hit_points}</p>
          <hr />
          <div className="attributes-container">
            {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((attr) => (
              <div key={attr} className="attribute">
                <strong>{attr.substring(0, 3).toUpperCase()}</strong>
                <p>{yamlData[attr]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Special Actions Section */}
        {yamlData.special_actions && (
          <div className="special-actions-container">
            <h3>Special Actions</h3>
            <hr />
            {yamlData.special_actions.map((category, index) => (
              <div key={index}>
                <h4>{category.category}</h4>
                {category.actions.map((action, subIndex) => (
                  <div key={subIndex} className="special-action">
                    <strong>{action.name}</strong>
                    <p>{action.description}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="right-section">
        <h3>Details</h3>
        <hr />
        <p>{yamlData.subtitle}</p>
        <p><strong>Challenge Rating:</strong> {yamlData.challenge_rating}</p>
        <p><strong>Experience Points:</strong> {yamlData.experience_points}</p>
        <hr />
        {yamlData.actions && (
          <div className="actions-container">
            <h3>Actions</h3>
            <hr />
            {yamlData.actions.map((action, index) => (
              <div key={index} className="action">
                <strong>{action.name}</strong>
                <p>{action.description}</p>
                <p><strong>Attack Bonus:</strong> {action.attack_bonus}</p>
                <p><strong>Reach:</strong> {action.reach}</p>
                <p><strong>Damage:</strong> {action.damage}</p>
              </div>
            ))}
          </div>
        )}
        {yamlData.loot && (
          <div className="loot-container">
            <h3>Loot</h3>
            <hr />
            {yamlData.loot.map((loot, index) => (
              <div key={index} className="loot">
                <strong>{loot.name}</strong>
                <p>{loot.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Preview;
