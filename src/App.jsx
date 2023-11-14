import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import YAML from 'js-yaml';
import html2canvas from 'html2canvas';
import ClipboardJS from 'clipboard';

import { defaultYaml } from './character.js';
import Preview from './Preview';

function App() {
  const [inputText, setInputText] = useState(defaultYaml);
  const [yamlData, setYamlData] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [usingDefaultImage, setUsingDefaultImage] = useState(true); // Stato per tracciare l'uso dell'immagine predefinita
  const [additionalText, setAdditionalText] = useState(''); // Aggiunto stato per il testo aggiuntivo
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
  // Usa la funzione replace() per rimuovere gli spazi
  const titleFromYaml = (yamlData.title || 'title').replace(/\s+/g, '');

  if (element) {
    html2canvas(element, {
      onclone: (document) => {
        document.querySelector('.preview-container').style.transform = 'none';
      },
    }).then((canvas) => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${titleFromYaml}.png`; // Il titolo del file ora non avrà spazi
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
};

const handleCopyToClipboardAndOpen = () => {
  fetch('./header.txt')
    .then((response) => response.text())
    .then((headerText) => {
      const textWithHeader = headerText + '\n' + additionalText;

      navigator.clipboard.writeText(textWithHeader)
        .then(() => {
          console.log('Testo copiato nella clipboard con successo:', textWithHeader);
          openChatGPT(); // Apri ChatGPT dopo la copia
        })
        .catch((error) => {
          console.error('Errore nella copia nella clipboard:', error);
        });
    })
    .catch((error) => {
      console.error('Error reading header.txt:', error);
    });
};

const openChatGPT = () => {
  const chatGPTURL = "https://chat.openai.com/chat"; // Sostituisci con l'URL corretto di ChatGPT
  window.open(chatGPTURL, '_blank');
};
 return (
    <div className="app-container">
      <div className="section">
        <div className="section-title">Create Your Entity</div>
        <div className="additional-text-container">
          <textarea
            rows="8"
            placeholder="Write here what kind of entity you want to create..."
            value={additionalText}
            onChange={(e) => setAdditionalText(e.target.value)}
            className="additional-text-input"
          />
        </div>
          <button onClick={handleCopyToClipboardAndOpen} className="custom-file-upload">
            Copy to Clipboard
          </button>
      </div>

      <div className="section">
        <div className="section-title">YAML Configuration</div>
        <div className="text-input-container">
          <textarea
            rows="16"
            placeholder="Insert YAML text here..."
            value={inputText}
            onChange={handleInputChange}
            className="text-input"
          />
        </div>
        <div className="button-group">
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
        </div>
      </div>

      <div className="section">
        <div className="section-title">Preview and Download</div>
        {yamlData && (
          <div ref={previewRef} className="preview-container">
            <Preview yamlData={yamlData} imageUrl={usingDefaultImage ? './larry.png' : imageUrl} />
          </div>
        )}
        <button onClick={handleDownloadAsPng} className="custom-file-upload">
          Download Preview as PNG
        </button>
      </div>
    </div>
  );
}


export default App;
