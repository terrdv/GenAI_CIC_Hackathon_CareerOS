import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import { supabase } from '../supabase';

const Navbar = ({ currentPage }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && user.user_metadata && user.user_metadata.name) {
                setUserName(user.user_metadata.name);
            } else if (user && user.email) {
                setUserName(user.email);
            } else {
                setUserName(null);
            }
        };
        getUser();
        // Listen for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange(() => {
            getUser();
        });
        return () => {
            listener?.subscription?.unsubscribe();
        };
    }, []);

    const getPageTitle = (page) => {
        switch (page) {
            case 'dashboard': return 'Dashboard';
            case 'interviews': return 'Interviews';
            case 'resume-analysis': return 'Resume Analysis';
            case 'login': return 'Account';
            default: return 'Dashboard';
        }
    };

    const isLoginPage = currentPage === 'login';

    return (
        <div className="navbar">
            <div className="navbar-inner">
                <h2 className="navbar-title">{getPageTitle(currentPage)}</h2>
                {!isLoginPage && (
                    userName ? (
                        <div>
                            <span className="nav-user">Logged in as {userName}</span>
                            <button
                                type="button"
                                className="nav-login-btn"
                                onClick={async () => {
                                    await supabase.auth.signOut();
                                    setUserName(null);
                                    navigate('/login');
                                }}
                                aria-label="Log out"
                            >
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="nav-login-btn"
                            onClick={() => navigate('/login')}
                            aria-label="Go to log in page"
                        >
                            Log In
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default Navbar;