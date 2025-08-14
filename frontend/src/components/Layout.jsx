
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../css/Layout.css';

const Layout = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="layout">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div className="layout-main">
        <Navbar currentPage={currentPage} />
        
        <div className="layout-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
