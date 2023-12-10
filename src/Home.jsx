import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  useEffect(() => {
    const menuButton = document.querySelector('.hamburger');
    if (menuButton) {
      menuButton.click();
    }
  }, []);

  return (
    <div className="sixth-page-container">
      <h1 className="wild-surge-title">Tool Guide</h1>
      <p>This web application is designed to enhance your role-playing game (RPG) experience. Below is a guide to our features:</p>

      <div className="feature-section">
        <Link to="/yamlTool"><h2>Create Monster & NPC</h2></Link>
        <img src="path-to-your-gif/create-monster-npc.gif" alt="Create Monster & NPC" className="feature-gif"/>
        <p>Transform your YAML data into detailed character sheets for NPCs and monsters. This tool simplifies the creation process, allowing you to focus more on your game's story and less on paperwork.</p>
      </div>

      <div className="feature-section">
        <Link to="/itemDatabaseGen"><h2>Database Generator</h2></Link>
        <img src="path-to-your-gif/database-generator.gif" alt="Database Generator" className="feature-gif"/>
        <p>Create, customize, and manage databases for items, spells, and more. This powerful tool supports your game's expanding universe by organizing all your essential elements in one place.</p>
      </div>

      <div className="feature-section">
        <Link to="/itemManager"><h2>Loot & Spell Randomizer</h2></Link>
        <img src="path-to-your-gif/loot-spell-randomizer.gif" alt="Loot & Spell Randomizer" className="feature-gif"/>
        <p>Add excitement to your gameplay with random loot and spell draws. This feature keeps the game unpredictable and thrilling, offering new surprises for each session.</p>
      </div>

      <div className="feature-section">
        <Link to="/CharacterManager"><h2>Character Manager</h2></Link>
        <img src="path-to-your-gif/character-manager.gif" alt="Character Manager" className="feature-gif"/>
        <p>Efficiently manage your characters' profiles, including their stats, inventory, and progress. This tool makes tracking character development easy and accessible.</p>
      </div>

      <div className="feature-section">
        <Link to="/checker"><h2>Item/Spell Lookup</h2></Link>
        <img src="path-to-your-gif/item-spell-lookup.gif" alt="Item/Spell Lookup" className="feature-gif"/>
        <p>Quickly find detailed information about specific items or spells. Ideal for on-the-fly checks during gameplay, ensuring a smooth and informed gaming experience.</p>
      </div>

      <p>Use the navigation menu to access these features and start enhancing your RPG experience today!</p>
    </div>
  );
}

export default Home;
