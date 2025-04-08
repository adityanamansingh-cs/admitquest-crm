import { DB } from '@/database';
import bcrypt from 'bcrypt';
import logger from '@/utils/logger';

const createAdminUser = async () => {
    try {
        const adminEmail = 'admin@admitquest.com';
        const adminPassword = 'Admin@123';
        const adminName = 'Admin User';

        // Check if admin already exists
        const existingAdmin = await DB.Users.findOne({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            logger.info('Admin user already exists');
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create the admin user
        const adminUser = await DB.Users.create({
            email: adminEmail,
            name: adminName,
            password: hashedPassword,
            role: 'admin'
        });

        logger.info('Admin user created successfully:', {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role
        });

        process.exit(0);
    } catch (error) {
        logger.error('Failed to create admin user:', error);
        process.exit(1);
    }
};

// Run the script
createAdminUser(); 