import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            activeOrgId: null,
            activeInstituteId: null,

            setAuth: (user, token) => set({ user, token }),

            setActiveOrg: (organizationId) => set({ activeOrgId: organizationId, activeInstituteId: null }),

            setActiveInstitute: (instituteId) => set({ activeInstituteId: instituteId }),

            logout: () => set({
                user: null,
                token: null,
                activeOrgId: null,
                activeInstituteId: null
            }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
