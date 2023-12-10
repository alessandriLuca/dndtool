import React, { useState, useEffect } from 'react';
import './FifthPage.css'; // Assicurati di avere questo file CSS per stilizzare la tua quinta pagina

function FifthPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const magicDatasetHeaders = ["Name", "Price", "Rarity", "Description"];

  useEffect(() => {
    // Carica i dati dai database quando la pagina viene caricata
    loadDatabaseFiles();
  }, []);

  const loadDatabaseFiles = async () => {
    try {
      const [magicDatasetResponse, databaseResponse] = await Promise.all([
        fetch('./magicDataset.txt'),
        fetch('./database.txt')
      ]);

      if (!magicDatasetResponse.ok || !databaseResponse.ok) {
        throw new Error('Unable to load one or more database files');
      }

      const magicDatasetText = await magicDatasetResponse.text();
      const databaseText = await databaseResponse.text();

      // Unisci i dati dai due database
      const combinedItems = [...parseDatabaseText(magicDatasetText), ...parseDatabaseText(databaseText)];

      setAllItems(combinedItems);
    } catch (error) {
      console.error('Error loading database files:', error);
    }
  };

  const parseDatabaseText = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      return [];
    }
    return lines.slice(1).map(line => {
      const values = line.split('|');
      return magicDatasetHeaders.reduce((item, header, index) => {
        item[header] = values[index] || '';
        return item;
      }, {});
    });
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.trim() === '') {
      setSearchResults([]);
    } else if (value.trim().length >= 3) {
      // Esegui la ricerca solo se il termine di ricerca ha almeno 3 caratteri
      handleSearch(value);
    }
  };

  const handleSearch = (term) => {
    const results = allItems.filter(item =>
      Object.values(item).some(value =>
        value.toLowerCase().includes(term.toLowerCase())
      )
    );
    setSearchResults(results);
  };

  return (
    <div className="fifth-page-container">
      <h1 className="wild-surge-title">Item/Spell Lookup</h1>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      {searchResults.length > 0 ? (
        <table className="search-results-table">
          <thead>
            <tr>
              {magicDatasetHeaders.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {searchResults.map((item, index) => (
              <tr key={index}>
                {magicDatasetHeaders.map((header, subIndex) => (
                  <td key={subIndex}>{item[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        searchTerm && <div className="no-results">No results found</div>
      )}
    </div>
  );
}

export default FifthPage;
