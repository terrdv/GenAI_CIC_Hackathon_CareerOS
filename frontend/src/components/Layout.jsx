
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../css/Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract current page from URL path
  const getCurrentPage = () => {
    if (location.pathname === '/') return 'dashboard';
    if (location.pathname === '/interview') return 'interviews';
    if (location.pathname === '/resume-analysis') return 'resume-analysis';
    return 'dashboard';
  };

  const currentPage = getCurrentPage();

  const handlePageChange = (pageId) => {
    if (pageId === 'dashboard') {
      navigate('/');
    } else if (pageId === 'interviews') {
      navigate('/interview');
    } else if (pageId === 'resume-analysis') {
      navigate('/resume-analysis');
    }
  };

  return (
    <div className="layout">
      <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />
      
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
