import sequelize from '../config/databaseClient';
import dotenv from 'dotenv';
import PermissionModel from '../models/PermissionModel';

dotenv.config();

const SYSTEM_PERMISSIONS = [
    'CREATE_USER',
    'READ_USER',
];

interface SyncOptions {
    removeUnused?: boolean;
}

const syncPermissions = async (options: SyncOptions = {}) => {
    const { removeUnused = false } = options;

    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        await sequelize.sync();
        console.log('✅ Database synced');

        let created = 0;
        let removed = 0;

        for (const permName of SYSTEM_PERMISSIONS) {
            const [permission, isCreated] = await PermissionModel.findOrCreate({
                where: { name: permName },
                defaults: {
                    name: permName,
                    created_at: new Date(),
                },
            });

            if (isCreated) {
                console.log(`✅ Permission created: ${permName}`);
                created++;
            } else {
                console.log(`⏭️  Permission already exists: ${permName}`);
            }
        }

        if (removeUnused) {
            const allPermissions = await PermissionModel.findAll();

            for (const perm of allPermissions) {
                const permName = perm.getDataValue('name');
                if (!SYSTEM_PERMISSIONS.includes(permName)) {
                    await perm.destroy();
                    console.log(`🗑️  Permission removed: ${permName}`);
                    removed++;
                }
            }
        }

        console.log('\n📊 Sync Summary:');
        console.log(`   ✅ Created: ${created}`);
        console.log(`   🗑️  Removed: ${removed}`);
        console.log(`   📝 Total permissions: ${SYSTEM_PERMISSIONS.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error syncing permissions:', error);
        process.exit(1);
    }
};

syncPermissions({
    removeUnused: true,
});
