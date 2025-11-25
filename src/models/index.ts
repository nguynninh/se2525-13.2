'use strict';

import path from 'path';
import { Sequelize } from 'sequelize';
import User from './User.model';
import Customer from './Customer.model';
import Seller from './Seller.model';
import Admin from './Admin.model';
import Shop from './Shop.model';
import SellerApplication from './SellerApplication.model';
import Address from './Address.model';
import Province from './Provinces.model';
import Ward from './Wards.model';
import ShippingAddress from './ShippingAddress.model';
import OrderAddress from './OrderAddress.model';
import { associations } from './associations';

const env = process.env.NODE_ENV || 'development';
const config = require(path.resolve(__dirname, '../../src/config/config.js'))[env];

// Khởi tạo sequelize instance
let sequelize: Sequelize;
if (config.use_env_variable) {
    const key = String(config.use_env_variable);
    const uri = process.env[key];
    if (!uri) {
        throw new Error(`Environment variable "${key}" is not set, but config.use_env_variable is provided.`);
    }
    sequelize = new Sequelize(uri, config);
} else {
    sequelize = new Sequelize(String(config.database), String(config.username), config.password ?? undefined, config);
}

// Init model
const UserModel = User.initModel(sequelize);
const CustomerModel = Customer.initModel(sequelize);
const SellerModel = Seller.initModel(sequelize);
const AdminModel = Admin.initModel(sequelize);
const ShopModel = Shop.initModel(sequelize);
const SellerApplicationModel = SellerApplication.initModel(sequelize);
const AddressModel = Address.initModel(sequelize);
const ProvinceModel = Province.initModel(sequelize);
const WardModel = Ward.initModel(sequelize);
const ShippingAddressModel = ShippingAddress.initModel(sequelize);
const OrderAddressModel = OrderAddress.initModel(sequelize);

export const models = {
    User: UserModel,
    Customer: CustomerModel,
    Seller: SellerModel,
    Admin: AdminModel,
    Shop: ShopModel,
    SellerApplication: SellerApplicationModel,
    Address: AddressModel,
    Province: ProvinceModel,
    Ward: WardModel,
    ShippingAddress: ShippingAddressModel,
    OrderAddress: OrderAddressModel,
};

associations(models);

export { sequelize };
export default models;
