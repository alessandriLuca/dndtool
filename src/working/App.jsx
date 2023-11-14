import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import YAML from 'js-yaml';
import html2canvas from 'html2canvas';

import { defaultYaml } from './character.js';

// Ora puoi utilizzare defaultYaml nei tuoi componenti React
//console.log(defaultYaml);

import Preview from './Preview'; // Importa il componente Preview



function App() {
  const [inputText, setInputText] = useState(defaultYaml);
  const [yamlData, setYamlData] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const previewRef = useRef(null);

  useEffect(() => {
    try {
      const parsedYaml = YAML.load(defaultYaml);
      setYamlData(parsedYaml);
    } catch (error) {
      console.error('Error parsing YAML:', error);
      setYamlData({});
    }
  }, []);

  const handleInputChange = (event) => {
    const newText = event.target.value;
    setInputText(newText);
    try {
      const parsedYaml = YAML.load(newText);
      setYamlData(parsedYaml);
    } catch (error) {
      console.error('Error parsing YAML:', error);
      setYamlData({});
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    }
  };

const handleDownloadAsPng = () => {
  const element = previewRef.current; // Reference to the preview container
  if (element) {
    html2canvas(element, {
      onclone: (document) => {
        document.querySelector('.preview-container').style.transform = 'none';
      },
    }).then((canvas) => {
      // Create a data URL
      const image = canvas.toDataURL('image/png');
      // Create a link to download the image
      const link = document.createElement('a');
      link.href = image;
      link.download = 'preview.png';
      // Append to the DOM, click it, and then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
};

  return (
    <div className="app-container">
      <div className="text-input-container">
        <textarea
          rows="16"
          placeholder="Insert YAML text here..."
          value={inputText}
          onChange={handleInputChange}
          className="text-input"
        />
      </div>
      <div className="input-container">
        <label htmlFor="file-upload" className="custom-file-upload">
          Upload Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      <button onClick={handleDownloadAsPng} className="custom-button">
        Download Preview as PNG
      </button>
      </div>
      {yamlData && (
        <div ref={previewRef} className="preview-container">
          <Preview yamlData={yamlData} imageUrl={imageUrl} />
        </div>
      )}
    </div>
  );
}

export default App;
