import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/RoleGuard.css';

export default function RoleGuard({ children, roles = [], permissions = [] }) {
    const { user, activeOrgId } = useAuthStore();

    if (!user) return <Navigate to="/login" />;

    const orgMap = user.organizations?.find(organization => organization.id === activeOrgId);
    const userRole = orgMap?.role || 'user';

    if (userRole === 'super_admin') return children;

    const hasRole = roles.length === 0 || roles.includes(userRole);

    if (!hasRole) {
        return (
            <div className="access-denied-container">
                <h3>Access Denied</h3>
                <p>You do not have the required permissions to view this page.</p>
            </div>
        );
    }

    return children;
}
