import express from 'express';
import { createOrg, createInstitute, createApp, getAllApps } from '../controllers/adminController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { rbacMiddleware } from '../middlewares/rbacMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/organizations', rbacMiddleware(['super_admin']), createOrg);
router.post('/institutes', rbacMiddleware(['super_admin', 'org_admin']), createInstitute);
router.post('/apps', rbacMiddleware(['super_admin']), createApp);
router.get('/apps', getAllApps);

export default router;
