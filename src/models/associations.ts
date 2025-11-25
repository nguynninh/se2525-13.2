import type { ModelStatic } from 'sequelize';
import type User from './User.model';
import type Customer from './Customer.model';
import type Seller from './Seller.model';
import type Admin from './Admin.model';
import type Shop from './Shop.model';
import type SellerApplication from './SellerApplication.model';
import type Province from './Provinces.model';
import type Ward from './Wards.model';
import type Address from './Address.model';
import type ShippingAddress from './ShippingAddress.model';
import type OrderAddress from './OrderAddress.model';

type Models = {
    User: ModelStatic<User>;
    Customer: ModelStatic<Customer>;
    Seller?: ModelStatic<Seller>;
    Admin?: ModelStatic<Admin>;
    Shop?: ModelStatic<Shop>;
    SellerApplication?: ModelStatic<SellerApplication>;
    Province?: ModelStatic<Province>;
    Ward?: ModelStatic<Ward>;
    Address?: ModelStatic<Address>;
    ShippingAddress?: ModelStatic<ShippingAddress>;
    OrderAddress?: ModelStatic<OrderAddress>;
};

export function associations(models: Models) {
    const {
        User,
        Customer,
        Seller,
        Admin,
        Shop,
        SellerApplication,
        Province,
        Ward,
        Address,
        ShippingAddress,
        OrderAddress,
    } = models;

    if (User && Customer) {
        User.hasOne(Customer, { foreignKey: 'user_id', as: 'customer' });
        Customer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    }

    if (User && Seller) {
        User.hasOne(Seller, { foreignKey: 'user_id', as: 'seller' });
        Seller.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    }

    if (User && Admin) {
        User.hasOne(Admin, { foreignKey: 'user_id', as: 'admin' });
        Admin.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    }

    if (User && SellerApplication) {
        User.hasMany(SellerApplication, { foreignKey: 'user_id', as: 'seller_applications' });
        SellerApplication.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
        User.hasMany(SellerApplication, { foreignKey: 'reviewed_by', as: 'reviewed_seller_applications' });
        SellerApplication.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });
    }

    if (User && ShippingAddress) {
        User.hasMany(ShippingAddress, {
            foreignKey: 'user_id',
            as: 'shipping_addresses',
        });

        ShippingAddress.belongsTo(User, {
            foreignKey: 'user_id',
            as: 'user',
        });
    }

    if (Seller && Shop) {
        Seller.hasMany(Shop, { foreignKey: 'seller_id', as: 'shops' });
        Shop.belongsTo(Seller, { foreignKey: 'seller_id', as: 'seller' });
    }

    if (Province && Ward) {
        Province.hasMany(Ward, { foreignKey: 'province_id', as: 'wards' });
        Ward.belongsTo(Province, { foreignKey: 'province_id', as: 'province' });
    }

    if (Ward && Address) {
        Ward.hasMany(Address, { foreignKey: 'ward_id', as: 'addresses' });
        Address.belongsTo(Ward, { foreignKey: 'ward_id', as: 'ward' });
    }

    if (Address && Shop) {
        Shop.hasOne(Address, { foreignKey: 'shop_id', as: 'address' });
        Address.belongsTo(Shop, { foreignKey: 'shop_id', as: 'shop' });
    }

    if (Address && ShippingAddress) {
        Address.hasMany(ShippingAddress, {
            foreignKey: 'address_id',
            as: 'shipping_addresses',
        });

        ShippingAddress.belongsTo(Address, {
            foreignKey: 'address_id',
            as: 'address',
        });
    }

    if (Ward && OrderAddress) {
        Ward.hasMany(OrderAddress, {
            foreignKey: 'ward_id',
            as: 'order_addresses',
        });

        OrderAddress.belongsTo(Ward, {
            foreignKey: 'ward_id',
            as: 'ward',
        });
    }
}
