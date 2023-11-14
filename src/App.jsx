import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import YAML from 'js-yaml';
import html2canvas from 'html2canvas';
import ClipboardJS from 'clipboard';
import copy from 'copy-to-clipboard';

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

const handleCopyToClipboard = () => {
  fetch('./header.txt')
    .then((response) => response.text())
    .then((headerText) => {
      const textWithHeader = headerText + '\n' + additionalText;

      copy(textWithHeader); // Usa copy-to-clipboard per copiare il testo
      console.log('Testo copiato nella clipboard con successo:', textWithHeader);

      openChatGPTWindow(); // Chiamata per aprire una nuova scheda
    })
    .catch((error) => {
      console.error('Error reading header.txt or copying to clipboard:', error);
    });
};

const openChatGPTWindow = () => {
  const windowReference = window.open(); // Apri prima una nuova finestra
  windowReference.location = "https://chat.openai.com/chat"; // Imposta l'URL su ChatGPT
};


 return (
    <div className="app-container">
      <div className="section">
        <div className="section-title">YAML Generation</div>
        <div className="additional-text-container">
          <textarea
            rows="8"
            placeholder="Write here what kind of entity you want to create click on Copy to Clipboard and then visit chatgpt and just paste (i know, you didn't copy anything but that was the Copy to Clipboard job). Press enter and let chatgpt do the job. Copy the YAML provided by chatgpt and paste it in the input box below. An example of what you can write here is 'a character that fights using his hairs.' "
            value={additionalText}
            onChange={(e) => setAdditionalText(e.target.value)}
            className="additional-text-input"
          />
        </div>
        <button onClick={handleCopyToClipboard} className="custom-file-upload">
          Copy to Clipboard
        </button>
      </div>

      <div className="section">
        <div className="section-title">YAML to Picture</div>
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
