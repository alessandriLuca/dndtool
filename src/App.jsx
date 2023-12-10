import React, { useState } from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppContextProvider } from './AppContext'; // Importa il tuo provider
import YamlTool from './YamlTool';
import SecondPage from './SecondPage';
import ThirdPage from './ThirdPage';
import FourthPage from './FourthPage';
import FifthPage from './FifthPage';
import Home from './Home';
import WildSurgeLookup from './WildSurgeLookup';
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="App">
        <AppContextProvider> {/* Avvolgi la tua App con il provider del contesto */}
          <nav className="navbar">
            <div className="hamburger" onClick={toggleMenu}>
              <span>☰</span>
            </div>
            <ul className={isMenuOpen ? "nav-links showNav" : "nav-links"}>
              {/* Aggiorna i Link per usare i percorsi relativi */}
              <li><Link to="/Home" onClick={toggleMenu}>Home</Link></li>
              <li><Link to="/yamlTool" onClick={toggleMenu}>Create Monster & NPC</Link></li>
              <li><Link to="/itemDatabaseGen" onClick={toggleMenu}>Database Generator</Link></li>
              <li><Link to="/itemManager" onClick={toggleMenu}>Loot & Spell Randomizer</Link></li>
              <li><Link to="/CharacterManager" onClick={toggleMenu}>Character Manager</Link></li>
              <li><Link to="/checker" onClick={toggleMenu}>Item/Spell Lookup</Link></li>
              <li><Link to="/WildSurgeLookup" onClick={toggleMenu}>Wild Surge Lookup</Link></li>

            </ul>
          </nav>
          <main>
            <Routes>
              {/* Le Route per le tue pagine */}
              <Route path="/yamlTool" element={<YamlTool />} />
              <Route path="/itemDatabaseGen" element={<ThirdPage />} />
              <Route path="/itemManager" element={<SecondPage />} />
              <Route path="/CharacterManager" element={<FourthPage />} />
              <Route path="/checker" element={<FifthPage />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/WildSurgeLookup" element={<WildSurgeLookup />} />
              {/* Rotta di default che reindirizza a /yamlTool se l'URL è solo #/ */}
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
        </AppContextProvider> {/* Chiudi il provider del contesto */}
      </div>
    </Router>
  );
}

export default App;
