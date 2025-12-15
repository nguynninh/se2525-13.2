import { Router } from 'express';
import { authenticate, restrictTo } from '../../../middlewares/auth.middleware';
import { uploadImage } from '../../../middlewares/upload.middleware';
import { ProductController } from '../../../module/product/product.controller';
import { v } from '../../../utils/zod.format';
import {
    CreateCategorySchema,
    UpdateCategorySchema,
    CreateProductSchema,
    UpdateProductSchema,
    FilterProductQuerySchema,
    AddProductImageSchema,
    CreateProductVariantSchema,
    CreateProductVariantOptionSchema,
    CreateProductStockSchema,
    UpdateProductStockSchema,
    CreateReviewSchema,
    CreateQuestionSchema,
    AnswerQuestionSchema,
} from '../../../module/product/product.schema';

const router = Router();

router.get('/categories', ProductController.getCategories);
router.get('/products/categories', ProductController.getCategories);

router.post(
    '/categories',
    authenticate,
    restrictTo('admin'),
    v({ body: CreateCategorySchema }),
    ProductController.createCategory
);

router.patch(
    '/categories/:id',
    authenticate,
    restrictTo('admin'),
    v({ body: UpdateCategorySchema }),
    ProductController.updateCategory
);

router.get('/products', v({ query: FilterProductQuerySchema }), ProductController.getProducts);

router.post(
    '/products',
    authenticate,
    restrictTo('seller', 'admin'),
    v({ body: CreateProductSchema }),
    ProductController.createProduct
);

router.post(
    '/products/images',
    authenticate,
    restrictTo('seller', 'admin'),
    uploadImage('file', 5),
    v({ body: AddProductImageSchema }),
    ProductController.addProductImage
);

router.post(
    '/products/variants',
    authenticate,
    restrictTo('seller', 'admin'),
    v({ body: CreateProductVariantSchema }),
    ProductController.createVariant
);

router.post(
    '/products/variants/options',
    authenticate,
    restrictTo('seller', 'admin'),
    v({ body: CreateProductVariantOptionSchema }),
    ProductController.createVariantOption
);

router.post(
    '/products/stocks',
    authenticate,
    restrictTo('seller', 'admin'),
    v({ body: CreateProductStockSchema }),
    ProductController.createStock
);

router.post(
    '/products/reviews',
    authenticate,
    restrictTo('customer', 'seller'),
    v({ body: CreateReviewSchema }),
    ProductController.createReview
);

router.post(
    '/products/questions',
    authenticate,
    restrictTo('customer', 'seller'),
    v({ body: CreateQuestionSchema }),
    ProductController.createQuestion
);

router.patch(
    '/products/stocks/:id',
    authenticate,
    restrictTo('seller', 'admin'),
    v({ body: UpdateProductStockSchema }),
    ProductController.updateStock
);

router.patch(
    '/products/questions/:id/answer',
    authenticate,
    restrictTo('seller', 'admin'),
    v({ body: AnswerQuestionSchema }),
    ProductController.answerQuestion
);

router.get('/products/:id/reviews', ProductController.getReviews);
router.get('/products/:id/questions', ProductController.getQuestions);

router.get('/products/:id', ProductController.getProductById);

router.patch(
    '/products/:id',
    authenticate,
    restrictTo('seller', 'admin'),
    v({ body: UpdateProductSchema }),
    ProductController.updateProduct
);

router.delete(
    '/products/:id',
    authenticate,
    restrictTo('seller', 'admin'),
    ProductController.deleteProduct
);

export default router;