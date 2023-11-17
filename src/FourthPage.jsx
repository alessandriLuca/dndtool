import React, { useState, useRef } from 'react';
import YAML from 'js-yaml';
import './FourthPage.css'; // Assicurati che il percorso del file CSS sia corretto

function FourthPage() {
  const [characters, setCharacters] = useState([]);
  const fileInputRef = useRef(null);

  const addNewCharacter = () => {
    setCharacters([...characters, {
      name: '',
      class: '',
      race: '',
      stats: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
      },
      passivePerception: 0,
      armorClass: 0,
      hitPoints: 0,
      equipment: '1) '
    }]);
  };
const clearCharacters = () => {
    setCharacters([]); // Resetta l'elenco dei personaggi
  };
  const handleCharacterChange = (index, field, value) => {
    const updatedCharacters = [...characters];
    if (field.includes('.')) {
      const [statsField, stat] = field.split('.');
      updatedCharacters[index][statsField][stat] = parseInt(value, 10);
    } else {
      updatedCharacters[index][field] = value;
    }
    setCharacters(updatedCharacters);
  };

  const handleEquipmentChange = (index, value) => {
    const updatedCharacters = [...characters];
    updatedCharacters[index].equipment = value;
    setCharacters(updatedCharacters);
  };

  const handleEquipmentKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const textarea = e.target;
      const value = textarea.value;
      const caretPos = textarea.selectionStart;
      const textBeforeCaret = value.substring(0, caretPos);
      const textAfterCaret = value.substring(caretPos);
      const lines = textBeforeCaret.split('\n');
      const newItemNumber = lines.length + 1;
      const newValue = `${textBeforeCaret}\n${newItemNumber}) ${textAfterCaret}`;
      handleEquipmentChange(index, newValue);

      // Aggiorna la posizione del cursore dopo l'aggiunta del numero
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = caretPos + newItemNumber.toString().length + 3;
      }, 0);
    }
  };

  const downloadYaml = () => {
    const yamlContent = YAML.dump({ characters });
    const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'characters.yaml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const uploadYaml = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const chars = YAML.load(e.target.result);
        setCharacters(chars.characters);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fourth-page">
      <div className="button-container">
        <button onClick={addNewCharacter}>Add Character</button>
        <button onClick={downloadYaml}>Download YAML</button>
        <button onClick={() => fileInputRef.current.click()}>Upload YAML File</button>
        <button onClick={clearCharacters}>Clear Characters</button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={uploadYaml}
          style={{ display: 'none' }}
        />
      </div>      <div className="characters-container">
        {characters.map((char, index) => (
          <div key={index} className="character-card">
              <label>
              Name: <input type="text" value={char.name} onChange={(e) => handleCharacterChange(index, 'name', e.target.value)} />
            </label>
            <label>
              Class: <input type="text" value={char.class} onChange={(e) => handleCharacterChange(index, 'class', e.target.value)} />
            </label>
            <label>
              Race: <input type="text" value={char.race} onChange={(e) => handleCharacterChange(index, 'race', e.target.value)} />
            </label>
            <div className="stats-grid">
              <div className="stat">
                <label htmlFor={`str-${index}`}>STR</label>
                <input id={`str-${index}`} type="number" value={char.stats.strength} /* ... */ />
              </div>
              <div className="stat">
                <label htmlFor={`dex-${index}`}>DEX</label>
                <input id={`dex-${index}`} type="number" value={char.stats.dexterity} /* ... */ />
              </div>
              <div className="stat">
                <label htmlFor={`con-${index}`}>CON</label>
                <input id={`con-${index}`} type="number" value={char.stats.constitution} /* ... */ />
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat">
                <label htmlFor={`int-${index}`}>INT</label>
                <input id={`int-${index}`} type="number" value={char.stats.intelligence} /* ... */ />
              </div>
              <div className="stat">
                <label htmlFor={`wis-${index}`}>WIS</label>
                <input id={`wis-${index}`} type="number" value={char.stats.wisdom} /* ... */ />
              </div>
              <div className="stat">
                <label htmlFor={`cha-${index}`}>CHA</label>
                <input id={`cha-${index}`} type="number" value={char.stats.charisma} /* ... */ />
              </div>
            </div>
                        <div className="stats-grid">
                        <div className="stat">
                        <label htmlFor={`int-${index}`}>AC</label>
                        <input id={`int-${index}`} type="number" value={char.armorClass} /* ... */ />
                        </div>
                         <div className="stat">
                        <label htmlFor={`int-${index}`}>HP</label>
                        <input id={`int-${index}`} type="number" value={char.hitPoints} /* ... */ />
                        </div>
                        <div className="stat">
                        <label htmlFor={`int-${index}`}>Passive Perception</label>
                        <input id={`int-${index}`} type="number" value={char.passivePerception} /* ... */ />
                        </div>
                        </div>
                        <div className="stat">
                        <label htmlFor={`int-${index}`}>Equipment</label>
                        <textarea
                value={char.equipment}
                onChange={(e) => handleEquipmentChange(index, e.target.value)}
                onKeyDown={(e) => handleEquipmentKeyDown(e, index)}
                placeholder="List equipment here..."
                rows={5}
              />
                        </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default FourthPage;
