import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import axios from 'axios';

export const instituteAppService = {
    async installApp(instituteId, appId, userId) {
        const app = await prisma.app.findUnique({ where: { id: appId } });
        if (!app) throw new Error('App not found');

        const installation = await prisma.instituteInstalledApp.upsert({
            where: { instituteId_appId: { instituteId, appId } },
            update: { installedBy: userId },
            create: {
                instituteId,
                appId,
                installedBy: userId,
                settings: {}
            }
        });

        if (app.webhookUrl) {
            const payload = {
                event: 'institute_app_installed',
                instituteId,
                appId,
                settings: installation.settings,
                timestamp: new Date()
            };

            try {
                const response = await axios.post(app.webhookUrl, payload, {
                    headers: { 'Content-Type': 'application/json' }
                });

                await prisma.webhookLog.create({
                    data: {
                        instituteId,
                        appId,
                        payload,
                        statusCode: response.status
                    }
                });
            } catch (error) {
                console.error('Webhook delivery failed:', error.message);
                await prisma.webhookLog.create({
                    data: {
                        instituteId,
                        appId,
                        payload,
                        statusCode: error.response?.status || 500
                    }
                });
            }
        }

        return installation;
    },

    async updateAppSettings(instituteId, appId, settings) {
        return await prisma.instituteInstalledApp.update({
            where: { instituteId_appId: { instituteId, appId } },
            data: { settings }
        });
    },

    async getInstalledApps(instituteId) {
        return await prisma.instituteInstalledApp.findMany({
            where: { instituteId },
            include: { app: true }
        });
    },

    async generateLaunchToken(instituteId, appId, userId) {
        const userMap = await prisma.userInstituteMap.findFirst({
            where: { userId, instituteId }
        });

        if (!userMap) throw new Error('Unauthorized: User not mapped to this institute');

        const installation = await prisma.instituteInstalledApp.findUnique({
            where: { instituteId_appId: { instituteId, appId } },
            include: { app: true, institute: { include: { organization: true } } }
        });

        if (!installation) throw new Error('App not installed for this institute');

        const launchToken = jwt.sign(
            {
                userId,
                orgId: installation.institute.organizationId,
                instituteId,
                appId,
                permissions: installation.app.requiredPermissions,
                settings: installation.settings
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        return {
            launchUrl: `${installation.app.launchUrl}?token=${launchToken}`,
            app: installation.app
        };
    }
};
