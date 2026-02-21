import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/apiClient';
import { ArrowLeft, ExternalLink, ShieldCheck, RefreshCcw } from 'lucide-react';
import '../styles/AppLaunch.css';

export default function AppLaunch() {
    const { appId } = useParams();
    const navigate = useNavigate();

    const { data: launchData, isLoading, error, refetch } = useQuery({
        queryKey: ['launch-app', appId],
        queryFn: async () => {
            const response = await api.get(`/institute-apps/${appId}/launch`);
            return response.data;
        },
        retry: false
    });

    if (isLoading) {
        return (
            <div className="launch-loading-container">
                <div className="launch-loader"></div>
                <p className="launch-loading-text">Establishing Secure Connection...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="launch-error-container">
                <h2 className="launch-error-title">Launch Failed</h2>
                <p className="launch-error-text">{error.response?.data?.error || 'Failed to initialize application'}</p>
                <div className="launch-error-actions">
                    <button onClick={() => navigate(-1)} className="btn-secondary">
                        Return to Store
                    </button>
                    <button onClick={() => refetch()} className="btn-primary">
                        <RefreshCcw size={16} /> Retry Launch
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="launch-container">
            <header className="glass-panel launch-toolbar">
                <div className="launch-toolbar-left">
                    <button onClick={() => navigate(-1)} className="btn-outline">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="launch-divider"></div>
                    <div className="launch-secure-badge">
                        <ShieldCheck size={16} color="hsl(var(--success))" />
                        <span>Secure Tunnel Active</span>
                    </div>
                </div>

                <div className="launch-toolbar-right">
                    <a
                        href={launchData.launchUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="launch-popout"
                    >
                        <ExternalLink size={16} /> Open in New Tab
                    </a>
                </div>
            </header>

            <div className="glass-panel launch-frame-wrapper">
                <iframe
                    src={launchData.launchUrl}
                    className="launch-iframe"
                    title="App Launch"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
