import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, Store, Settings, LogOut, User, ChevronRight, Menu } from 'lucide-react';
import '../styles/Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, activeOrgId, activeInstituteId } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const activeOrg = user?.organizations?.find(organization => organization.id === activeOrgId);
    const activeInstitute = user?.institutes?.find(institute => institute.id === activeInstituteId);
    const isAdmin = activeOrg?.role === 'super_admin' || activeOrg?.role === 'org_admin';

    const navLinks = [
        { to: '/', label: 'App Store', icon: Store },
        { to: '/apps', label: 'My Applications', icon: LayoutDashboard },
        ...(isAdmin ? [{ to: '/admin', label: 'Administration', icon: Settings }] : []),
    ];

    return (
        <div className="dashboard-layout">
            <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="dashboard-logo-container">
                    <div className="dashboard-logo-icon">A</div>
                    <span className="dashboard-logo-text">Nexus</span>
                </div>

                <nav className="dashboard-nav">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.to;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`dashboard-nav-link animate-fade-in ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                <span>{link.label}</span>
                                {isActive && <ChevronRight size={14} className="dashboard-active-arrow" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="dashboard-sidebar-footer">
                    <div className="dashboard-user-profile">
                        <div className="dashboard-avatar">
                            {user?.name?.[0].toUpperCase()}
                        </div>
                        <div className="dashboard-user-meta">
                            <span className="dashboard-user-name">{user?.name}</span>
                            <span className="dashboard-user-role">{isAdmin ? 'Administrator' : 'User'}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="dashboard-logout-btn">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="dashboard-header-left">
                        <Menu size={20} className="dashboard-mobile-menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                        <div className="dashboard-breadcrumb">
                            <span className="dashboard-breadcrumb-parent">{activeOrg?.name}</span>
                            <ChevronRight size={14} />
                            <span className="dashboard-breadcrumb-active">{activeInstitute?.name}</span>
                        </div>
                    </div>

                    <div className="dashboard-header-right">
                        <button
                            onClick={() => navigate('/select-tenant')}
                            className="glass-panel dashboard-switch-btn"
                        >
                            Switch Context
                        </button>
                    </div>
                </header>

                <section className="dashboard-content">
                    <div className="container dashboard-container">
                        <Outlet />
                    </div>
                </section>
            </main>
        </div>
    );
}
