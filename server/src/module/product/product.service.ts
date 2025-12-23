import { Op } from 'sequelize';
import { Product } from '../../models/Product.model';
import { Shop } from '../../models/Shop.model';
import { Category } from '../../models/Category.model';
import { ProductImage } from '../../models/ProductImage.model';
import { ProductVariant } from '../../models/ProductVariant.model';
import { ProductVariantOption } from '../../models/ProductVariantOption.model';
import { ProductStock } from '../../models/ProductStock.model';
import { ProductReview } from '../../models/ProductReview.model';
import { ProductQuestion } from '../../models/ProductQuestion.model';
import { User } from '../../models/User.model';
import { NotFoundError } from '../../exception/AppError';

const generateSlug = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;

export const createCategory = async (data: any) => {
    if (!data.slug && data.name) {
        data.slug = generateSlug(data.name);
    }
    return await Category.create(data);
};

export const updateCategory = async (id: string, data: any) => {
    const category = await Category.findByPk(id);
    if (!category) {
        throw new NotFoundError('product:category_not_found');
    }
    if (data.name && !data.slug) {
        data.slug = generateSlug(data.name);
    }
    return await category.update(data);
};

export const deleteCategory = async (id: string) => {
    const category = await Category.findByPk(id);
    if (!category) {
        throw new NotFoundError('product:category_not_found');
    }
    await category.destroy();
};

export const getCategories = async () => {
    return await Category.findAll();
};

export const createProduct = async (data: any) => {
    if (!data.slug && data.name) {
        const uniqueSuffix = Date.now().toString().slice(-4);
        data.slug = `${generateSlug(data.name)}-${uniqueSuffix}`;
    }
    
    return await Product.create(data);
};

export const updateProduct = async (id: string, data: any) => {
    const product = await Product.findByPk(id);
    if (!product) {
        throw new NotFoundError('product:not_found');
    }
    if (data.name && !data.slug) {
        const uniqueSuffix = Date.now().toString().slice(-4);
        data.slug = `${generateSlug(data.name)}-${uniqueSuffix}`;
    }
    return await product.update(data);
};

export const deleteProduct = async (id: string) => {
    const product = await Product.findByPk(id);
    if (!product) {
        throw new NotFoundError('product:not_found');
    }
    await product.destroy();
};

export const getProductById = async (id: string) => {
    if (!uuidRegex.test(id)) {
        throw new NotFoundError('product:not_found');
    }

    const product = await Product.findByPk(id, {
        include: [
            {
                model: ProductImage,
                as: 'images',
                attributes: ['id', 'image_url', 'is_main']
            },
            {
                model: ProductVariant,
                as: 'variants',
                include: [{
                    model: ProductVariantOption,
                    as: 'options'
                }]
            },
            {
                model: ProductStock,
                as: 'stocks'
            },
            {
                model: Shop,
                as: 'shop',
                attributes: ['id', 'name', 'slug']
            },
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }
        ]
    });

    if (!product) {
        throw new NotFoundError('product:not_found');
    }

    return product;
};

export const getProducts = async (query: any) => {
    const {
        page = 1,
        limit = 10,
        keyword,
        category_id,
        shop_id,
        min_price,
        max_price,
        sort,
        status
    } = query;

    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (status) {
        where.status = status;
    } else {
        where.status = 'active';
    }

    if (keyword) {
        where.name = { [Op.iLike]: `%${keyword}%` };
    }

    if (category_id) where.category_id = category_id;
    if (shop_id) where.shop_id = shop_id;

    if (min_price || max_price) {
        where.price = {};
        if (min_price) where.price[Op.gte] = Number(min_price);
        if (max_price) where.price[Op.lte] = Number(max_price);
    }

    let order: any = [['created_at', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    if (sort === 'price_desc') order = [['price', 'DESC']];
    if (sort === 'sold_desc') order = [['sold_count', 'DESC']];
    if (sort === 'newest') order = [['created_at', 'DESC']];

    const { rows, count } = await Product.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order,
        include: [
            {
                model: ProductImage,
                as: 'images',
                where: { is_main: true },
                required: false
            }
        ],
        distinct: true
    });

    return {
        data: rows,
        pagination: {
            total: count,
            page: Number(page),
            limit: Number(limit),
            total_pages: Math.ceil(count / Number(limit))
        }
    };
};

export const addProductImage = async (data: any) => {
    return await ProductImage.create(data);
};

export const createVariant = async (data: any) => {
    return await ProductVariant.create(data);
};

export const createVariantOption = async (data: any) => {
    return await ProductVariantOption.create(data);
};

export const createStock = async (data: any) => {
    const { option_ids, tier_index, ...rest } = data;
    let optionIdsString = '';
    
    if (Array.isArray(option_ids)) {
        optionIdsString = option_ids.join(','); 
    } else if (typeof option_ids === 'string') {
        optionIdsString = option_ids;
    }

    return await ProductStock.create({
        ...rest,
        option_ids: optionIdsString
    });
};

export const updateStock = async (id: string, data: any) => {
    const stock = await ProductStock.findByPk(id);
    if (!stock) {
        throw new NotFoundError('product:stock_not_found');
    }

    if (data.option_ids) {
        if (Array.isArray(data.option_ids)) {
            data.option_ids = data.option_ids.join(',');
        }
    }

    return await stock.update(data);
};

export const createReview = async (userId: string, data: any) => {
    const product = await Product.findByPk(data.product_id);
    if (!product) {
        throw new NotFoundError('product:not_found');
    }

    const user = await User.findByPk(userId); 
    
    if (user?.role === 'seller') {
        try {
            const shop = await Shop.findOne({ where: { id: product.shop_id } });
            
            const shopOwnerId = shop ? (shop as any).user_id : null; 

            if (shopOwnerId && shopOwnerId === userId) {
                 throw new Error('review:cannot_review_own_product');
            }
        } catch (error) {
            if ((error as Error).message === 'review:cannot_review_own_product') {
                throw error;
            }
        }
    }

    return await ProductReview.create({
        ...data,
        user_id: userId
    });
};

export const getReviews = async (productId: string, page: number, limit: number) => {
    if (!uuidRegex.test(productId)) {
        return {
            data: [],
            pagination: {
                total: 0,
                page: Number(page),
                limit: Number(limit),
                total_pages: 0
            }
        };
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await ProductReview.findAndCountAll({
        where: { product_id: productId },
        limit,
        offset,
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name', 'profile_url']
            }
        ]
    });

    return {
        data: rows,
        pagination: {
            total: count,
            page,
            limit,
            total_pages: Math.ceil(count / limit)
        }
    };
};

export const createQuestion = async (userId: string, data: any) => {
    return await ProductQuestion.create({
        ...data,
        user_id: userId
    });
};

export const answerQuestion = async (questionId: string, userId: string, data: any) => {
    const question = await ProductQuestion.findByPk(questionId);
    if (!question) {
        throw new NotFoundError('product:question_not_found');
    }
    return await question.update({
        answer: data.answer,
        answered_by: userId
    });
};

export const getQuestions = async (productId: string, page: number, limit: number) => {
    if (!uuidRegex.test(productId)) {
        return {
            data: [],
            pagination: {
                total: 0,
                page: Number(page),
                limit: Number(limit),
                total_pages: 0
            }
        };
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await ProductQuestion.findAndCountAll({
        where: { product_id: productId },
        limit,
        offset,
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name', 'profile_url']
            },
            {
                model: User,
                as: 'answerer',
                attributes: ['id', 'first_name', 'last_name', 'profile_url']
            }
        ]
    });

    return {
        data: rows,
        pagination: {
            total: count,
            page,
            limit,
            total_pages: Math.ceil(count / limit)
        }
    };
};
