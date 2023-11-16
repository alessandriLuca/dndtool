import React, { useState, useEffect } from 'react';
import './SecondPage.css';

function SecondPage() {
  const [headers, setHeaders] = useState([]);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    loadDefaultDatabase();
  }, []);

  const loadDefaultDatabase = async () => {
    try {
      const response = await fetch('./database.txt');
      if (!response.ok) {
        throw new Error('Unable to load the default database');
      }
      const text = await response.text();
      processDatabaseText(text);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRandomItem = () => {
    if (items.length === 0) {
      setError('No items available in the database');
      return;
    }

    // Genera un numero casuale per selezionare un elemento casuale dall'array degli oggetti
    const randomIndex = Math.floor(Math.random() * items.length);
    const selectedItem = items[randomIndex];
    setCurrentItem(selectedItem);
  };

  const handleCustomDatabaseUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        processDatabaseText(text);
      };
      reader.readAsText(file);
    }
  };

  const processDatabaseText = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      setError('File is empty or not valid');
      return;
    }

    const newHeaders = lines[0].split('|');
    if (newHeaders.length < 2) {
      setError('File format is not valid. Make sure the file is "|" separated.');
      return;
    }

    const newItems = lines.slice(1).map(line => {
      const values = line.split('|');
      const item = {};
      newHeaders.forEach((header, index) => {
        item[header] = values[index];
      });
      return item;
    });

    setHeaders(newHeaders);
    setItems(newItems);
    setCurrentItem({}); // Resetta l'oggetto corrente
    setError('');
  };

  return (
    <div>
      <div className="button-container">
        <button onClick={handleRandomItem}>Random Item</button>
        <button onClick={loadDefaultDatabase}>Default Database</button>
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
        {error && <div className="error-message">{error}</div>}
      </div>
      <div className="table-container">
        {headers.length > 0 && Object.keys(currentItem).length > 0 && (
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
                {headers.map((header, index) => (
                  <td key={`item-${index}`}>{currentItem[header]}</td>
                ))}
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SecondPage;
