import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import YamlTool from './YamlTool';
import SecondPage from './SecondPage';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="hamburger" onClick={toggleMenu}>
            <span>☰</span>
          </div>
          <ul className={isMenuOpen ? "nav-links showNav" : "nav-links"}>
            <li><Link to="/dndTool/yamlTool" onClick={toggleMenu}>Yaml To Character Sheet</Link></li>
            <li><Link to="/dndTool/secondPage" onClick={toggleMenu}>Seconda Pagina</Link></li>
          </ul>
        </nav>
        <main>
          <Routes>
            <Route path="/dndTool/yamlTool" element={<YamlTool />} />
            <Route path="/dndTool/secondPage" element={<SecondPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
