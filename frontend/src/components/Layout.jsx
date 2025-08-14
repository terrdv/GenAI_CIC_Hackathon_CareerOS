import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../css/Layout.css';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const getCurrentPage = () => {
        if (location.pathname === '/') return 'dashboard';
        if (location.pathname === '/interview') return 'interviews';
        if (location.pathname === '/resume-analysis') return 'resume-analysis';
        if (location.pathname === '/login') return 'login';
        return 'dashboard';
    };

    const currentPage = getCurrentPage();
    const showSidebar = currentPage !== 'login';

    const handlePageChange = (pageId) => {
        if (pageId === 'dashboard') navigate('/');
        else if (pageId === 'interviews') navigate('/interview');
        else if (pageId === 'resume-analysis') navigate('/resume-analysis');
    };

    return (
        <div className="layout">
            {showSidebar && (
                <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />
            )}
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