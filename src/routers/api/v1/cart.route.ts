import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import {
    addCartItem,
    updateCartItemController,
    removeCartItemController,
    clearCartController,
    getCartController,
    getCartSummaryController
} from '../../../module/cart/cart.controller';

const router = Router();

// Apply authentication middleware to all cart routes
router.use(authenticate);

// POST /api/v1/cart - Add item to cart
router.post('/', addCartItem);

// PUT /api/v1/cart/:id - Update cart item quantity
router.put('/:id', updateCartItemController);

// DELETE /api/v1/cart/:id - Remove item from cart
router.delete('/:id', removeCartItemController);

// DELETE /api/v1/cart - Clear entire cart
router.delete('/', clearCartController);

// GET /api/v1/cart - Get user's cart
router.get('/', getCartController);

// GET /api/v1/cart/summary - Get cart summary
router.get('/summary', getCartSummaryController);

export default router;
