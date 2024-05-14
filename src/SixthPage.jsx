import React, { useState, useEffect } from 'react';
import './SixthPage.css';

function SixthPage() {
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState('');
  const [subraces, setSubraces] = useState([]);
  const [selectedSubrace, setSelectedSubrace] = useState('');
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
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
  const [completedCombination, setCompletedCombination] = useState(false);

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
    setCompletedCombination(false);
    // Reset bonus characteristics to base race's ability score increase
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
        Object.keys(selectedRaceData.abilityScoreIncrease).forEach(key => {
          newBonusCharacteristics[key] = selectedRaceData.abilityScoreIncrease[key];
        });
      }
      setBonusCharacteristics(newBonusCharacteristics);
    }
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

      // Eredita le caratteristiche della razza principale
      if (selectedRaceData.abilityScoreIncrease) {
        Object.keys(selectedRaceData.abilityScoreIncrease).forEach(key => {
          newBonusCharacteristics[key] = selectedRaceData.abilityScoreIncrease[key];
        });
      }

      // Applica le caratteristiche della sottorazza
      if (selectedSubraceData.abilityScoreIncrease) {
        if (!selectedSubraceData.abilityScoreIncrease.Custom) {
          Object.keys(selectedSubraceData.abilityScoreIncrease).forEach(key => {
            newBonusCharacteristics[key] += selectedSubraceData.abilityScoreIncrease[key];
          });
        } else {
          setValidCombinations(selectedSubraceData.abilityScoreIncrease.options);
          setCustomBonus(selectedSubraceData.abilityScoreIncrease.options.flat());
          setSelectedCustomBonuses(Array(6).fill(0));
          setCompletedCombination(false);
        }
      }
      setBonusCharacteristics(newBonusCharacteristics);
    }
  };

  const handleCustomBonusSelection = (index, event) => {
    const value = parseInt(event.target.value);
    const newSelectedCustomBonuses = [...selectedCustomBonuses];
    newSelectedCustomBonuses[index] = value;

    const currentSelections = newSelectedCustomBonuses.filter(val => val !== 0);
    const isComplete = validCombinations.some(combo => {
      const comboCopy = [...combo];
      currentSelections.forEach(val => {
        const idx = comboCopy.indexOf(val);
        if (idx !== -1) comboCopy.splice(idx, 1);
      });
      return comboCopy.length === 0;
    });

    setSelectedCustomBonuses(newSelectedCustomBonuses);
    setCompletedCombination(isComplete);
  };

  const getAvailableOptions = (index) => {
    if (completedCombination) return [0, selectedCustomBonuses[index]];

    const currentSelections = selectedCustomBonuses.filter(val => val !== 0);

    // Filtra le combinazioni rimanenti rimuovendo le combinazioni non possibili
    const remainingCombinations = validCombinations.filter(combo => {
      const comboCopy = [...combo];
      currentSelections.forEach(val => {
        const idx = comboCopy.indexOf(val);
        if (idx !== -1) comboCopy.splice(idx, 1);
      });
      return comboCopy.length > 0;
    });

    let availableOptions = new Set();

    // Calcola le opzioni disponibili rimanenti
    remainingCombinations.forEach(combo => {
      const comboCopy = [...combo];
      currentSelections.forEach(val => {
        const idx = comboCopy.indexOf(val);
        if (idx !== -1) comboCopy.splice(idx, 1);
      });
      comboCopy.forEach(option => availableOptions.add(option));
    });

    // Aggiungi sempre l'opzione +0
    return [0, ...Array.from(availableOptions)];
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

  return (
    <div className="sixth-page-container">
      <h1 className="character-sheet-title">Character Sheet</h1>
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
        <label htmlFor="class-select">Class:</label>
        <select
          id="class-select"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select a class</option>
          {classes.map((classItem, index) => (
            <option key={index} value={classItem}>
              {classItem}
            </option>
          ))}
        </select>
      </div>
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
                disabled={customBonus.length === 0}
              >
                {getAvailableOptions(index).map((option, i) => (
                  <option key={i} value={option}>{`+${option}`}</option>
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
      <div className="buttons">
        <button onClick={rollDice}>Roll for Characteristics</button>
      </div>
    </div>
  );
}

export default SixthPage;
