import { Request, Response, NextFunction } from 'express';
import {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProducts,
    addProductImage,
    createVariant,
    createVariantOption,
    createStock,
    updateStock,
    createReview,
    getReviews,
    createQuestion,
    answerQuestion,
    getQuestions
} from './product.service';
import { Shop } from '../../models/Shop.model';
import { Seller } from '../../models/Seller.model';
import { AppError } from '../../exception/AppError';
import { ValidationError } from '../../exception/AppError';
import { uploadFileToMinIO } from '../../utils/upload';

export const ProductController = {
    createCategory: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await createCategory(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    updateCategory: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await updateCategory(req.params.id, req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    getCategories: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await getCategories();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteCategory(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    createProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;

            const seller = await Seller.findOne({ where: { user_id: userId } });
            
            if (!seller) {
                throw new AppError('product:user_is_not_seller', 403);
            }

            const shop = await Shop.findOne({ where: { seller_id: seller.id } as any });
            
            if (!shop) {
                throw new AppError('product:user_has_no_shop', 403);
            }

            const productData = {
                ...req.body,
                shop_id: shop.id,
            };

            const result = await createProduct(productData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    getMyProducts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const seller = await Seller.findOne({ where: { user_id: userId } });
            
            if (!seller) {
                throw new AppError('product:user_is_not_seller', 403);
            }

            const shop = await Shop.findOne({ where: { seller_id: seller.id } as any });
            
            if (!shop) {
                throw new AppError('product:user_has_no_shop', 403);
            }

            const result = await getProducts({ 
                ...req.query, 
                shop_id: shop.id 
            });
            res.status(200).json({ products: result.products });
        } catch (error) {
            next(error);
        }
    },

    updateProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await updateProduct(req.params.id, req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteProduct(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    getProductById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await getProductById(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    getProducts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await getProducts(req.query as any);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    addProductImage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file;
            if (!file) {
                throw new ValidationError('upload:file_required');
            }

            const imageUrl = await uploadFileToMinIO(file.originalname, file.buffer, file.mimetype, 'uploads/products');
            const payload = {
                ...req.body,
                image_url: imageUrl,
            };

            const result = await addProductImage(payload);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    createVariant: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await createVariant(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    createVariantOption: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await createVariantOption(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    createStock: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await createStock(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    updateStock: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await updateStock(req.params.id, req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    createReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const result = await createReview(userId, req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    getReviews: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await getReviews(req.params.id, page, limit);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    createQuestion: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const result = await createQuestion(userId, req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    answerQuestion: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const result = await answerQuestion(req.params.id, userId, req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    getQuestions: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await getQuestions(req.params.id, page, limit);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
};
