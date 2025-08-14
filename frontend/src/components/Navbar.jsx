import React from 'react';
import '../css/Navbar.css';

const Navbar = ({ currentPage }) => {
  const getPageTitle = (page) => {
    switch (page) {
      case 'dashboard':
        return 'Dashboard';
      case 'interviews':
        return 'Interviews';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="navbar">
      <h2 className="navbar-title">{getPageTitle(currentPage)}</h2>
    </div>
  );
};

export default Navbar;