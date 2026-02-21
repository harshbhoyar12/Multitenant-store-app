import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;


        const requestedOrgId = req.headers['x-org-id'] ? parseInt(req.headers['x-org-id']) : decoded.orgId;
        const requestedInstituteId = req.headers['x-institute-id'] ? parseInt(req.headers['x-institute-id']) : decoded.instituteId;


        if (requestedOrgId) {
            const hasOrg = await prisma.userOrgMap.findUnique({
                where: { userId_organizationId: { userId: user.id, organizationId: requestedOrgId } }
            });
            if (!hasOrg && decoded.role !== 'super_admin') {
                return res.status(403).json({ error: 'No access to this organization' });
            }
            req.orgId = requestedOrgId;
        }

        if (requestedInstituteId) {
            const hasInst = await prisma.userInstituteMap.findUnique({
                where: { userId_instituteId: { userId: user.id, instituteId: requestedInstituteId } }
            });
            if (!hasInst && decoded.role !== 'super_admin') {
                return res.status(403).json({ error: 'No access to this institute' });
            }
            req.instituteId = requestedInstituteId;
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
