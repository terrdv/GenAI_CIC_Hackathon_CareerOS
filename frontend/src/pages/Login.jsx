import React, { useState } from 'react';

const styles = {
    container: {
        minHeight: '100vh',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Segoe UI, Arial, sans-serif',
    },
    header: {
        fontSize: 40,
        fontWeight: 800,
        color: '#000DFF',
        margin: '48px 0 32px 64px',
        letterSpacing: 2,
        fontFamily: 'Segoe UI, Arial, sans-serif',
    },
    center: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        padding: 40,
        width: 400,
        maxWidth: '90vw',
        transition: 'box-shadow 0.2s',
    },
    tabs: {
        display: 'flex',
        marginBottom: 32,
        gap: 12,
        justifyContent: 'center',
    },
    tab: isActive => ({
        flex: 1,
        padding: '14px 0',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 18,
        color: isActive ? '#fff' : '#000DFF',
        background: isActive
            ? 'linear-gradient(90deg, #6B73FF 0%, #000DFF 100%)'
            : '#f2f6ff',
        border: 'none',
        borderRadius: 12,
        boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
        outline: 'none',
        transition: 'background 0.2s, color 0.2s',
    }),
    formGroup: {
        marginBottom: 20,
    },
    label: {
        display: 'block',
        marginBottom: 8,
        fontWeight: 500,
        color: '#333',
        fontSize: 15,
    },

    input: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px 14px',
        borderRadius: 8,
        border: '1px solid #ddd',
        fontSize: 16,
        marginTop: 2,
        outline: 'none',
        transition: 'border-color 0.2s',
        background: '#f7f9fc',
    },
    button: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '14px',
        borderRadius: 8,
        border: 'none',
        background: 'linear-gradient(90deg, #6B73FF 0%, #000DFF 100%)',
        color: '#fff',
        fontWeight: 700,
        fontSize: 17,
        cursor: 'pointer',
        marginTop: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'background 0.2s',
    },
};

export default function Login() {
    const [activeTab, setActiveTab] = useState('login');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupName, setSignupName] = useState('');

    return (
        <div style={styles.container}>
            <div style={styles.header}>CareerOS</div>
            <div style={styles.center}>
                <div style={styles.card}>
                    <div style={styles.tabs}>
                        <button
                            style={styles.tab(activeTab === 'login')}
                            onClick={() => setActiveTab('login')}
                        >
                            Log In
                        </button>
                        <button
                            style={styles.tab(activeTab === 'signup')}
                            onClick={() => setActiveTab('signup')}
                        >
                            Sign Up
                        </button>
                    </div>
                    {activeTab === 'login' ? (
                        <form>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="loginEmail">Email</label>
                                <input
                                    style={styles.input}
                                    id="loginEmail"
                                    type="email"
                                    value={loginEmail}
                                    onChange={e => setLoginEmail(e.target.value)}
                                    required
                                    autoComplete="username"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="loginPassword">Password</label>
                                <input
                                    style={styles.input}
                                    id="loginPassword"
                                    type="password"
                                    value={loginPassword}
                                    onChange={e => setLoginPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                            <button style={styles.button} type="submit">Log In</button>
                        </form>
                    ) : (
                        <form>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="signupName">Name</label>
                                <input
                                    style={styles.input}
                                    id="signupName"
                                    type="text"
                                    value={signupName}
                                    onChange={e => setSignupName(e.target.value)}
                                    required
                                    autoComplete="name"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="signupEmail">Email</label>
                                <input
                                    style={styles.input}
                                    id="signupEmail"
                                    type="email"
                                    value={signupEmail}
                                    onChange={e => setSignupEmail(e.target.value)}
                                    required
                                    autoComplete="username"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="signupPassword">Password</label>
                                <input
                                    style={styles.input}
                                    id="signupPassword"
                                    type="password"
                                    value={signupPassword}
                                    onChange={e => setSignupPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                            <button style={styles.button} type="submit">Sign Up</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}