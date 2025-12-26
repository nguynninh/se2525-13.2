import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const NAME_REGEX = /^[\p{L}\d\s'-]+$/u;
const nullableUrlOptional = z.preprocess((v) => (v === '' ? null : v), z.string().url().nullable()).optional();
const parseJsonObject = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((val) => {
        if (typeof val === 'string') {
            if (val.trim() === '') return undefined;
            try {
                return JSON.parse(val);
            } catch {
                return val;
            }
        }
        return val;
    }, schema);
const parseJsonObjectOptional = <T extends z.ZodTypeAny>(schema: T) => parseJsonObject(schema.optional());

const optionalTrimmedString = (base: z.ZodString) =>
    z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), base.optional());

export const ShopStatusSchema = z.enum(['active', 'suspended', 'closed']).openapi('ShopStatus');

export const ShopAddressResponseSchema = z
    .object({
        address_line: z.string(),
        ward: z.object({
            code: z.string(),
            name: z.string(),
            province: z.object({
                code: z.string(),
                name: z.string(),
            }),
        }),
    })
    .strict()
    .openapi('ShopAddress');

export const ShopSellerInfoSchema = z
    .object({
        seller_id: z.string().uuid(),
        user_id: z.string().uuid(),
        email: z.string().email(),
        first_name: z.string(),
        last_name: z.string(),
    })
    .strict()
    .openapi('ShopSellerInfo');

export const ShopListQuerySchema = z
    .object({
        search: z.string().trim().min(1).optional().openapi({
            description: 'Search by shop name or slug',
        }),
        sort: z.enum(['rating', 'name', 'created_at']).optional().openapi({
            description: 'Sort field (default: created_at)',
            example: 'rating',
        }),
        featured: z.coerce.boolean().optional().openapi({
            description: 'Filter featured shops',
        }),
    })
    .strict()
    .openapi('ShopListQuery');

export const ShopSummaryResponseSchema = z
    .object({
        id: z.string().uuid(),
        name: z.string(),
        slug: z.string(),
        logo_url: z.string().url().nullable(),
        is_featured: z.boolean(),
        status: ShopStatusSchema,
        rating_avg: z.number(),
        rating_count: z.number().int(),
        seller: ShopSellerInfoSchema,
    })
    .strict()
    .openapi('ShopSummary');

export const ShopSlugParamSchema = z
    .object({
        slug: z.string().trim().min(1, 'shop:slug_required'),
    })
    .strict()
    .openapi('ShopSlugParams');

export const ShopDetailResponseSchema = ShopSummaryResponseSchema.extend({
    description: z.string().nullable(),
    banner_url: z.string().url().nullable(),
    hotline: z.string().nullable(),
    address: ShopAddressResponseSchema,
})
    .strict()
    .openapi('ShopDetailResponse');

export const SellerShopAddressPayloadSchema = z
    .object({
        address_line: z.string().trim().min(1, 'shop:address_line_required'),
        ward_id: z.string().uuid('shop:ward_id_invalid'),
    })
    .strict()
    .openapi('SellerShopAddressPayload');

export const CreateSellerShopSchema = z
    .object({
        name: z.string().trim().min(1, 'shop:name_required').max(255).regex(NAME_REGEX, 'shop:name_invalid'),
        slug: z.preprocess(
            (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
            z.string().trim().min(1).max(255).optional(),
        ),
        description: z.string().trim().max(5000).optional(),
        logo_url: nullableUrlOptional,
        banner_url: nullableUrlOptional,
        hotline: z.string().trim().max(20).optional(),
        address: parseJsonObject(SellerShopAddressPayloadSchema),
    })
    .strict()
    .openapi('CreateSellerShop');

export const UpdateSellerShopSchema = z
    .object({
        name: optionalTrimmedString(
            z.string().trim().min(1, 'shop:name_required').max(255).regex(NAME_REGEX, 'shop:name_invalid'),
        ),
        slug: z.preprocess(
            (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
            z.string().trim().min(1).max(255).optional(),
        ),
        description: z.string().trim().max(5000).nullable().optional(),
        logo_url: nullableUrlOptional,
        banner_url: nullableUrlOptional,
        hotline: z.string().trim().max(20).optional(),
        address: parseJsonObjectOptional(SellerShopAddressPayloadSchema.partial()),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, 'shop:update_body_empty')
    .openapi('UpdateSellerShop');

export const UpdateSellerShopStatusSchema = z
    .object({
        status: z.enum(['active', 'closed']).openapi({
            description: 'New status of shop',
            example: 'closed',
        }),
    })
    .strict()
    .openapi('UpdateSellerShopStatus');

export const ShopIdParamSchema = z
    .object({
        id: z.string().uuid('shop:id_invalid'),
    })
    .strict()
    .openapi('ShopIdParams');

export const AdminShopListQuerySchema = z
    .object({
        status: ShopStatusSchema.optional(),
        seller_id: z.string().uuid('shop:seller_id_invalid').optional(),
        search: z.string().trim().min(1).optional().openapi({
            description: 'Search by shop name, slug or seller info',
        }),
    })
    .strict()
    .openapi('AdminShopListQuery');

export const AdminShopListItemResponseSchema = ShopSummaryResponseSchema.openapi('AdminShopListItemResponse');

export const AdminShopDetailResponseSchema = ShopDetailResponseSchema.openapi('AdminShopDetailResponse');

export const AdminUpdateShopStatusSchema = z
    .object({
        status: ShopStatusSchema,
    })
    .strict()
    .openapi('AdminUpdateShopStatus');

export const FavoriteShopListQuerySchema = z.object({}).strict().openapi('FavoriteShopListQuery');

export const FavoriteShopListItemResponseSchema = ShopSummaryResponseSchema.openapi('FavoriteShopListItemResponse');

export const FavoriteShopIdParamSchema = z
    .object({
        shopId: z.string().uuid('favorite:shop_id_invalid'),
    })
    .strict()
    .openapi('FavoriteShopIdParams');
