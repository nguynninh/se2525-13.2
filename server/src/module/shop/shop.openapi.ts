import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
    ShopListQuerySchema,
    ShopSlugParamSchema,
    ShopSummaryResponseSchema,
    ShopDetailResponseSchema,
    CreateSellerShopSchema,
    UpdateSellerShopSchema,
    UpdateSellerShopStatusSchema,
    AdminShopListQuerySchema,
    AdminShopDetailResponseSchema,
    AdminUpdateShopStatusSchema,
    ShopIdParamSchema,
    FavoriteShopListQuerySchema,
    FavoriteShopListItemResponseSchema,
    FavoriteShopIdParamSchema,
} from './shop.schema';

const fileBinary = z.any().openapi({ type: 'string', format: 'binary' });
const { logo_url: _createLogoUrl, banner_url: _createBannerUrl, ...createShape } = (
    CreateSellerShopSchema as z.ZodObject<any>
).shape;
const { logo_url: _updateLogoUrl, banner_url: _updateBannerUrl, ...updateShape } = (
    UpdateSellerShopSchema as z.ZodObject<any>
).shape;

const CreateSellerShopMultipartSchema = z.object({
    ...createShape,
    logo: fileBinary.optional(),
    banner: fileBinary.optional(),
});

const UpdateSellerShopMultipartSchema = z
    .object({
        ...updateShape,
        logo: fileBinary.optional(),
        banner: fileBinary.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, 'shop:update_body_empty');

export const registerShopOpenApi = (registry: OpenAPIRegistry) => {
    // Public: list shops
    registry.registerPath({
        method: 'get',
        path: '/api/shop/public',
        tags: ['Shop'],
        summary: 'Lấy danh sách shop công khai',
        request: {
            query: ShopListQuerySchema,
        },
        responses: {
            200: {
                description: 'Danh sách shop',
                content: {
                    'application/json': {
                        schema: z.array(ShopSummaryResponseSchema),
                    },
                },
            },
        },
    });

    // Public: shop detail by slug
    registry.registerPath({
        method: 'get',
        path: '/api/shop/public/{slug}',
        tags: ['Shop'],
        summary: 'Lấy chi tiết shop theo slug',
        request: {
            params: ShopSlugParamSchema,
        },
        responses: {
            200: {
                description: 'Chi tiết shop',
                content: {
                    'application/json': {
                        schema: ShopDetailResponseSchema,
                    },
                },
            },
        },
    });

    // Seller: get my shop (latest)
    registry.registerPath({
        method: 'get',
        path: '/api/shop/me',
        tags: ['Shop'],
        summary: 'Lấy shop của tôi (seller)',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Danh sách shop của tôi',
                content: {
                    'application/json': {
                        schema: z.array(ShopDetailResponseSchema),
                    },
                },
            },
        },
    });

    // Seller: create my shop
    registry.registerPath({
        method: 'post',
        path: '/api/shop/me',
        tags: ['Shop'],
        summary: 'Tạo shop của tôi (seller)',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: CreateSellerShopSchema,
                    },
                    'multipart/form-data': {
                        schema: CreateSellerShopMultipartSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Tạo shop thành công',
                content: {
                    'application/json': {
                        schema: ShopDetailResponseSchema,
                    },
                },
            },
        },
    });

    // Seller: update my shop (by id)
    registry.registerPath({
        method: 'patch',
        path: '/api/shop/me/{id}',
        tags: ['Shop'],
        summary: 'Cập nhật shop của tôi (seller)',
        security: [{ BearerAuth: [] }],
        request: {
            params: ShopIdParamSchema,
            body: {
                content: {
                    'application/json': {
                        schema: UpdateSellerShopSchema,
                    },
                    'multipart/form-data': {
                        schema: UpdateSellerShopMultipartSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Cập nhật shop thành công',
                content: {
                    'application/json': {
                        schema: ShopDetailResponseSchema,
                    },
                },
            },
        },
    });

    // Seller: update my shop status (by id)
    registry.registerPath({
        method: 'patch',
        path: '/api/shop/me/{id}/status',
        tags: ['Shop'],
        summary: 'Cập nhật trạng thái shop của tôi (seller)',
        security: [{ BearerAuth: [] }],
        request: {
            params: ShopIdParamSchema,
            body: {
                content: {
                    'application/json': {
                        schema: UpdateSellerShopStatusSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Cập nhật trạng thái shop thành công',
                content: {
                    'application/json': {
                        schema: ShopDetailResponseSchema,
                    },
                },
            },
        },
    });

    // Seller: delete my shop
    registry.registerPath({
        method: 'delete',
        path: '/api/shop/me/{id}',
        tags: ['Shop'],
        summary: 'Xóa shop của tôi (seller)',
        security: [{ BearerAuth: [] }],
        request: {
            params: ShopIdParamSchema,
        },
        responses: {
            200: {
                description: 'Xóa shop thành công',
                content: {
                    'application/json': {
                        schema: z.object({ ok: z.boolean() }),
                    },
                },
            },
        },
    });

    // Favorites: list mine
    registry.registerPath({
        method: 'get',
        path: '/api/shop/favorites',
        tags: ['Shop Favorites'],
        summary: 'Lấy danh sách shop yêu thích của tôi',
        security: [{ BearerAuth: [] }],
        request: {
            query: FavoriteShopListQuerySchema,
        },
        responses: {
            200: {
                description: 'Danh sách shop yêu thích',
                content: {
                    'application/json': {
                        schema: z.array(FavoriteShopListItemResponseSchema),
                    },
                },
            },
        },
    });

    // Favorites: add
    registry.registerPath({
        method: 'post',
        path: '/api/shop/favorites',
        tags: ['Shop Favorites'],
        summary: 'Thêm shop vào yêu thích',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({ shop_id: z.string().uuid() }),
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Thêm yêu thích thành công',
                content: {
                    'application/json': {
                        schema: z.object({ ok: z.boolean() }),
                    },
                },
            },
        },
    });

    // Favorites: remove
    registry.registerPath({
        method: 'delete',
        path: '/api/shop/favorites/{shopId}',
        tags: ['Shop Favorites'],
        summary: 'Bỏ shop khỏi yêu thích',
        security: [{ BearerAuth: [] }],
        request: {
            params: FavoriteShopIdParamSchema,
        },
        responses: {
            200: {
                description: 'Bỏ yêu thích thành công',
                content: {
                    'application/json': {
                        schema: z.object({ ok: z.boolean() }),
                    },
                },
            },
        },
    });

    // Admin: list shops
    registry.registerPath({
        method: 'get',
        path: '/api/admin/shops',
        tags: ['Shop Admin'],
        summary: 'Admin - danh sách shop',
        security: [{ BearerAuth: [] }],
        request: {
            query: AdminShopListQuerySchema,
        },
        responses: {
            200: {
                description: 'Danh sách shop',
                content: {
                    'application/json': {
                        schema: z.array(ShopSummaryResponseSchema),
                    },
                },
            },
        },
    });

    // Admin: list featured shops
    registry.registerPath({
        method: 'get',
        path: '/api/admin/shops/featured',
        tags: ['Shop Admin'],
        summary: 'Admin - danh sách shop nổi bật',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Danh sách shop nổi bật',
                content: {
                    'application/json': {
                        schema: z.array(ShopSummaryResponseSchema),
                    },
                },
            },
        },
    });

    // Admin: shop detail
    registry.registerPath({
        method: 'get',
        path: '/api/admin/shops/{id}',
        tags: ['Shop Admin'],
        summary: 'Admin - chi tiết shop',
        security: [{ BearerAuth: [] }],
        request: {
            params: ShopIdParamSchema,
        },
        responses: {
            200: {
                description: 'Chi tiết shop',
                content: {
                    'application/json': {
                        schema: AdminShopDetailResponseSchema,
                    },
                },
            },
        },
    });

    // Admin: update shop status
    registry.registerPath({
        method: 'patch',
        path: '/api/admin/shops/{id}/status',
        tags: ['Shop Admin'],
        summary: 'Admin - cập nhật trạng thái shop',
        security: [{ BearerAuth: [] }],
        request: {
            params: ShopIdParamSchema,
            body: {
                content: {
                    'application/json': {
                        schema: AdminUpdateShopStatusSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Cập nhật trạng thái shop thành công',
                content: {
                    'application/json': {
                        schema: ShopDetailResponseSchema,
                    },
                },
            },
        },
    });

    // Admin: update shop feature
    registry.registerPath({
        method: 'patch',
        path: '/api/admin/shops/{id}/feature',
        tags: ['Shop Admin'],
        summary: 'Admin - cập nhật nổi bật shop',
        security: [{ BearerAuth: [] }],
        request: {
            params: ShopIdParamSchema,
            body: {
                content: {
                    'application/json': {
                        schema: z.object({ is_featured: z.boolean() }),
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Cập nhật nổi bật shop thành công',
                content: {
                    'application/json': {
                        schema: z.object({ ok: z.boolean() }),
                    },
                },
            },
        },
    });

    // Admin: delete shop
    registry.registerPath({
        method: 'delete',
        path: '/api/admin/shops/{id}',
        tags: ['Shop Admin'],
        summary: 'Admin - xóa shop',
        security: [{ BearerAuth: [] }],
        request: {
            params: ShopIdParamSchema,
        },
        responses: {
            200: {
                description: 'Xóa shop thành công',
                content: {
                    'application/json': {
                        schema: z.object({ ok: z.boolean() }),
                    },
                },
            },
        },
    });
};
