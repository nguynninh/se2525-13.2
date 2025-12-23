import { ShopStatus } from 'src/models/Shop.model';

export type ShopStatusDto = ShopStatus;

export interface ShopAddressDto {
    address_line: string;
    ward: {
        code: string;
        name: string;
        province: {
            code: string;
            name: string;
        };
    };
}

export interface ShopSellerInfoDto {
    seller_id: string;
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface ShopSummaryDto {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    is_featured: boolean;
    status: ShopStatusDto;
    rating_avg: number;
    rating_count: number;
    seller: ShopSellerInfoDto;
}

export interface ShopDetailDto extends ShopSummaryDto {
    description: string | null;
    banner_url: string | null;
    hotline: string | null;
    address: ShopAddressDto;
}

export interface ShopListQueryDto {
    search?: string;
    sort?: 'rating' | 'name' | 'created_at';
    featured?: boolean;
}

export interface SellerShopAddressPayloadDto {
    address_line: string;
    ward_id: string;
}

export interface CreateSellerShopDto {
    name: string;
    slug: string;
    description?: string;
    logo_url?: string | null;
    banner_url?: string | null;
    hotline?: string | null;
    address: SellerShopAddressPayloadDto;
}

export interface UpdateSellerShopDto {
    name?: string;
    slug?: string;
    description?: string | null;
    logo_url?: string | null;
    banner_url?: string | null;
    hotline?: string | null;
    address?: Partial<SellerShopAddressPayloadDto>;
}

export interface UpdateSellerShopStatusDto {
    status: Extract<ShopStatusDto, 'active' | 'closed'>;
}

export interface AdminShopListQueryDto {
    status?: ShopStatusDto;
    seller_id?: string;
    search?: string;
}

export interface AdminShopListItemDto extends ShopSummaryDto {}

export interface AdminShopDetailDto extends ShopDetailDto {}

export interface FavoriteShopListItemDto extends ShopSummaryDto {}

export interface ToggleFavoriteShopDto {
    shop_id: string;
}
