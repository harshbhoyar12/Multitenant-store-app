import { adminService } from '../services/adminService.js';
import { z } from 'zod';

const orgSchema = z.object({ name: z.string().min(2) });
const instituteSchema = z.object({ name: z.string().min(2), organizationId: z.number() });
const appSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    category: z.string().optional(),
    launchUrl: z.string().url(),
    webhookUrl: z.string().url().optional(),
    logoUrl: z.string().url().optional(),
    requiredPermissions: z.array(z.string())
});

export const createOrg = async (req, res) => {
    try {
        const { name } = orgSchema.parse(req.body);
        const organization = await adminService.createOrganization(name, req.user.id);
        res.status(201).json(organization);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Failed to create organization' });
    }
};

export const createInstitute = async (req, res) => {
    try {
        const instituteData = instituteSchema.parse(req.body);
        const institute = await adminService.createInstitute(instituteData, req.user.id);
        res.status(201).json(institute);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Failed to create institute' });
    }
};

export const createApp = async (req, res) => {
    try {
        const appData = appSchema.parse(req.body);
        const application = await adminService.createApp(appData);
        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Failed to create app' });
    }
};

export const getAllApps = async (req, res) => {
    try {
        const apps = await adminService.getAllApps();
        res.json(apps);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch apps' });
    }
};
