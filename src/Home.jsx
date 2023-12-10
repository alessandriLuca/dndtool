import React, { useEffect } from 'react';
import { AppContextProvider } from './AppContext';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  useEffect(() => {
    // Quando la pagina Home viene montata, apri il menu
    const menuButton = document.querySelector('.hamburger');
    if (menuButton) {
      menuButton.click();
    }
  }, []);

  return (
<div>
      <h1>Welcome to Our RPG Management Website</h1>
      <p>
        This is a multifunctional web application designed to help you manage various aspects of your role-playing game (RPG) experience.
      </p>
      <p>
        Explore the features and functionalities of our website:
      </p>
      <ul>
        <li>
          <strong>YAML Tool:</strong> Convert YAML data into character sheets for your RPG adventures.
        </li>
        <li>
          <strong>Item Database Generator:</strong> Create and manage item databases for your game.
        </li>
        <li>
          <strong>Item Manager:</strong> Organize your inventory of items efficiently.
        </li>
        <li>
          <strong>Character Manager:</strong> Create, update, and manage your RPG characters.
        </li>
        <li>
          <strong>Checker:</strong> Verify the validity of items and spells in your game.
        </li>
      </ul>
      <p>
        Use the navigation menu to access these features and start enhancing your RPG experience today!
      </p>
    </div>
  );
}

export default Home;
