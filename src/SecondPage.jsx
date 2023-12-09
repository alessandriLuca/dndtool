import React, { useState, useEffect } from 'react';
import './SecondPage.css';
import { useAppContext } from './AppContext'; // Importa il contesto

function SecondPage() {
  const { data, updateData } = useAppContext(); // Accedi al contesto
  const characters = data.characters || [];
  const [headers, setHeaders] = useState([]);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rarity, setRarity] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState('');

const handleAddItemToCharacter = () => {
  if (!selectedCharacter || !currentItem.Name) {
    showMessage('Please select both a character and an item','error');
    return;
  }

  const updatedCharacters = characters.map(char => {
    if (char.name === selectedCharacter) {
      const equipmentItems = char.equipment.split('\n'); // Dividi per riga
      const nextItemNumber = equipmentItems.length + 1; // Calcola il prossimo numero

      const newEquipmentItem = `${nextItemNumber}) ${currentItem.Name}`;
      const newEquipment = char.equipment
        ? `${char.equipment}\n${newEquipmentItem}` // Aggiungi con un ritorno a capo se c'è già dell'equipaggiamento
        : newEquipmentItem; // Altrimenti, inizia la lista dell'equipaggiamento

      return { ...char, equipment: newEquipment };
    }
    return char;
  });

  updateData({ ...data, characters: updatedCharacters });
      showMessage('', 'Item added to Character '+selectedCharacter);
};





useEffect(() => {
  if (characters.length === 1) {
    setSelectedCharacter(characters[0].name);
  }
}, [characters]);


  useEffect(() => {
    loadDefaultDatabase();
  }, []);

  const showMessage = (error, success) => {
    setError(error);
    setSuccessMessage(success);
  };

  const loadDefaultDatabase = async () => {
    showMessage('', '');
    try {
      const response = await fetch('./database.txt');
      if (!response.ok) {
        throw new Error('Unable to load the default database');
      }
      const text = await response.text();
      processDatabaseText(text);
      showMessage('', 'Default database loaded successfully!');
    } catch (err) {
      showMessage(err.message, '');
    }
  };

const handleMagicDatasetLoad = async () => {
    try {
      const response = await fetch('./magicDataset.txt'); // Assicurati che il percorso sia corretto
      if (!response.ok) {
        throw new Error('Unable to load the magic dataset');
      }
      const text = await response.text();
      processDatabaseText(text);
    } catch (error) {
      setError(error.message);
    }
  };



  const handleRandomItem = () => {
    showMessage('', '');
    if (items.length === 0) {
      showMessage('No items available in the database', '');
      return;
    }
    const rarityValue = parseInt(rarity);
    if (rarityValue >= 1 && rarityValue <= 20) {
      const filteredItems = items.filter(item => parseInt(item.Rarity) === rarityValue);
      if (filteredItems.length === 0) {
        showMessage(`No items with rarity ${rarityValue}`, '');
        return;
      }
      const randomIndex = Math.floor(Math.random() * filteredItems.length);
      setCurrentItem(filteredItems[randomIndex]);
    } else {
      const randomIndex = Math.floor(Math.random() * items.length);
      setCurrentItem(items[randomIndex]);
    }
    showMessage('', 'Random item selected successfully!');
  };

  const handleCustomDatabaseUpload = async (event) => {
    showMessage('', '');
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        processDatabaseText(text);
      };
      reader.onerror = (err) => {
        showMessage(err.message, '');
      };
      reader.readAsText(file);
    }
  };

  const processDatabaseText = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      showMessage('File is empty or not valid', '');
      return;
    }

    const newHeaders = lines[0].split('|');
    if (newHeaders.length < 2) {
      showMessage('File format is not valid. Make sure the file is "|" separated.', '');
      return;
    }

    const newItems = lines.slice(1).map(line => {
      const values = line.split('|');
      return newHeaders.reduce((item, header, index) => {
        item[header] = values[index] || '';
        return item;
      }, {});
    });

    setHeaders(newHeaders);
    setItems(newItems);
    setCurrentItem({});
    showMessage('', 'Database processed successfully!');
  };

  const handleRarityChange = (event) => {
    const value = event.target.value;
    setRarity(value);
  };

  return (
    <div>
      <div className="button-container">
        <button onClick={handleRandomItem}>Random Item</button>
        <button onClick={loadDefaultDatabase}>Common Database</button>
        <button onClick={handleMagicDatasetLoad}>Load Magic Database</button> {/* Aggiunto il nuovo bottone */}
        <label htmlFor="file-upload" className="custom-file-upload">
          Load Custom Database
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleCustomDatabaseUpload}
          accept=".txt"
          style={{ display: 'none' }}
        />
      <div className="fancy-input-container">
  <label htmlFor="rarity-input" className="fancy-label">Rarity:</label>
  <input
    id="rarity-input"
    type="number"
    value={rarity}
    onChange={handleRarityChange}
    min="0"
    max="20"
    step="1"
    className="fancy-input"
  />
</div>
      </div>
<div className="select-container">
  <label htmlFor="character-select" className="select-label">Choose a character:</label>
  <div className="select-wrapper">
    <select
      id="character-select"
      className="select-box"
      onChange={e => setSelectedCharacter(e.target.value)}
    >
      {characters.map((char, index) => (
        <option key={index} value={char.name}>{char.name}</option>
      ))}
    </select>
    <button className="plus-button" onClick={handleAddItemToCharacter}>+</button>
  </div>
</div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {headers.length > 0 && Object.keys(currentItem).length > 0 && (

        <div className="table-container">
          <table>
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={`header-${index}`}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {headers.map((header) => (
                  <td key={`item-${header}`}>{currentItem[header]}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SecondPage;
