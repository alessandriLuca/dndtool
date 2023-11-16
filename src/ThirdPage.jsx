import React, { useState } from 'react';
import copy from 'copy-to-clipboard';

function ThirdPage() {
  const [inputText1, setInputText1] = useState('');
  const [inputText2, setInputText2] = useState('');

  const handleCopyAndOpenChat = () => {
    // Copia il testo nell'input text 1 nella clipboard

    // Recupera il contenuto di head.txt
    fetch('./head.txt')
      .then((response) => response.text())
      .then((headText) => {
        // Combina il testo copiato e il contenuto di head.txt
        const textWithHeader = headText + '\n' + inputText1;
          copy(textWithHeader);

        // Apri ChatGPT con il testo combinato
        openChatGPTWindow();
      })
      .catch((error) => {
        console.error('Error reading head.txt or copying to clipboard:', error);
      });
  };

  const handleDownloadText = () => {
    // Crea un oggetto Blob con il contenuto dell'input text 2
    const blob = new Blob([inputText2], { type: 'text/plain' });

    // Crea un URL temporaneo per il Blob
    const url = window.URL.createObjectURL(blob);

    // Crea un elemento <a> per il download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'text.txt'; // Nome del file da scaricare

    // Simula un clic sull'elemento <a> per avviare il download
    link.click();

    // Rilascia l'URL temporaneo
    window.URL.revokeObjectURL(url);
  };

  const openChatGPTWindow = (text) => {
    // Apri una nuova finestra per ChatGPT
    const windowReference = window.open('https://chat.openai.com/chat', '_blank');
    if (windowReference) {
      // Attendi che la finestra si carichi completamente
      windowReference.onload = () => {
        // Inserisci il testo in ChatGPT
        windowReference.postMessage({ text }, '*');
      };
    } else {
      console.error('Error opening ChatGPT window');
    }
  };

  return (
    <div className="third-page">
      <div className="section">
        <div className="section-title">Copy Text and Open ChatGPT</div>
        <textarea
          rows="8"
          placeholder="Enter text to copy and open ChatGPT"
          value={inputText1}
          onChange={(e) => setInputText1(e.target.value)}
          className="text-input"
        />
        <button onClick={handleCopyAndOpenChat} className="custom-file-upload">
          Copy and Open ChatGPT
        </button>
      </div>

      <div className="section">
        <div className="section-title">Download Text as File</div>
        <textarea
          rows="8"
          placeholder="Enter text to download as a file"
          value={inputText2}
          onChange={(e) => setInputText2(e.target.value)}
          className="text-input"
        />
        <button onClick={handleDownloadText} className="custom-file-upload">
          Download as Text File
        </button>
      </div>
    </div>
  );
}

export default ThirdPage;
