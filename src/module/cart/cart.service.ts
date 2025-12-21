import { Cart } from '../../models/Cart.model';
import { CartItem } from '../../models/CartItem.model';
import { Product } from '../../models/Product.model';
import { ProductImage } from '../../models/ProductImage.model';
import { Shop } from '../../models/Shop.model';
import { NotFoundError, BadRequestError } from '../../exception/AppError';
import type { AddToCartDto, UpdateCartItemDto, CartResponseDto, CartItemResponseDto, CartSummaryDto } from './cart.dto';

const getOrCreateCart = async (userId: string) => {
    let cart = await Cart.findOne({
        where: { user_id: userId },
        include: [
            {
                model: Shop,
                as: 'shop',
                attributes: ['id', 'name', 'slug', 'description', 'logo_url', 'status']
            },
            {
                model: CartItem,
                as: 'cart_items',
                include: [
                    {
                        model: Product,
                        as: 'product',
                        include: [
                            {
                                model: ProductImage,
                                as: 'images',
                                where: { is_main: true },
                                required: false
                            }
                        ]
                    }
                ]
            }
        ]
    });

    if (!cart) {
        cart = await Cart.create({
            user_id: userId,
            shop_id: null,
            total_items: 0,
            total_price: 0
        });
    }

    return cart;
};

const calculateCartTotals = async (cartId: string) => {
    const cartItems = await CartItem.findAll({
        where: { cart_id: cartId }
    });

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.total_price), 0);

    // Reset shop_id if cart is empty
    const updateData: any = { total_items: totalItems, total_price: totalPrice };
    if (totalItems === 0) {
        updateData.shop_id = null;
    }

    await Cart.update(updateData, { where: { id: cartId } });

    return { total_items: totalItems, total_price: totalPrice };
};

export const addToCart = async (userId: string, data: AddToCartDto): Promise<CartItemResponseDto> => {
    const { product_id, quantity } = data;

    // Check if product exists and is active
    const product = await Product.findByPk(product_id);
    if (!product) {
        throw new NotFoundError('product:not_found');
    }

    if (product.status !== 'active') {
        throw new BadRequestError('product:not_available');
    }

    if (product.quantity < quantity) {
        throw new BadRequestError('product:insufficient_stock');
    }

    const cart = await getOrCreateCart(userId);

    // Check if cart already has items from a different shop
    if (cart.shop_id && cart.shop_id !== product.shop_id) {
        throw new BadRequestError('cart:shop_mismatch');
    }

    // Set shop_id if cart is empty
    if (!cart.shop_id && product.shop_id) {
        await cart.update({ shop_id: product.shop_id });
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
        where: { 
            cart_id: cart.id, 
            product_id 
        },
        include: [
            {
                model: Product,
                as: 'product',
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        where: { is_main: true },
                        required: false
                    }
                ]
            }
        ]
    });

    if (cartItem) {
        // Update existing item
        const newQuantity = cartItem.quantity + quantity;
        
        if (product.quantity < newQuantity) {
            throw new BadRequestError('product:insufficient_stock');
        }

        const unitPrice = Number(product.price);
        const totalPrice = unitPrice * newQuantity;

        await cartItem.update({
            quantity: newQuantity,
            unit_price: unitPrice,
            total_price: totalPrice
        });
    } else {
        // Create new cart item
        const unitPrice = Number(product.price);
        const totalPrice = unitPrice * quantity;

        cartItem = await CartItem.create({
            cart_id: cart.id,
            product_id,
            quantity,
            unit_price: unitPrice,
            total_price: totalPrice
        });

        // Reload with product data
        cartItem = await CartItem.findByPk(cartItem.id, {
            include: [
                {
                    model: Product,
                    as: 'product',
                    include: [
                        {
                            model: ProductImage,
                            as: 'images',
                            where: { is_main: true },
                            required: false
                        }
                    ]
                }
            ]
        });
    }

    // Update cart totals
    await calculateCartTotals(cart.id);

    return cartItem!.toJSON() as CartItemResponseDto;
};

export const updateCartItem = async (userId: string, cartItemId: string, data: UpdateCartItemDto): Promise<CartItemResponseDto> => {
    const { quantity } = data;

    const cartItem = await CartItem.findByPk(cartItemId, {
        include: [
            {
                model: Cart,
                as: 'cart',
                where: { user_id: userId }
            },
            {
                model: Product,
                as: 'product',
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        where: { is_main: true },
                        required: false
                    }
                ]
            }
        ]
    });

    if (!cartItem) {
        throw new NotFoundError('cart:item_not_found');
    }

    const product = (cartItem as any).product;
    if (!product) {
        throw new NotFoundError('product:not_found');
    }

    if (product.quantity < quantity) {
        throw new BadRequestError('product:insufficient_stock');
    }

    const unitPrice = Number(product.price);
    const totalPrice = unitPrice * quantity;

    await cartItem.update({
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice
    });

    // Update cart totals
    await calculateCartTotals(cartItem.cart_id);

    return cartItem.toJSON() as CartItemResponseDto;
};

export const removeCartItem = async (userId: string, cartItemId: string): Promise<void> => {
    const cartItem = await CartItem.findByPk(cartItemId, {
        include: [
            {
                model: Cart,
                as: 'cart',
                where: { user_id: userId }
            }
        ]
    });

    if (!cartItem) {
        throw new NotFoundError('cart:item_not_found');
    }

    const cartId = cartItem.cart_id;
    await cartItem.destroy();

    // Update cart totals
    await calculateCartTotals(cartId);
};

export const clearCart = async (userId: string): Promise<void> => {
    const cart = await Cart.findOne({
        where: { user_id: userId }
    });

    if (!cart) {
        throw new NotFoundError('cart:not_found');
    }

    await CartItem.destroy({
        where: { cart_id: cart.id }
    });

    // Reset cart totals and shop_id
    await cart.update({
        shop_id: null,
        total_items: 0,
        total_price: 0
    });
};

export const getCart = async (userId: string): Promise<CartResponseDto> => {
    const cart = await Cart.findOne({
        where: { user_id: userId },
        include: [
            {
                model: Shop,
                as: 'shop',
                attributes: ['id', 'name', 'slug', 'description', 'logo_url', 'status']
            },
            {
                model: CartItem,
                as: 'cart_items',
                include: [
                    {
                        model: Product,
                        as: 'product',
                        include: [
                            {
                                model: ProductImage,
                                as: 'images',
                                where: { is_main: true },
                                required: false
                            }
                        ]
                    }
                ]
            }
        ]
    });

    if (!cart) {
        // Return empty cart structure
        return {
            id: '',
            user_id: userId,
            shop_id: null,
            total_items: 0,
            total_price: 0,
            cart_items: [],
            created_at: new Date(),
            updated_at: new Date()
        };
    }

    return cart.toJSON() as CartResponseDto;
};

export const getCartSummary = async (userId: string): Promise<CartSummaryDto> => {
    const cart = await Cart.findOne({
        where: { user_id: userId },
        include: [
            {
                model: CartItem,
                as: 'cart_items',
                required: false
            }
        ]
    });

    if (!cart) {
        return {
            total_items: 0,
            total_price: 0,
            items_count: 0
        };
    }

    return {
        total_items: cart.total_items,
        total_price: Number(cart.total_price),
        items_count: (cart as any).cart_items?.length || 0
    };
};
