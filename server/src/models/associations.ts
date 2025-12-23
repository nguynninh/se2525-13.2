import UserModel from './UserModel';
import RoleModel from './RoleModel';
import PermissionModel from './PermissionModel';

UserModel.belongsToMany(RoleModel, {
    through: 'user_roles',
    foreignKey: 'user_id',
    otherKey: 'role_id',
    as: 'roles',
});

RoleModel.belongsToMany(UserModel, {
    through: 'user_roles',
    foreignKey: 'role_id',
    otherKey: 'user_id',
    as: 'users',
});

RoleModel.belongsToMany(PermissionModel, {
    through: 'role_permissions',
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: 'permissions',
});

PermissionModel.belongsToMany(RoleModel, {
    through: 'role_permissions',
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    as: 'roles',
});

export { UserModel, RoleModel, PermissionModel };
