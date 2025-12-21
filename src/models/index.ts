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
import Category from './Category.model';
import Product from './Product.model';
import ProductImage from './ProductImage.model';
import ProductVariant from './ProductVariant.model';
import ProductVariantOption from './ProductVariantOption.model';
import ProductStock from './ProductStock.model';
import ProductReview from './ProductReview.model';
import ProductQuestion from './ProductQuestion.model';
import Cart from './Cart.model';
import CartItem from './CartItem.model';
import FavoriteShop from './FavoriteShop.model';
import FavoriteItem from './FavoriteItem.model';
import { associations } from './associations';

const env = process.env.NODE_ENV || 'development';
const config = require(path.resolve(__dirname, '../../src/config/config.js'))[env];

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
const CategoryModel = Category.initModel(sequelize);
const ProductModel = Product.initModel(sequelize);
const ProductImageModel = ProductImage.initModel(sequelize);
const ProductVariantModel = ProductVariant.initModel(sequelize);
const ProductVariantOptionModel = ProductVariantOption.initModel(sequelize);
const ProductStockModel = ProductStock.initModel(sequelize);
const ProductReviewModel = ProductReview.initModel(sequelize);
const ProductQuestionModel = ProductQuestion.initModel(sequelize);
const CartModel = Cart.initModel(sequelize);
const CartItemModel = CartItem.initModel(sequelize);
const FavoriteShopModel = FavoriteShop.initModel(sequelize);
const FavoriteItemModel = FavoriteItem.initModel(sequelize);

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
    Category: CategoryModel,
    Product: ProductModel,
    ProductImage: ProductImageModel,
    ProductVariant: ProductVariantModel,
    ProductVariantOption: ProductVariantOptionModel,
    ProductStock: ProductStockModel,
    ProductReview: ProductReviewModel,
    ProductQuestion: ProductQuestionModel,
    Cart: CartModel,
    CartItem: CartItemModel,
    FavoriteShop: FavoriteShopModel,
    FavoriteItem: FavoriteItemModel,
};

associations(models);

export { sequelize };
export default models;
