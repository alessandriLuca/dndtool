import React, { useState, useEffect } from 'react';
import './SixthPage.css';
import { initializeCombinations, recalculateValidCombinations, isCombinationComplete, getAvailableOptions } from './bonusLogic';
import CharacterSheetPreview from './CharacterSheetPreview';

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

function SixthPage() {
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState('');
  const [subraces, setSubraces] = useState([]);
  const [selectedSubrace, setSelectedSubrace] = useState('');
  const [classes, setClasses] = useState([]);
  const [classLevels, setClassLevels] = useState([]);
  const [baseCharacteristics, setBaseCharacteristics] = useState({
    Strength: 0,
    Dexterity: 0,
    Constitution: 0,
    Intelligence: 0,
    Wisdom: 0,
    Charisma: 0,
  });
  const [bonusCharacteristics, setBonusCharacteristics] = useState({
    Strength: 0,
    Dexterity: 0,
    Constitution: 0,
    Intelligence: 0,
    Wisdom: 0,
    Charisma: 0,
  });
  const [customBonus, setCustomBonus] = useState([]);
  const [selectedCustomBonuses, setSelectedCustomBonuses] = useState(Array(6).fill(0));
  const [validCombinations, setValidCombinations] = useState([]);
  const [originalCombinations, setOriginalCombinations] = useState([]);
  const [completedCombination, setCompletedCombination] = useState(false);
  const [characterName, setCharacterName] = useState('');
  const [characterImage, setCharacterImage] = useState('');
  const [skillProficiencies, setSkillProficiencies] = useState([]);
  const [savingThrowProficiencies, setSavingThrowProficiencies] = useState([]);
  const [speed, setSpeed] = useState(30); // Default speed
  const [raceTraits, setRaceTraits] = useState([]);

  useEffect(() => {
    const fetchRaces = async () => {
      const response = await fetch('./races.json');
      const data = await response.json();
      setRaces(data.races);
    };

    const fetchClasses = async () => {
      const response = await fetch('./classes.json');
      const data = await response.json();
      setClasses(data.classes);
    };

    fetchRaces();
    fetchClasses();
  }, []);

  const handleRaceChange = (event) => {
    const race = event.target.value;
    setSelectedRace(race);
    const selectedRaceData = races.find(r => r.name === race);
    setSubraces(selectedRaceData ? selectedRaceData.subraces || [] : []);
    setSelectedSubrace('');
    setCustomBonus([]);
    setSelectedCustomBonuses(Array(6).fill(0));
    setValidCombinations([]);
    setOriginalCombinations([]);
    setCompletedCombination(false);
    setSkillProficiencies(selectedRaceData.skillP || []);
    setSavingThrowProficiencies(selectedRaceData.savThrowP || []);
    setSpeed(selectedRaceData.Speed || 30); // Default speed

    let raceTraits = selectedRaceData.traits || [];

    if (selectedRaceData) {
      let newBonusCharacteristics = {
        Strength: 0,
        Dexterity: 0,
        Constitution: 0,
        Intelligence: 0,
        Wisdom: 0,
        Charisma: 0,
      };

      if (selectedRaceData.abilityScoreIncrease) {
        if (!selectedRaceData.abilityScoreIncrease.Custom) {
          Object.keys(selectedRaceData.abilityScoreIncrease).forEach(key => {
            newBonusCharacteristics[key] = selectedRaceData.abilityScoreIncrease[key];
          });
        } else {
          let combinations = selectedRaceData.abilityScoreIncrease.options;
          // Ensure combinations is an array of arrays
          if (!Array.isArray(combinations[0])) {
            combinations = [combinations];
          }
          setValidCombinations(initializeCombinations(combinations));
          setOriginalCombinations(initializeCombinations(combinations));
          setCustomBonus(combinations.flat());
          setSelectedCustomBonuses(Array(6).fill(0));
          setCompletedCombination(false);
        }
      }

      setBonusCharacteristics(newBonusCharacteristics);
    }
    setRaceTraits(raceTraits);
  };

  const handleSubraceChange = (event) => {
    const subrace = event.target.value;
    setSelectedSubrace(subrace);
    const selectedRaceData = races.find(r => r.name === selectedRace);
    const selectedSubraceData = subraces.find(sr => sr.name === subrace);

    if (selectedSubraceData) {
      let newBonusCharacteristics = {
        Strength: 0,
        Dexterity: 0,
        Constitution: 0,
        Intelligence: 0,
        Wisdom: 0,
        Charisma: 0,
      };

      if (selectedRaceData.abilityScoreIncrease) {
        Object.keys(selectedRaceData.abilityScoreIncrease).forEach(key => {
          newBonusCharacteristics[key] = selectedRaceData.abilityScoreIncrease[key];
        });
      }

      if (selectedSubraceData.abilityScoreIncrease) {
        if (!selectedSubraceData.abilityScoreIncrease.Custom) {
          Object.keys(selectedSubraceData.abilityScoreIncrease).forEach(key => {
            newBonusCharacteristics[key] += selectedSubraceData.abilityScoreIncrease[key];
          });
          setCustomBonus([]);
          setSelectedCustomBonuses(Array(6).fill(0));
          setValidCombinations([]);
          setOriginalCombinations([]);
          setCompletedCombination(false);
        } else {
          let combinations = selectedSubraceData.abilityScoreIncrease.options;
          // Ensure combinations is an array of arrays
          if (!Array.isArray(combinations[0])) {
            combinations = [combinations];
          }
          setValidCombinations(initializeCombinations(combinations));
          setOriginalCombinations(initializeCombinations(combinations));
          setCustomBonus(combinations.flat());
          setSelectedCustomBonuses(Array(6).fill(0));
          setCompletedCombination(false);
        }
      }
      setBonusCharacteristics(newBonusCharacteristics);
      setSkillProficiencies(selectedSubraceData.skillP || []);
      setSavingThrowProficiencies(selectedSubraceData.savThrowP || []);
      setSpeed(selectedSubraceData.Speed || selectedRaceData.Speed || 30); // Default speed

      const raceTraits = [...(selectedRaceData.traits || []), ...(selectedSubraceData.traits || [])];
      setRaceTraits(raceTraits);
    }
  };

  const handleCustomBonusSelection = (index, event) => {
    const value = parseInt(event.target.value);
    const newSelectedCustomBonuses = [...selectedCustomBonuses];
    newSelectedCustomBonuses[index] = value;

    console.log(`Selezionato ${value} per ${Object.keys(baseCharacteristics)[index]}`);

    if (value === 0) {
      const tempCombos = recalculateValidCombinations(originalCombinations, newSelectedCustomBonuses);
      setValidCombinations(tempCombos);
    } else {
      const tempCombos = recalculateValidCombinations(originalCombinations, newSelectedCustomBonuses);
      const isComplete = isCombinationComplete(tempCombos);

      setValidCombinations(tempCombos);
      setCompletedCombination(isComplete);
    }

    setSelectedCustomBonuses(newSelectedCustomBonuses);
  };

  const handleResetBonuses = () => {
    setSelectedCustomBonuses(Array(6).fill(0));
    setValidCombinations(initializeCombinations(originalCombinations));
    setCompletedCombination(false);
  };

  const handleNameChange = (event) => {
    setCharacterName(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setCharacterImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleClassLevelChange = (index, field, value) => {
    const newClassLevels = [...classLevels];
    newClassLevels[index] = { ...newClassLevels[index], [field]: value };
    setClassLevels(newClassLevels);
  };

  const addClassLevel = () => {
    setClassLevels([...classLevels, { class: '', level: 1 }]);
  };

  const removeClassLevel = (index) => {
    const newClassLevels = classLevels.filter((_, i) => i !== index);
    setClassLevels(newClassLevels);
  };

  const getTotalLevel = () => {
    return classLevels.reduce((total, classLevel) => total + classLevel.level, 0);
  };

  const getOptionsForSelect = (index) => {
    return getAvailableOptions(originalCombinations, selectedCustomBonuses);
  };

  const getCombinationDescription = () => {
    const uniqueCombinations = [...new Set(originalCombinations.map(JSON.stringify))].map(JSON.parse);
    return uniqueCombinations.map(combo => {
      if (combo.length === 2 && combo.includes(2) && combo.includes(1)) {
        return "Increase one ability score by 2 and increase a different one by 1.";
      }
      if (combo.length === 3 && combo.every(val => val === 1)) { // Fixed here
        return "Increase three different scores by 1.";
      }
      return "";
    }).join(" or ");
  };

  const rollDice = () => {
    const rollFourDice = () => {
      let rolls = [];
      for (let i = 0; i < 4; i++) {
        rolls.push(Math.floor(Math.random() * 6) + 1);
      }
      rolls.sort((a, b) => b - a);
      return rolls.slice(0, 3).reduce((a, b) => a + b, 0);
    };

    setBaseCharacteristics({
      Strength: rollFourDice(),
      Dexterity: rollFourDice(),
      Constitution: rollFourDice(),
      Intelligence: rollFourDice(),
      Wisdom: rollFourDice(),
      Charisma: rollFourDice(),
    });
  };

  const handleBaseCharacteristicChange = (event) => {
    const { name, value } = event.target;
    setBaseCharacteristics({
      ...baseCharacteristics,
      [name]: parseInt(value),
    });
  };

  const getTotalCharacteristics = () => {
    let totalCharacteristics = {};
    for (let key of Object.keys(baseCharacteristics)) {
      totalCharacteristics[key] =
        baseCharacteristics[key] +
        bonusCharacteristics[key] +
        (selectedCustomBonuses[Object.keys(baseCharacteristics).indexOf(key)] || 0);
    }
    return totalCharacteristics;
  };

  const totalCharacteristics = getTotalCharacteristics();
  const characteristics = [
    { name: 'Strength', value: totalCharacteristics.Strength },
    { name: 'Dexterity', value: totalCharacteristics.Dexterity },
    { name: 'Constitution', value: totalCharacteristics.Constitution },
    { name: 'Intelligence', value: totalCharacteristics.Intelligence },
    { name: 'Wisdom', value: totalCharacteristics.Wisdom },
    { name: 'Charisma', value: totalCharacteristics.Charisma }
  ];

  return (
    <div className="sixth-page-container">
      <h1 className="character-sheet-title">Character Sheet</h1>
      <div className="form-group">
        <label htmlFor="name-input">Character Name:</label>
        <input
          id="name-input"
          type="text"
          value={characterName}
          onChange={handleNameChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="race-select">Race:</label>
        <select
          id="race-select"
          value={selectedRace}
          onChange={handleRaceChange}
        >
          <option value="">Select a race</option>
          {races.map((race, index) => (
            <option key={index} value={race.name}>
              {race.name}
            </option>
          ))}
        </select>
      </div>
      {subraces.length > 0 && (
        <div className="form-group">
          <label htmlFor="subrace-select">Subrace:</label>
          <select
            id="subrace-select"
            value={selectedSubrace}
            onChange={handleSubraceChange}
          >
            <option value="">Select a subrace</option>
            {subraces.map((subrace, index) => (
              <option key={index} value={subrace.name}>
                {subrace.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="form-group">
        <label htmlFor="image-upload">Character Image:</label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
      <div className="form-group">
        <button onClick={addClassLevel} disabled={getTotalLevel() >= 20}>Add Class</button>
      </div>
      {classLevels.map((classLevel, index) => (
        <div className="form-group class-level-row" key={index}>
          <label htmlFor={`class-select-${index}`}>Class:</label>
          <select
            id={`class-select-${index}`}
            value={classLevel.class}
            onChange={(e) => handleClassLevelChange(index, 'class', e.target.value)}
          >
            <option value="">Select a class</option>
            {classes.map((classItem, idx) => (
              <option key={idx} value={classItem} disabled={classLevels.some(cl => cl.class === classItem)}>
                {classItem}
              </option>
            ))}
          </select>
          <label htmlFor={`level-select-${index}`}>Level:</label>
          <select
            id={`level-select-${index}`}
            value={classLevel.level}
            onChange={(e) => handleClassLevelChange(index, 'level', parseInt(e.target.value))}
          >
            {Array.from({ length: 20 - getTotalLevel() + classLevel.level }, (_, i) => i + 1).map(lvl => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
          <button onClick={() => removeClassLevel(index)}>Remove</button>
        </div>
      ))}
      <div className="characteristics-grid">
        <div className="label"></div>
        <div className="label">Increase</div>
        <div className="label">Base</div>
        <div className="label">Bonus</div>
        <div className="label">Total</div>
        {Object.keys(baseCharacteristics).map((key, index) => (
          <React.Fragment key={key}>
            <div className="label">{key}</div>
            <div className="custom-bonus-selector">
              <select
                value={selectedCustomBonuses[index]}
                onChange={(e) => handleCustomBonusSelection(index, e)}
                disabled={customBonus.length === 0 || completedCombination}
                style={{
                  backgroundColor: (customBonus.length === 0 || completedCombination) ? '#e0e0e0' : (selectedCustomBonuses[index] !== 0 ? '#b3d4fc' : '#fff'),
                  color: (customBonus.length === 0 || completedCombination) ? '#a0a0a0' : '#000'
                }}
              >
                <option value={selectedCustomBonuses[index]}>
                  {selectedCustomBonuses[index] !== 0 ? `+${selectedCustomBonuses[index]} selected` : 'Select'}
                </option>
                {getOptionsForSelect(index).map((option, i) => (
                  option !== selectedCustomBonuses[index] && <option key={i} value={option}>{`+${option}`}</option>
                ))}
              </select>
            </div>
            <input
              className="characteristic-input"
              type="number"
              name={key}
              value={baseCharacteristics[key]}
              onChange={handleBaseCharacteristicChange}
            />
            <input
              className="characteristic-input"
              type="number"
              name={`${key}-bonus`}
              value={bonusCharacteristics[key] + (selectedCustomBonuses[index] || 0)}
              readOnly
            />
            <input
              className="characteristic-input"
              type="number"
              name={`${key}-total`}
              value={totalCharacteristics[key]}
              readOnly
            />
          </React.Fragment>
        ))}
      </div>
      <div className="combination-description">
        {getCombinationDescription()}
      </div>
      <div className="buttons">
        <button onClick={rollDice}>Roll for Characteristics</button>
        <button onClick={handleResetBonuses}>Reset Bonuses</button>
      </div>
      <CharacterSheetPreview
        characteristics={characteristics}
        characterName={characterName}
        characterImage={characterImage}
        classLevels={classLevels}
        skillProficiencies={skillProficiencies}
        savingThrowProficiencies={savingThrowProficiencies}
        speed={speed}
        raceTraits={raceTraits}
      />
    </div>
  );
}

export default SixthPage;
