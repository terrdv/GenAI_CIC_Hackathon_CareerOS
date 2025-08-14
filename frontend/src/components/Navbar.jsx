import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = ({ currentPage }) => {
    const navigate = useNavigate();

    const getPageTitle = (page) => {
        switch (page) {
            case 'dashboard':
                return 'Dashboard';
            case 'interviews':
                return 'Interviews';
            case 'resume-analysis':
                return 'Resume Analysis';
            case 'login':
                return 'Account';
            default:
                return 'Dashboard';
        }
    };

    const isLoginPage = currentPage === 'login';

    return (
        <div className="navbar">
            <div className="navbar-inner">
                <h2 className="navbar-title">{getPageTitle(currentPage)}</h2>
                {!isLoginPage && (
                    <button
                        type="button"
                        className="nav-login-btn"
                        onClick={() => navigate('/login')}
                        aria-label="Go to log in page"
                    >
                        Log In
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;