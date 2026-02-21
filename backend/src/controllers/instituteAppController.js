import { instituteAppService } from '../services/instituteAppService.js';
import { z } from 'zod';

const installSchema = z.object({
    appId: z.number(),
    settings: z.record(z.any()).optional()
});

export const installApp = async (req, res) => {
    try {
        const { appId } = installSchema.parse(req.body);
        const { instituteId, user } = req;

        if (!instituteId) {
            return res.status(400).json({ error: 'Institute context required' });
        }

        const installation = await instituteAppService.installApp(instituteId, appId, user.id);
        res.status(201).json(installation);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Installation failed' });
    }
};

export const getInstalledApps = async (req, res) => {
    try {
        const { instituteId } = req;
        const installedApps = await instituteAppService.getInstalledApps(instituteId);
        res.json(installedApps);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch installed apps' });
    }
};

export const launchApp = async (req, res) => {
    try {
        const { appId } = req.params;
        const { instituteId, user } = req;

        if (!instituteId) {
            return res.status(400).json({ error: 'Institute context required' });
        }

        const launchData = await instituteAppService.generateLaunchToken(instituteId, parseInt(appId), user.id);
        res.json(launchData);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Launch failed' });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { appId } = req.params;
        const { settings } = req.body;
        const { instituteId } = req;
        const updated = await instituteAppService.updateAppSettings(instituteId, parseInt(appId), settings);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Failed to update settings' });
    }
};
