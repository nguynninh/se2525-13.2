import { Request, Response, NextFunction } from 'express';
import { addToCart, updateCartItem, removeCartItem, clearCart, getCart, getCartSummary } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, CartResponseDto, CartItemResponseDto, CartSummaryDto } from './cart.dto';
import response from '../../utils/response';

export const addCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        const data: AddToCartDto = req.body;

        const cartItem: CartItemResponseDto = await addToCart(userId, data);

        response.created(res, cartItem, 'cart:item_added');
    } catch (error) {
        next(error);
    }
};

export const updateCartItemController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        const cartItemId = req.params.id;
        const data: UpdateCartItemDto = req.body;

        const cartItem: CartItemResponseDto = await updateCartItem(userId, cartItemId, data);

        response.ok(res, cartItem, 'cart:item_updated');
    } catch (error) {
        next(error);
    }
};

export const removeCartItemController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        const cartItemId = req.params.id;

        await removeCartItem(userId, cartItemId);

        response.ok(res, null, 'cart:item_removed');
    } catch (error) {
        next(error);
    }
};

export const clearCartController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;

        await clearCart(userId);

        response.ok(res, null, 'cart:cleared');
    } catch (error) {
        next(error);
    }
};

export const getCartController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;

        const cart: CartResponseDto = await getCart(userId);

        response.ok(res, cart, 'cart:retrieved');
    } catch (error) {
        next(error);
    }
};

export const getCartSummaryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;

        const summary: CartSummaryDto = await getCartSummary(userId);

        response.ok(res, summary, 'cart:summary_retrieved');
    } catch (error) {
        next(error);
    }
};
