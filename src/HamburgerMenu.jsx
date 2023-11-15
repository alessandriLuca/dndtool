import React from 'react';
import './HamburgerMenu.css'; // Assicurati di creare questo file CSS

const HamburgerMenu = () => {
  return (
    <button className="hamburger-menu">
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
    </button>
  );
};

export default HamburgerMenu;

