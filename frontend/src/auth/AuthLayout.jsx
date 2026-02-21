import React from 'react';
import '../styles/AuthLayout.css';

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="auth-container">
            <div className="auth-blob-1"></div>
            <div className="auth-blob-2"></div>

            <div className="glass-panel animate-fade-in auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">{title}</h1>
                    {subtitle && <p className="auth-subtitle">{subtitle}</p>}
                </div>
                {children}
            </div>
        </div>
    );
}
