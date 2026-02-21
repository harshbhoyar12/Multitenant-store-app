import prisma from '../utils/prisma.js';

export const rbacMiddleware = (requiredRoles = [], requiredPermissions = []) => {
    return async (req, res, next) => {
        try {
            const { user, orgId, instituteId } = req;

            if (!orgId) {
                return res.status(403).json({ error: 'Organization context required' });
            }


            const orgMap = await prisma.userOrgMap.findUnique({
                where: {
                    userId_organizationId: { userId: user.id, organizationId: orgId }
                }
            });

            if (!orgMap) {
                return res.status(403).json({ error: 'No access to this organization' });
            }


            if (requiredRoles.length > 0) {
                const hasRole = requiredRoles.includes(orgMap.role) || orgMap.role === 'super_admin';


                if (!hasRole && instituteId) {
                    const instMap = await prisma.userInstituteMap.findUnique({
                        where: {
                            userId_instituteId: { userId: user.id, instituteId: instituteId }
                        }
                    });
                    if (instMap && requiredRoles.includes(instMap.role)) {
                        return next();
                    }
                }

                if (!hasRole) {
                    return res.status(403).json({ error: 'Insufficient permissions (role)' });
                }
            }



            const rolePermissions = {
                'super_admin': ['app.manage', 'app.install', 'organization.manage', 'institute.manage', 'user.view'],
                'org_admin': ['app.install', 'institute.manage', 'user.view'],
                'institute_admin': ['app.install', 'user.view'],
                'user': ['user.view']
            };

            const userPermissions = rolePermissions[orgMap.role] || [];

            if (requiredPermissions.length > 0) {
                const hasAllPermissions = requiredPermissions.every(p => userPermissions.includes(p));
                if (!hasAllPermissions) {
                    return res.status(403).json({ error: 'Insufficient permissions' });
                }
            }

            next();
        } catch (error) {
            console.error('RBAC Error:', error);
            res.status(500).json({ error: 'Internal Server Error during RBAC check' });
        }
    };
};
