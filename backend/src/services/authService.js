import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';

export const authService = {
    async register(registrationData) {
        const { email, password, name } = registrationData;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) throw new Error('User already exists');

        const passwordHash = await bcrypt.hash(password, 10);
        return await prisma.user.create({
            data: { email, passwordHash, name },
            select: { id: true, email: true, name: true }
        });
    },

    async login(email, password) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                orgMaps: { include: { organization: true } },
                instituteMaps: { include: { institute: true } }
            }
        });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            throw new Error('Invalid email or password');
        }

        const organizations = user.orgMaps.map(mapping => ({
            id: mapping.organization.id,
            name: mapping.organization.name,
            role: mapping.role
        }));

        const institutes = user.instituteMaps.map(mapping => ({
            id: mapping.institute.id,
            name: mapping.institute.name,
            role: mapping.role,
            organizationId: mapping.institute.organizationId
        }));

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                organizations,
                institutes
            }
        };
    },

    async getProfile(userId) {
        return await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true }
        });
    }
};
