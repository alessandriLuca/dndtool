import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import YAML from 'js-yaml';
import html2canvas from 'html2canvas';

import { defaultYaml } from './character.js';
import Preview from './Preview';

function App() {
  const [inputText, setInputText] = useState(defaultYaml);
  const [yamlData, setYamlData] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [usingDefaultImage, setUsingDefaultImage] = useState(true); // Stato per tracciare l'uso dell'immagine predefinita
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
      setUsingDefaultImage(false); // L'utente ha caricato un'immagine personalizzata
    }
  };

  const handleDownloadAsPng = () => {
    const element = previewRef.current;
    if (element) {
      html2canvas(element, {
        onclone: (document) => {
          document.querySelector('.preview-container').style.transform = 'none';
        },
      }).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'preview.png';
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
          <Preview yamlData={yamlData} imageUrl={usingDefaultImage ? './larry.png' : imageUrl} />
        </div>
      )}
    </div>
  );
}

export default App;
