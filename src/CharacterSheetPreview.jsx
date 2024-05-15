import React from 'react';
import './CharacterSheetPreview.css';

const calculateModifier = (score) => {
  return Math.floor((score - 10) / 2);
};

const CharacterSheetPreview = ({ characteristics, characterName, characterImage }) => {
  return (
    <div className="character-sheet-preview">
      <h2>Character Sheet Preview</h2>
      {characterName && <h3>{characterName}</h3>}
      {characterImage && <img src={characterImage} alt="Character" className="character-image" />}
      <div className="preview-grid">
        {characteristics.map(({ name, value }, index) => (
          <div key={name} className="preview-item">
            <div className="preview-rectangle">
              <div className="preview-name">{name}</div>
              <div className="preview-modifier">
                {calculateModifier(value) >= 0 ? '+' : ''}{calculateModifier(value)}
              </div>
              <div className="preview-circle">
                <div className="preview-total">{value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSheetPreview;
