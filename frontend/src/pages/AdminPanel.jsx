import React, { useState } from 'react';
import api from '../api/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutGrid, Building, Plus, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import '../styles/AdminPanel.css';

export default function AdminPanel() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('apps');

    const [appForm, setAppForm] = useState({
        name: '',
        launchUrl: '',
        description: '',
        category: '',
        requiredPermissions: ['user.view']
    });
    const [orgForm, setOrgForm] = useState({ name: '' });

    const appMutation = useMutation({
        mutationFn: (appData) => api.post('/admin/apps', appData),
        onSuccess: () => {
            queryClient.invalidateQueries(['available-apps']);
            setAppForm({ name: '', launchUrl: '', description: '', category: '', requiredPermissions: ['user.view'] });
            toast.success('Application registered successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to register application');
        }
    });

    const orgMutation = useMutation({
        mutationFn: (organizationData) => api.post('/admin/organizations', organizationData),
        onSuccess: () => {
            setOrgForm({ name: '' });
            toast.success('Organization created successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to create organization');
        }
    });

    return (
        <div className="animate-fade-in admin-container">
            <header className="admin-header">
                <h1>Administration Console</h1>
                <p>Manage global entities and application availability.</p>
            </header>

            <div className="glass-panel admin-tabs">
                <button
                    onClick={() => setActiveTab('apps')}
                    className={`admin-tab ${activeTab === 'apps' ? 'active' : ''}`}
                >
                    <LayoutGrid size={18} /> Application Catalog
                </button>
                <button
                    onClick={() => setActiveTab('orgs')}
                    className={`admin-tab ${activeTab === 'orgs' ? 'active' : ''}`}
                >
                    <Building size={18} /> Organization Registry
                </button>
            </div>

            <div className="glass-panel admin-panel">
                {activeTab === 'apps' && (
                    <form className="admin-form" onSubmit={(e) => { e.preventDefault(); appMutation.mutate(appForm); }}>
                        <div className="admin-form-header">
                            <div className="admin-icon-circle"><Plus size={20} /></div>
                            <h3>Register New Application</h3>
                        </div>

                        <div className="admin-input-group">
                            <label className="admin-label">Application Name</label>
                            <input
                                placeholder="e.g. Learning Management System"
                                value={appForm.name}
                                onChange={e => setAppForm({ ...appForm, name: e.target.value })}
                                className="admin-input" required
                            />
                        </div>

                        <div className="admin-input-group">
                            <label className="admin-label">Launch Endpoint URL</label>
                            <input
                                placeholder="https://app.nexus-store.com/launch"
                                value={appForm.launchUrl}
                                onChange={e => setAppForm({ ...appForm, launchUrl: e.target.value })}
                                className="admin-input" required
                            />
                        </div>

                        <div className="admin-input-group">
                            <label className="admin-label">Category</label>
                            <input
                                placeholder="e.g. Education, Productivity"
                                list="app-categories"
                                value={appForm.category}
                                onChange={e => setAppForm({ ...appForm, category: e.target.value })}
                                className="admin-input"
                            />
                            <datalist id="app-categories">
                                <option value="Student Management" />
                                <option value="Finance" />
                                <option value="HR & Payroll" />
                                <option value="LMS" />
                                <option value="Analytics" />
                            </datalist>
                        </div>

                        <div className="admin-input-group">
                            <label className="admin-label">Service Description</label>
                            <textarea
                                placeholder="Describe what this app does..."
                                value={appForm.description}
                                onChange={e => setAppForm({ ...appForm, description: e.target.value })}
                                className="admin-input admin-textarea"
                            />
                        </div>

                        <button type="submit" disabled={appMutation.isPending} className="btn-primary admin-submit-btn">
                            {appMutation.isPending ? 'Processing...' : (
                                <><CheckCircle2 size={18} /> Deploy Application</>
                            )}
                        </button>
                    </form>
                )}

                {activeTab === 'orgs' && (
                    <form className="admin-form" onSubmit={(e) => { e.preventDefault(); orgMutation.mutate(orgForm); }}>
                        <div className="admin-form-header">
                            <div className="admin-icon-circle"><Building size={20} /></div>
                            <h3>Register New Organization</h3>
                        </div>

                        <div className="admin-input-group">
                            <label className="admin-label">Organization Identity Name</label>
                            <input
                                placeholder="e.g. Global Tech Solutions"
                                value={orgForm.name}
                                onChange={e => setOrgForm({ ...orgForm, name: e.target.value })}
                                className="admin-input" required
                            />
                        </div>

                        <button type="submit" disabled={orgMutation.isPending} className="btn-primary admin-submit-btn">
                            {orgMutation.isPending ? 'Processing...' : (
                                <><CheckCircle2 size={18} /> Create Organization</>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
