
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../'

const Layout = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div className="flex-1 flex flex-col">
        <Navbar currentPage={currentPage} />
        
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
