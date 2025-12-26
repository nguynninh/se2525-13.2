export interface Product {
    id: string;
    shop_id: string;
    category_id: string;
    name: string;
    slug: string;
    description: string;
    price: string;
    quantity: number;
    sold_count: number;
    rating_avg: string;
    rating_count: number;
    images: string[];
    shop: {
        id: string;
        name: string;
        slug: string;
        image?: string;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
    variants: Variant[];
    stocks: Stock[];
}

export interface Variant {
    id: string;
    product_id: string;
    name: string;
    options?: any[];
}

export interface Stock {
    id: string;
    product_id: string;
    sku: string;
    price: string;
    quantity: number;
    option_ids?: string;
}
