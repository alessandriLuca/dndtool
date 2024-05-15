import React from 'react';
import './CharacterSheetPreview.css';

const calculateModifier = (score) => {
  return Math.floor((score - 10) / 2);
};

const getProficiencyBonus = (level) => {
  if (level >= 1 && level <= 4) return 2;
  if (level >= 5 && level <= 8) return 3;
  if (level >= 9 && level <= 12) return 4;
  if (level >= 13 && level <= 16) return 5;
  if (level >= 17 && level <= 20) return 6;
  return 2;
};

const skills = [
  { name: 'Acrobatics', attribute: 'Dexterity' },
  { name: 'Animal Handling', attribute: 'Wisdom' },
  { name: 'Arcana', attribute: 'Intelligence' },
  { name: 'Athletics', attribute: 'Strength' },
  { name: 'Deception', attribute: 'Charisma' },
  { name: 'History', attribute: 'Intelligence' },
  { name: 'Insight', attribute: 'Wisdom' },
  { name: 'Intimidation', attribute: 'Charisma' },
  { name: 'Investigation', attribute: 'Intelligence' },
  { name: 'Medicine', attribute: 'Wisdom' },
  { name: 'Nature', attribute: 'Intelligence' },
  { name: 'Perception', attribute: 'Wisdom' },
  { name: 'Performance', attribute: 'Charisma' },
  { name: 'Persuasion', attribute: 'Charisma' },
  { name: 'Religion', attribute: 'Intelligence' },
  { name: 'Sleight of Hand', attribute: 'Dexterity' },
  { name: 'Stealth', attribute: 'Dexterity' },
  { name: 'Survival', attribute: 'Wisdom' },
];

const CharacterSheetPreview = ({ characteristics, characterName, characterImage, level, selectedClass }) => {
  const proficiencyBonus = getProficiencyBonus(level);

  const calculateSkillValues = () => {
    const totalCharacteristics = characteristics.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});

    return skills.map(skill => ({
      name: skill.name,
      attribute: skill.attribute,
      value: calculateModifier(totalCharacteristics[skill.attribute]),
    }));
  };

  const skillValues = calculateSkillValues();

  return (
    <div className="character-sheet-preview">
      <h2>Character Sheet Preview</h2>
      {characterName && <h3>{characterName}</h3>}
      {selectedClass && <h4>Class: {selectedClass}</h4>}
      {characterImage && <img src={characterImage} alt="Character" className="character-image" />}
      <div className="preview-columns">
        <div className="characteristics-column">
          {characteristics.map(({ name, value }) => (
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
        <div className="saves-skills-column">
          <div className="proficiency-bonus">
            <h3>Proficiency Bonus</h3>
            <div className="proficiency-circle">
              <div className="proficiency-value">{proficiencyBonus >= 0 ? '+' : ''}{proficiencyBonus}</div>
            </div>
          </div>
          <div className="saving-throws">
            <h3>Saving Throws</h3>
            {characteristics.map(({ name, value }) => (
              <div key={name} className="saving-throw-item">
                <div className="saving-throw-circle"></div>
                <div className="saving-throw-value">{calculateModifier(value) >= 0 ? '+' : ''}{calculateModifier(value)}</div>
                <div className="saving-throw-name">{name}</div>
              </div>
            ))}
          </div>
          <div className="skills">
            <h3>Skills</h3>
            {skillValues.map(({ name, value, attribute }) => (
              <div key={name} className="skill-item">
                <div className="skill-circle"></div>
                <div className="skill-value">{value >= 0 ? '+' : ''}{value}</div>
                <div className="skill-name">
                  {name} <span className="skill-attribute">({attribute})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheetPreview;
