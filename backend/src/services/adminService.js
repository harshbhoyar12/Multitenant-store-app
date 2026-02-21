import prisma from '../utils/prisma.js';

export const adminService = {
    async createOrganization(name, creatorId) {
        const org = await prisma.organization.create({
            data: { name }
        });
        await prisma.userOrgMap.create({
            data: { userId: creatorId, organizationId: org.id, role: 'org_admin' }
        });
        return org;
    },

    async createInstitute(instituteData, creatorId) {
        const institute = await prisma.institute.create({
            data: {
                name: instituteData.name,
                organizationId: instituteData.organizationId
            }
        });
        await prisma.userInstituteMap.create({
            data: { userId: creatorId, instituteId: institute.id, role: 'institute_admin' }
        });
        return institute;
    },

    async createApp(appData) {
        return await prisma.app.create({
            data: {
                name: appData.name,
                description: appData.description,
                launchUrl: appData.launchUrl,
                requiredPermissions: appData.requiredPermissions || []
            }
        });
    },

    async getAllApps() {
        return await prisma.app.findMany();
    },

    async getAllOrganizations() {
        return await prisma.organization.findMany();
    }
};
