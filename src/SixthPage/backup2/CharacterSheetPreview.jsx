import React, { useState, useEffect } from 'react';
import './CharacterSheetPreview.css';
import Papa from 'papaparse';

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

const parseLanguagesCSV = async (csvFilePath) => {
  const response = await fetch(csvFilePath);
  const csvText = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};

const CharacterSheetPreview = ({ characteristics, characterName, characterImage, classLevels, skillProficiencies, savingThrowProficiencies, speed, raceTraits, selectedLanguages }) => {
  const proficiencyBonus = getProficiencyBonus(classLevels.reduce((acc, cl) => acc + cl.level, 0));

  const calculateSkillValues = () => {
    const totalCharacteristics = characteristics.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});

    return skills.map(skill => ({
      name: skill.name,
      attribute: skill.attribute,
      value: calculateModifier(totalCharacteristics[skill.attribute]) + (skillProficiencies.includes(skill.name) ? proficiencyBonus : 0),
      proficient: skillProficiencies.includes(skill.name)
    }));
  };

  const skillValues = calculateSkillValues();

  const savingThrowValues = characteristics.map(({ name, value }) => ({
    name,
    value: calculateModifier(value) + (savingThrowProficiencies.includes(name) ? proficiencyBonus : 0),
    proficient: savingThrowProficiencies.includes(name)
  }));

  return (
    <div className="character-sheet-preview">
      <h2>Character Sheet Preview</h2>
      {characterName && <h3>{characterName}</h3>}
      {classLevels.map((classLevel, index) => (
        <h4 key={index}>Class: {classLevel.class} (Level {classLevel.level})</h4>
      ))}
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
            {savingThrowValues.map(({ name, value, proficient }) => (
              <div key={name} className="saving-throw-item">
                <div className="saving-throw-circle">{proficient && 'P'}</div>
                <div className="saving-throw-value">{value >= 0 ? '+' : ''}{value}</div>
                <div className="saving-throw-name">{name}</div>
              </div>
            ))}
          </div>
          <div className="skills">
            <h3>Skills</h3>
            {skillValues.map(({ name, value, attribute, proficient }) => (
              <div key={name} className="skill-item">
                <div className="skill-circle">{proficient && 'P'}</div>
                <div className="skill-value">{value >= 0 ? '+' : ''}{value}</div>
                <div className="skill-name">
                  {name} <span className="skill-attribute">({attribute})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="speed-traits-column">
          <div className="speed-box">
            <div className="speed-title">Speed</div>
            <div className="speed-value">{speed} ft</div>
          </div>
          <div className="traits-box">
            <div className="traits-title">Race Traits</div>
            <div className="traits-list">
              {raceTraits.map((trait, index) => (
                <div key={index} className="trait-item">{trait}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="languages">
        <h3>Languages</h3>
        {selectedLanguages.map((language, index) => (
          <div key={index} className="language">
            <span>{language}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSheetPreview;
