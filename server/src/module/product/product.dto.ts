export interface CreateProductDto {
    shop_id: string;
    category_id: string;
    name: string;
    slug?: string;
    sku?: string;
    description?: string;
    status?: 'draft' | 'active' | 'hidden' | 'banned';
    price: number;
    quantity: number;
}

export interface UpdateProductDto {
    category_id?: string;
    name?: string;
    sku?: string;
    description?: string;
    status?: 'draft' | 'active' | 'hidden' | 'banned';
    price?: number;
    quantity?: number;
}

export interface FilterProductDto {
    page?: number;
    limit?: number;
    sort?: 'price_asc' | 'price_desc' | 'sold_desc' | 'newest' | 'rating_desc';
    min_price?: number;
    max_price?: number;
    category_id?: string;
    shop_id?: string;
    keyword?: string;
    status?: 'draft' | 'active' | 'hidden' | 'banned';
}

export interface AddProductImageDto {
    product_id: string;
    image_url: string;
    is_main?: boolean;
}

export interface CreateProductVariantDto {
    product_id: string;
    name: string;
}

export interface CreateProductVariantOptionDto {
    variant_id: string;
    value: string;
}

export interface CreateProductStockDto {
    product_id: string;
    option_ids: string;
    sku?: string;
    price: number;
    quantity: number;
}

export interface UpdateProductStockDto {
    sku?: string;
    price?: number;
    quantity?: number;
}

export interface ProductImageResponseDto {
    id: string;
    image_url: string;
    is_main: boolean;
}

export interface ProductVariantOptionResponseDto {
    id: string;
    value: string;
}

export interface ProductVariantResponseDto {
    id: string;
    name: string;
    options: ProductVariantOptionResponseDto[];
}

export interface ProductStockResponseDto {
    id: string;
    sku: string | null;
    price: number;
    quantity: number;
    option_ids: string;
}

export interface ProductResponseDto {
    id: string;
    shop_id: string;
    category_id: string;
    name: string;
    slug: string;
    sku: string | null;
    description: string | null;
    status: 'draft' | 'active' | 'hidden' | 'banned';
    price: number;
    quantity: number;
    sold_count: number;
    rating_avg: number;
    rating_count: number;
    images?: ProductImageResponseDto[];
    variants?: ProductVariantResponseDto[];
    stocks?: ProductStockResponseDto[];
    created_at: Date;
    updated_at: Date;
}

export interface ProductListResponseDto {
    data: ProductResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    };
}