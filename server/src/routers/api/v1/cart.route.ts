import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import {
    addCartItem,
    updateCartItemController,
    removeCartItemController,
    increaseCartItemController,
    decreaseCartItemController,
    clearCartController,
    getCartController,
    getCartSummaryController,
} from '../../../module/cart/cart.controller';
import { v } from '../../../utils/zod.format';
import { addToCartSchema, updateCartItemSchema, removeCartItemSchema } from '../../../module/cart/cart.schema';

const router = Router();

// Apply authentication middleware to all cart routes
router.use(authenticate);

// POST /api/cart - Add item to cart
router.post('/', v(addToCartSchema), addCartItem);

// PUT /api/cart/:id - Update cart item quantity
router.put('/:id', v(updateCartItemSchema), updateCartItemController);

// PATCH /api/cart/:id/increase - Increase quantity by 1
router.patch('/:id/increase', v({ params: updateCartItemSchema.shape.params }), increaseCartItemController);

// PATCH /api/cart/:id/decrease - Decrease quantity by 1
router.patch('/:id/decrease', v({ params: updateCartItemSchema.shape.params }), decreaseCartItemController);

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', v(removeCartItemSchema), removeCartItemController);

// DELETE /api/cart - Clear entire cart
router.delete('/', clearCartController);

// GET /api/cart - Get user's cart
router.get('/', getCartController);

// GET /api/cart/summary - Get cart summary
router.get('/summary', getCartSummaryController);

export default router;
