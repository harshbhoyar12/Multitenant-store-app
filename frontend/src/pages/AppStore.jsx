import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiClient';
import { Rocket, Settings2, ShieldCheck, Download, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/AppStore.css';

import { useAuthStore } from '../store/authStore';

export default function AppStore() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, activeOrgId, activeInstituteId } = useAuthStore();
    const [configApp, setConfigApp] = React.useState(null);
    const [settingsJson, setSettingsJson] = React.useState('');

    const { data: apps, isLoading: loadingApps } = useQuery({
        queryKey: ['available-apps'],
        queryFn: async () => {
            const response = await api.get('/admin/apps');
            return response.data;
        }
    });

    const { data: installedApps, isLoading: loadingInstalled } = useQuery({
        queryKey: ['installed-apps'],
        queryFn: async () => {
            const response = await api.get('/institute-apps/installed');
            return response.data;
        }
    });

    const installMutation = useMutation({
        mutationFn: (appId) => api.post('/institute-apps/install', { appId }),
        onSuccess: () => {
            queryClient.invalidateQueries(['installed-apps']);
            toast.success('Application installed successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Installation failed');
        }
    });

    const updateSettingsMutation = useMutation({
        mutationFn: ({ appId, settings }) => api.patch(`/institute-apps/settings/${appId}`, { settings }),
        onSuccess: () => {
            queryClient.invalidateQueries(['installed-apps']);
            toast.success('Settings updated successfully!');
            setConfigApp(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to update settings');
        }
    });

    if (loadingApps || loadingInstalled) return <div className="loading-state">Loading...</div>;

    const installedIds = installedApps?.map(installedApp => installedApp.appId) || [];

    const handleOpenSettings = (app) => {
        const installed = installedApps.find(ia => ia.appId === app.id);
        setConfigApp(app);
        setSettingsJson(JSON.stringify(installed?.settings || {}, null, 2));
    };

    const handleSaveSettings = () => {
        try {
            const settings = JSON.parse(settingsJson);
            updateSettingsMutation.mutate({ appId: configApp.id, settings });
        } catch (e) {
            toast.error('Invalid JSON format');
        }
    };

    const activeOrg = user?.organizations?.find(org => org.id === activeOrgId);
    const activeInst = user?.institutes?.find(inst => inst.id === activeInstituteId);
    const canManageApps = activeOrg?.role === 'super_admin' ||
        activeOrg?.role === 'org_admin' ||
        activeInst?.role === 'institute_admin';

    return (
        <div className="animate-fade-in store-container">
            <div className="store-header">
                <div className="store-header-title">
                    <h1>Application Store</h1>
                    <p>Discover and install powerful extensions for your institute.</p>
                </div>
                <div className="store-stats">
                    <div className="store-stat-item">
                        <span className="store-stat-value">{apps?.length || 0}</span>
                        <span className="store-stat-label">Total Apps</span>
                    </div>
                    <div className="store-stat-item">
                        <span className="store-stat-value">{installedIds.length}</span>
                        <span className="store-stat-label">Installed</span>
                    </div>
                </div>
            </div>

            <div className="app-grid">
                {apps?.map(app => {
                    const isInstalled = installedIds.includes(app.id);
                    return (
                        <div key={app.id} className="glass-panel app-card">
                            <div className="app-card-header">
                                <div className="app-store-icon">
                                    {app.logoUrl ? (
                                        <img src={app.logoUrl} alt={app.name} />
                                    ) : (
                                        <div className="app-store-icon-placeholder">{app.name[0]}</div>
                                    )}
                                </div>
                                <div className="badge-container">
                                    {isInstalled && <span className="badge badge-success">Active</span>}
                                </div>
                            </div>

                            <div className="app-card-body">
                                <h3 className="app-store-name">{app.name}</h3>
                                <span className="app-store-category">{app.category || 'Utility'}</span>
                                <p className="app-store-description">{app.description}</p>
                            </div>

                            <div className="app-card-footer">
                                <div className="app-store-footer-info">
                                    <ShieldCheck size={14} className="verified-icon" />
                                    <span>Verified</span>
                                </div>

                                <div className="app-store-actions">
                                    {isInstalled ? (
                                        <div className="app-actions-group">
                                            {canManageApps && (
                                                <button
                                                    className="btn-secondary btn-icon-adjust"
                                                    onClick={() => handleOpenSettings(app)}
                                                >
                                                    <Settings2 size={18} />
                                                </button>
                                            )}
                                            <button
                                                className="btn-primary"
                                                onClick={() => navigate(`/launch/${app.id}`)}
                                            >
                                                <Rocket size={18} /> Launch
                                            </button>
                                        </div>
                                    ) : (
                                        canManageApps && (
                                            <button
                                                className="btn-primary"
                                                onClick={() => installMutation.mutate(app.id)}
                                                disabled={installMutation.isPending}
                                            >
                                                <Download size={18} /> Install
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {configApp && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content settings-modal animate-fade-in">
                        <div className="settings-modal-header">
                            <h3>Configure {configApp.name}</h3>
                            <button className="settings-close-btn" onClick={() => setConfigApp(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <p className="modal-subtitle">Custom JSON settings for this institute.</p>

                        <div className="settings-editor">
                            <textarea
                                value={settingsJson}
                                onChange={(e) => setSettingsJson(e.target.value)}
                                placeholder='{ "theme": "dark", "apiKey": "xyz..." }'
                                spellCheck="false"
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setConfigApp(null)}>Cancel</button>
                            <button
                                className="btn-primary"
                                onClick={handleSaveSettings}
                                disabled={updateSettingsMutation.isPending}
                            >
                                {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
