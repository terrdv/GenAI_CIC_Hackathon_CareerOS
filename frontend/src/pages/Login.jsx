import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Dashboard.css';
import '../css/Login.css';

const Input = React.memo(function Input({ id, label, ...rest }) {
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input id={id} {...rest} className="form-input" />
        </div>
    );
});

export default function Login() {
    const [mode, setMode] = useState('login');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const heading = mode === 'login' ? 'Log In' : 'Create Account';

    return (
        <div className="dashboard-container max-w-2xl mx-auto fade-in">
            <div className="auth-card animate-pop">
                <h2 className="auth-heading">{heading}</h2>

                {mode === 'login' ? (
                    <form className="space-y-5">
                        <Input
                            id="loginEmail"
                            label="Email"
                            type="email"
                            autoComplete="username"
                            value={loginEmail}
                            onChange={e => setLoginEmail(e.target.value)}
                            required
                        />
                        <div className="form-group">
                            <label htmlFor="loginPassword">Password</label>
                            <div className="relative">
                                <input
                                    id="loginPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={loginPassword}
                                    onChange={e => setLoginPassword(e.target.value)}
                                    required
                                    className="form-input pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(s => !s)}
                                    className="pw-toggle"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <div className="login-inline-row">
                            <label className="inline-flex items-center gap-2 cursor-pointer select-none remember-wrap">
                                <input type="checkbox" className="rounded border-gray-300" />
                                <span className="text-gray-600">Remember me</span>
                            </label>
                            <button type="button" className="action-btn action-btn-compact" aria-label="Forgot password">
                                Forgot password
                            </button>
                        </div>

                        <button type="submit" className="primary-btn w-full">
                            Sign In
                        </button>

                        <div className="switch-block">
                            <span className="switch-text-label">Need an account?</span>
                            <button
                                type="button"
                                className="action-btn action-btn-compact"
                                onClick={() => setMode('signup')}
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="space-y-5">
                        <Input
                            id="signupName"
                            label="Name"
                            type="text"
                            autoComplete="name"
                            value={signupName}
                            onChange={e => setSignupName(e.target.value)}
                            required
                        />
                        <Input
                            id="signupEmail"
                            label="Email"
                            type="email"
                            autoComplete="username"
                            value={signupEmail}
                            onChange={e => setSignupEmail(e.target.value)}
                            required
                        />
                        <div className="form-group">
                            <label htmlFor="signupPassword">Password</label>
                            <div className="relative">
                                <input
                                    id="signupPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={signupPassword}
                                    onChange={e => setSignupPassword(e.target.value)}
                                    required
                                    className="form-input pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(s => !s)}
                                    className="pw-toggle"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <p className="hint-text">Use at least 8 characters.</p>
                        </div>

                        <button type="submit" className="primary-btn w-full">
                            Create Account
                        </button>

                        <div className="switch-block">
                            <span className="switch-text-label">Already have an account?</span>
                            <button
                                type="button"
                                className="action-btn action-btn-compact"
                                onClick={() => setMode('login')}
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-10 text-center">
                    <Link to="/" className="link-muted uppercase tracking-wide text-xs">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}