import React, { useState, useEffect, useRef } from 'react';
import YAML from 'js-yaml';
import html2canvas from 'html2canvas';
import copy from 'copy-to-clipboard';
import { defaultYaml } from './character.js';
import Preview from './Preview';
import './YamlTool.css'; // Assicurati che il percorso del file CSS sia corretto

function YamlTool() {
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
const handleClearText = () => {
  setInputText(''); // Imposta lo stato inputText su una stringa vuota
  setYamlData({});  // Imposta lo stato yamlData su un oggetto vuoto se desideri ripulire anche l'anteprima
};

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
      setUsingDefaultImage(false); // L'utente ha caricato un'immagine personalizzata
    }
  };

const handleDownloadAsJpg = () => {
  const element = previewRef.current;
  const titleFromYaml = (yamlData.title || 'title').replace(/\s+/g, '');

  if (element) {
    html2canvas(element, {
      onclone: (document) => {
        document.querySelector('.preview-container').style.transform = 'none';
      },
    }).then((canvas) => {
      const pngDataUrl = canvas.toDataURL('image/png');
      convertPngToJpg(pngDataUrl, titleFromYaml);
    });
  }
};

const convertPngToJpg = (pngDataUrl, titleFromYaml) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = pngDataUrl;

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Converti l'immagine in formato JPG
    const jpgDataUrl = canvas.toDataURL('image/jpeg');

    // Crea un link per il download dell'immagine JPG
    const link = document.createElement('a');
    link.href = jpgDataUrl;
    link.download = `${titleFromYaml}.jpg`;

    // Aggiungi il link al documento e fai clic su di esso per avviare il download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
};


const handlePasteClipboard = () => {
  navigator.clipboard.readText()
    .then(text => {
      setInputText(text); // Aggiorna lo stato con il testo appena copiato
      try {
        const parsedYaml = YAML.load(text); // Prova a fare il parse del testo come YAML
        setYamlData(parsedYaml); // Aggiorna lo stato dei dati YAML
      } catch (error) {
        console.error('Error parsing YAML:', error);
        // Qui puoi decidere se vuoi mostrare un messaggio di errore all'utente
      }
    })
    .catch(error => {
      console.error('Failed to read clipboard contents:', error);
      // Qui puoi decidere se vuoi mostrare un messaggio di errore all'utente
    });
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
    <h1 className="wild-surge-title">Create Monster & NPC</h1>
      <div className="section">
        <div className="section-title">YAML Generation</div>
        <div className="additional-text-container">
          <textarea
            rows="8"
            placeholder="This step is optional if you already have a yaml file or if you want to manually modify the yaml file in the next session. Write here what kind of entity you want to create click on Copy to Clipboard and then visit chatgpt and just paste (i know, you didn't copy anything but that was the Copy to Clipboard job). Press enter and let chatgpt do the job. Copy the YAML provided by chatgpt and paste it in the input box below. An example of what you can write here is 'a character that fights using his hairs.' "
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
  <div className="section-title">YAML to Character sheet</div>
  <div className="text-input-container">
    <textarea
      rows="16"
      placeholder="Insert YAML text here..."
      value={inputText}
      onChange={handleInputChange}
      className="text-input"
    />
  </div>
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
  <button onClick={handlePasteClipboard} className="custom-file-upload">
    Paste Clipboard
  </button>
  <button onClick={handleClearText} className="custom-file-upload">
    Clear Text
  </button>
</div>

      <div className="section">
        <div className="section-title">Preview and Download</div>
        {yamlData && (
          <div ref={previewRef} className="preview-container">
            <Preview yamlData={yamlData} imageUrl={usingDefaultImage ? './larry.png' : imageUrl} />
          </div>
        )}
        <button onClick={handleDownloadAsJpg} className="custom-file-upload">
          Download Preview as JPG
        </button>
      </div>
    </div>
  );



}
export default YamlTool;
