import express from 'express';
import { installApp, getInstalledApps, launchApp, updateSettings } from '../controllers/instituteAppController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { rbacMiddleware } from '../middlewares/rbacMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/installed', getInstalledApps);
router.post('/install', rbacMiddleware(['institute_admin', 'org_admin', 'super_admin']), installApp);
router.get('/:appId/launch', launchApp);
router.patch('/settings/:appId', rbacMiddleware(['institute_admin', 'org_admin', 'super_admin']), updateSettings);

export default router;
