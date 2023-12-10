import React, { useState, useRef } from 'react';
import './WildSurgeLookup.css';

function WildSurgeLookup() {
  const [dataset, setDataset] = useState([]);
  const [highlight, setHighlight] = useState('');
  const [randomPickResult, setRandomPickResult] = useState('');
  const highlightInputRef = useRef(null);
  const targetRowRef = useRef(null);

  const loadDataset = (filePath) => {
    fetch(filePath)
      .then((response) => response.text())
      .then(parseData)
      .then((data) => setDataset(data))
      .catch((error) => console.error('Error loading dataset:', error));
  };

  const handleCustomFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const parsedData = parseData(content);
      if (parsedData) {
        setDataset(parsedData);
      } else {
        alert('Invalid file format.');
      }
    };

    reader.readAsText(file);
  };

  const parseData = (data) => {
    const rows = data.split('\n').filter((row) => row.trim());
    rows.shift(); // Rimuove l'intestazione

    const separator = detectSeparator(data);
    if (!separator) {
      alert('Invalid separator. The data must be separated by comma, tab, or pipe.');
      return [];
    }

    const parsedRows = rows.map((row, index) => {
      const columns = row.split(separator).map((col) => col.trim());
      return Object.fromEntries(columns.map((col, index) => [index === 0 ? 'number' : `column${index}`, col]));
    });

    return parsedRows;
  };

  const detectSeparator = (data) => {
    const rows = data.split('\n').filter((row) => row.trim());
    rows.shift(); // Rimuove l'intestazione
    const separators = ['\t', '|', ','];

    for (const separator of separators) {
      const isSeparatorValid = rows.every((row) => {
        const columns = row.split(separator).map((col) => col.trim());
        return !isNaN(columns[0]);
      });

      if (isSeparatorValid) {
        return separator;
      }
    }

    return null; // Nessun separatore valido trovato
  };

  const handleHighlightChange = (event) => {
    setHighlight(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      scrollToHighlightedRow();
    }
  };

  const scrollToHighlightedRow = () => {
    const targetNumber = highlightInputRef.current.value;
    const targetRow = dataset.find((item) => item.number === targetNumber);

    if (targetRow) {
      setHighlight(targetNumber); // Evidenzia la riga
      targetRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

const predefinedColors = [
  '#333',      // Nero (colonna dei numeri)
  '#007bff',   // Blu
  '#ff9900',   // Arancione
  '#4caf50',   // Verde
  '#ff5722',   // Rosso
  '#2196f3',   // Blu
  '#ff4081',   // Rosa
  '#795548',   // Marrone
  '#9c27b0',   // Viola
  '#ffc107',   // Giallo
  '#00bcd4',   // Turchese
  '#673ab7',   // Indaco
  '#f44336',   // Rosso
];


const handleRandomPick = () => {
  const randomIndex = Math.floor(Math.random() * dataset.length);
  const randomItem = dataset[randomIndex];

  if (randomItem) {
    const randomResult = columnHeaders.map((header, index) => {
      const color = index < predefinedColors.length ? predefinedColors[index] : getRandomColor();
      const columnValue = header === 'number' ? randomItem[header] : randomItem[`column${index}`];
      return (
        <span key={header} style={{ color }}>
          {`${header}: ${columnValue}`} &nbsp; {/* Aggiungi uno spazio tra le colonne */}
        </span>
      );
    });

    setRandomPickResult(randomResult);
    setHighlight(randomItem.number); // Evidenzia la riga
  } else {
    setRandomPickResult('No data available.'); // Gestisci il caso in cui non ci siano dati nel dataset
  }
};






  const columnHeaders = dataset.length > 0 ? Object.keys(dataset[0]) : [];

  return (
<div className="wild-surge-container">
  <h1 className="wild-surge-title">Wild Surge Lookup</h1>
  <div className="button-container">
    <button className="wild-surge-button" onClick={() => loadDataset('wildSurge/wildSurgeClassic.tsv')}>Standard Dataset DND 5E PH</button>
    <button className="wild-surge-button" onClick={() => loadDataset('wildSurge/unheartArcana.csv')}>Unearthed Arcana</button>
    <button className="wild-surge-button" onClick={() => loadDataset('wildSurge/surgeTablethreeway.csv')}>DND wiki homebrew page</button>
    <label htmlFor="file-upload" className="wild-surge-button">
      Load Custom Dataset
    </label>
    <input id="file-upload" type="file" onChange={handleCustomFileChange} accept=".csv" style={{ display: 'none' }} />
    <button className="random-pick-button" onClick={handleRandomPick}>Random Pick</button>
  </div>
  <div>
    <input
      type="number"
      id="wild-surge-input"
      placeholder="Enter number to highlight"
      value={highlight}
      onChange={handleHighlightChange}
      onKeyPress={handleKeyPress}
      ref={highlightInputRef}
    />
    <div className="random-pick-result" style={{ color: 'green' }}>
      Random Pick Result: {randomPickResult}
    </div>
  </div>
  <table className="wild-surge-table">
    <thead>
      <tr>
        {columnHeaders.map((header) => (
          <th key={header}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {dataset.map((item, index) => (
        <tr
          key={index}
          className={item.number === highlight ? 'highlight' : ''}
          ref={(ref) => {
            if (item.number === highlight) {
              targetRowRef.current = ref;
            }
          }}
        >
          {columnHeaders.map((header) => (
            <td key={header}>{item[header]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>



  );
}

export default WildSurgeLookup;
