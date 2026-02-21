import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Create Super Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'admin@example.com',
            passwordHash,
        },
    });

    // 2. Create Organization
    const org = await prisma.organization.create({
        data: { name: 'Global Tech Corp' },
    });

    // 3. Create Institute
    const inst = await prisma.institute.create({
        data: { name: 'Institute of Coding', organizationId: org.id },
    });

    // 4. Map User to Org and Institute
    await prisma.userOrgMap.create({
        data: { userId: admin.id, organizationId: org.id, role: 'super_admin' },
    });

    await prisma.userInstituteMap.create({
        data: { userId: admin.id, instituteId: inst.id, role: 'institute_admin' },
    });

    // 5. Create Standard User
    const standardUser = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            name: 'Standard User',
            email: 'user@example.com',
            passwordHash,
        },
    });

    await prisma.userOrgMap.create({
        data: { userId: standardUser.id, organizationId: org.id, role: 'user' },
    });

    await prisma.userInstituteMap.create({
        data: { userId: standardUser.id, instituteId: inst.id, role: 'user' },
    });

    // 6. Create Sample Apps
    await prisma.app.createMany({
        data: [
            {
                name: 'Student Tracker',
                description: 'Manage student attendance and grades.',
                category: 'LMS',
                launchUrl: 'https://example-student-app.vercel.app',
                requiredPermissions: ['read_students', 'write_attendance'],
                logoUrl: 'https://cdn-icons-png.flaticon.com/512/3534/3534033.png'
            },
            {
                name: 'Finance Pro',
                description: 'Accounting and payroll management.',
                category: 'Finance',
                launchUrl: 'https://example-finance-app.vercel.app',
                requiredPermissions: ['read_finance'],
                logoUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png'
            },
            {
                name: 'HR Connect',
                description: 'Employee directory and leave management.',
                category: 'HR & Payroll',
                launchUrl: 'https://example-hr-app.vercel.app',
                requiredPermissions: ['read_employees'],
                logoUrl: 'https://cdn-icons-png.flaticon.com/512/912/912318.png'
            },
        ],
    });

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
