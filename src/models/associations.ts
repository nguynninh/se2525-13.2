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
import type Category from './Category.model';
import type Product from './Product.model';
import type ProductImage from './ProductImage.model';
import type ProductVariant from './ProductVariant.model';
import type ProductVariantOption from './ProductVariantOption.model';
import type ProductStock from './ProductStock.model';
import type ProductReview from './ProductReview.model';
import type ProductQuestion from './ProductQuestion.model';

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
    Category?: ModelStatic<Category>;
    Product?: ModelStatic<Product>;
    ProductImage?: ModelStatic<ProductImage>;
    ProductVariant?: ModelStatic<ProductVariant>;
    ProductVariantOption?: ModelStatic<ProductVariantOption>;
    ProductStock?: ModelStatic<ProductStock>;
    ProductReview?: ModelStatic<ProductReview>;
    ProductQuestion?: ModelStatic<ProductQuestion>;
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
        Category,
        Product,
        ProductImage,
        ProductVariant,
        ProductVariantOption,
        ProductStock,
        ProductReview,
        ProductQuestion
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
        Address.hasOne(Shop, {
            foreignKey: 'address_id',
            as: 'shop',
        });

        Shop.belongsTo(Address, {
            foreignKey: 'address_id',
            as: 'address',
        });
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

    if (Category) {
        Category.hasMany(Category, { foreignKey: 'parent_id', as: 'children' });
        Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });
    }

    if (Category && Product) {
        Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
        Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
    }

    if (Shop && Product) {
        Shop.hasMany(Product, { foreignKey: 'shop_id', as: 'products' });
        Product.belongsTo(Shop, { foreignKey: 'shop_id', as: 'shop' });
    }

    if (Product && ProductImage) {
        Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
        ProductImage.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
    }

    if (Product && ProductVariant) {
        Product.hasMany(ProductVariant, { foreignKey: 'product_id', as: 'variants' });
        ProductVariant.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
    }

    if (Product && ProductStock) {
        Product.hasMany(ProductStock, { foreignKey: 'product_id', as: 'stocks' });
        ProductStock.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
    }

    if (ProductVariant && ProductVariantOption) {
        ProductVariant.hasMany(ProductVariantOption, { foreignKey: 'variant_id', as: 'options' });
        ProductVariantOption.belongsTo(ProductVariant, { foreignKey: 'variant_id', as: 'variant' });
    }

    if (Product && ProductReview) {
        Product.hasMany(ProductReview, { foreignKey: 'product_id', as: 'reviews' });
        ProductReview.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
    }
    
    if (User && ProductReview) {
        User.hasMany(ProductReview, { foreignKey: 'user_id', as: 'product_reviews' });
        ProductReview.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    }

    if (Product && ProductQuestion) {
        Product.hasMany(ProductQuestion, { foreignKey: 'product_id', as: 'questions' });
        ProductQuestion.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
    }

    if (User && ProductQuestion) {
        User.hasMany(ProductQuestion, { foreignKey: 'user_id', as: 'questions' });
        ProductQuestion.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
        
        User.hasMany(ProductQuestion, { foreignKey: 'answered_by', as: 'questions_answered' });
        ProductQuestion.belongsTo(User, { foreignKey: 'answered_by', as: 'answerer' });
    }
}