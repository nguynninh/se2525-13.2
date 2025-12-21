export interface AddToCartDto {
    product_id: string;
    quantity: number;
}

export interface UpdateCartItemDto {
    quantity: number;
}

export interface CartItemResponseDto {
    id: string;
    cart_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    product?: {
        id: string;
        name: string;
        slug: string;
        sku: string | null;
        description: string | null;
        price: number;
        quantity: number;
        status: string;
        images?: {
            id: string;
            image_url: string;
            is_main: boolean;
        }[];
    };
    created_at: Date;
    updated_at: Date;
}

export interface CartResponseDto {
    id: string;
    user_id: string;
    total_items: number;
    total_price: number;
    cart_items: CartItemResponseDto[];
    created_at: Date;
    updated_at: Date;
}

export interface CartSummaryDto {
    total_items: number;
    total_price: number;
    items_count: number;
}
