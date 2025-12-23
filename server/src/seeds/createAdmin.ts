import bcrypt from 'bcrypt';
import { UserModel, RoleModel, PermissionModel } from '../models';
import sequelize from '../config/databaseClient';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    await sequelize.sync();
    console.log('✅ Database synced');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '12345678';

    const superAdminRole = await RoleModel.findOne({
      where: { name: 'SUPER_ADMIN' }
    });

    if (!superAdminRole) {
      console.log('❌ Role "SUPER_ADMIN" chưa tồn tại. Vui lòng chạy server để khởi tạo role trước.');
      process.exit(1);
    }

    const existingSuperAdmin = await UserModel.findOne({
      include: [{
        model: RoleModel,
        as: 'roles',
        where: { name: 'SUPER_ADMIN' },
      }]
    });

    if (existingSuperAdmin) {
      console.log('⚠️  Super Admin đã tồn tại với email:', (existingSuperAdmin as any).email);
      console.log('⚠️  Hệ thống chỉ cho phép duy nhất một Super Admin');
      
      console.log('\n🔄 Đang đồng bộ permissions cho SUPER_ADMIN...');
      await syncSuperAdminPermissions(superAdminRole);
      
      process.exit(0);
    }

    const existingUser = await UserModel.findOne({
      where: { email: adminEmail }
    });

    if (existingUser) {
      console.log('⚠️  Email này đã được sử dụng:', adminEmail);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await UserModel.create({
      email: adminEmail,
      firstname: 'Admin',
      lastname: 'Super',
      photoUrl: 'https://res.cloudinary.com/ddox3txnn/image/upload/v1752024992/dsx-store/logo/Logo.png',
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await (admin as any).addRole(superAdminRole);

    console.log('✅ Super Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🆔 ID:', admin.get('id'));
    console.log('👑 Role: SUPER_ADMIN');

    console.log('\n🔄 Đang đồng bộ permissions cho SUPER_ADMIN...');
    await syncSuperAdminPermissions(superAdminRole);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

const syncSuperAdminPermissions = async (superAdminRole: any) => {
  try {
    const roleWithPermissions = await RoleModel.findOne({
      where: { name: 'SUPER_ADMIN' },
      include: [{
        model: PermissionModel,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    if (!roleWithPermissions) {
      console.error('❌ Không tìm thấy role SUPER_ADMIN');
      return;
    }

    const allPermissions = await PermissionModel.findAll();

    if (allPermissions.length === 0) {
      console.warn('⚠️  Không có permission nào trong hệ thống.');
      return;
    }

    const currentPermissions = (roleWithPermissions as any).permissions || [];
    const currentPermissionIds = new Set(currentPermissions.map((p: any) => p.id));

    const allPermissionIds = allPermissions.map(p => p.getDataValue('id'));
    const allPermissionIdsSet = new Set(allPermissionIds);

    const permissionsToAdd = allPermissionIds.filter(id => !currentPermissionIds.has(id));

    const permissionsToRemove = Array.from(currentPermissionIds).filter(id => !allPermissionIdsSet.has(id));

    let added = 0;
    let removed = 0;

    if (permissionsToAdd.length > 0) {
      await (superAdminRole as any).addPermissions(permissionsToAdd);
      added = permissionsToAdd.length;
      
      for (const permId of permissionsToAdd) {
        const perm = allPermissions.find(p => p.getDataValue('id') === permId);
        if (perm) {
          console.log(`   ✅ Added permission: ${perm.getDataValue('name')}`);
        }
      }
    }

    if (permissionsToRemove.length > 0) {
      await (superAdminRole as any).removePermissions(permissionsToRemove);
      removed = permissionsToRemove.length;
      
      for (const permId of permissionsToRemove) {
        const perm = currentPermissions.find((p: any) => p.id === permId);
        if (perm) {
          console.log(`   🗑️  Removed permission: ${perm.name}`);
        }
      }
    }

    console.log('\n📊 Permission Sync Summary:');
    console.log(`   ✅ Added: ${added}`);
    console.log(`   🗑️  Removed: ${removed}`);
    console.log(`   📝 Total permissions for SUPER_ADMIN: ${allPermissions.length}`);

    if (added === 0 && removed === 0) {
      console.log('\n✨ SUPER_ADMIN đã có đầy đủ tất cả permissions!');
    } else {
      console.log('\n✨ Đồng bộ permissions cho SUPER_ADMIN thành công!');
    }
  } catch (error) {
    console.error('❌ Error syncing SUPER_ADMIN permissions:', error);
  }
};

createAdminUser();
