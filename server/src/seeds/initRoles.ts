import { RoleModel } from '../models';

export const initRoles = async (): Promise<void> => {
    try {
        const userRole = await RoleModel.findOne({ where: { name: 'USER' } });
        
        if (!userRole) {
            await RoleModel.create({ name: 'USER' });
            console.log('✓ Role "USER" đã được khởi tạo thành công');
        }

        const superAdminRole = await RoleModel.findOne({ where: { name: 'SUPER_ADMIN' } });
        
        if (!superAdminRole) {
            await RoleModel.create({ name: 'SUPER_ADMIN' });
            console.log('✓ Role "SUPER_ADMIN" đã được khởi tạo thành công');
        }
    } catch (error) {
        console.error('Lỗi khi khởi tạo role:', error);
        throw error;
    }
};
