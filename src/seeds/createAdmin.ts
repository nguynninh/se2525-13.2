import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel';
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

    const existingAdmin = await UserModel.findOne({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', adminEmail);
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

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🆔 ID:', admin.get('id'));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
