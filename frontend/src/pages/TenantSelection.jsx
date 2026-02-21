import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Building2, Landmark, ArrowRight, LogOut } from 'lucide-react';
import AuthLayout from '../auth/AuthLayout';
import '../styles/TenantSelection.css';

export default function TenantSelection() {
    const navigate = useNavigate();
    const {
        user,
        activeOrgId,
        activeInstituteId,
        setActiveOrg,
        setActiveInstitute,
        logout
    } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const currentOrg = user?.organizations?.find(organization => organization.id === activeOrgId);

    return (
        <AuthLayout
            title={activeOrgId ? "Select Institute" : "Select Organization"}
            subtitle={activeOrgId ? `Choose an institute within ${currentOrg?.name}` : "Select an organization to access its apps."}
        >
            <div className="tenant-list">
                {!activeOrgId ? (
                    user?.organizations?.map(organization => (
                        <button
                            key={organization.id}
                            onClick={() => setActiveOrg(organization.id)}
                            className="glass-panel tenant-card"
                        >
                            <div className="tenant-card-icon">
                                <Building2 size={24} color="hsl(var(--primary))" />
                            </div>
                            <div className="tenant-card-content">
                                <span className="tenant-card-name">{organization.name}</span>
                                <span className="tenant-card-role">Admin</span>
                            </div>
                            <ArrowRight size={18} className="tenant-arrow" />
                        </button>
                    ))
                ) : (
                    user?.institutes
                        ?.filter(institute => institute.organizationId === activeOrgId)
                        .map(institute => (
                            <button
                                key={institute.id}
                                onClick={() => {
                                    setActiveInstitute(institute.id);
                                    navigate('/');
                                }}
                                className="glass-panel tenant-card"
                            >
                                <div className="tenant-card-icon">
                                    <Landmark size={24} color="hsl(var(--primary))" />
                                </div>
                                <div className="tenant-card-content">
                                    <span className="tenant-card-name">{institute.name}</span>
                                    <span className="tenant-card-role">User</span>
                                </div>
                                <ArrowRight size={18} className="tenant-arrow" />
                            </button>
                        ))
                )}

                {activeOrgId && (
                    <button
                        onClick={() => setActiveOrg(null)}
                        className="tenant-back-btn"
                    >
                        ← Back to Organizations
                    </button>
                )}

                <button onClick={handleLogout} className="tenant-logout-btn">
                    <LogOut size={16} /> Sign out
                </button>
            </div>
        </AuthLayout>
    );
}
