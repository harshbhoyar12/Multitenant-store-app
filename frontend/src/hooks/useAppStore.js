import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiClient';

export const useAppStore = (instituteId) => {
    const queryClient = useQueryClient();

    const appsQuery = useQuery({
        queryKey: ['available-apps'],
        queryFn: async () => {
            const response = await api.get('/admin/apps');
            return response.data;
        },
    });

    const installedQuery = useQuery({
        queryKey: ['installed-apps', instituteId],
        queryFn: async () => {
            const response = await api.get('/institute-apps');
            return response.data;
        },
        enabled: !!instituteId,
    });

    const installMutation = useMutation({
        mutationFn: async (appId) => {
            const response = await api.post('/institute-apps/install', { appId });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['installed-apps', instituteId]);
        },
    });

    return {
        apps: appsQuery.data || [],
        isLoadingApps: appsQuery.isLoading,
        installedApps: installedQuery.data || [],
        isLoadingInstalled: installedQuery.isLoading,
        installApp: installMutation.mutate,
        isInstalling: installMutation.isPending,
    };
};
