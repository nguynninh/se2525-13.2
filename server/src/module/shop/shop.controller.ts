import { Request, Response, NextFunction } from 'express';
import response from '../../utils/response';
import { ValidationError } from '../../exception/AppError';
import {
    listPublicShops,
    getPublicShopDetailBySlug,
    getMyShop,
    createMyShop,
    updateMyShop,
    updateMyShopStatus,
    adminListShops,
    adminGetShopDetail,
    adminUpdateShopStatus,
    adminUpdateShopFeature,
    adminListFeaturedShops,
    adminDeleteShop,
    listMyFavoriteShops,
    addMyFavoriteShop,
    removeMyFavoriteShop,
} from './shop.service';
import {
    AdminShopListQueryDto,
    CreateSellerShopDto,
    FavoriteShopListItemDto,
    ShopDetailDto,
    ShopListQueryDto,
    ShopSummaryDto,
    UpdateSellerShopDto,
    UpdateSellerShopStatusDto,
} from './shop.dto';
import { uploadFileToMinIO } from '../../utils/upload';
import { deleteMyShop } from './shop.service';

type FileFieldMap = { [fieldname: string]: Express.Multer.File[] };

export const publicShopController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query as unknown as ShopListQueryDto;
            const result: ShopSummaryDto[] = await listPublicShops(query);
            return response.ok(res, result, 'shop:list_success');
        } catch (err) {
            next(err);
        }
    },

    async detail(req: Request, res: Response, next: NextFunction) {
        try {
            const { slug } = req.params;
            if (!slug) {
                throw new ValidationError('shop:slug_required');
            }
            const result: ShopDetailDto = await getPublicShopDetailBySlug(slug);
            return response.ok(res, result, 'shop:get_detail_success');
        } catch (err) {
            next(err);
        }
    },
};

export const sellerShopController = {
    async getMine(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ValidationError('auth:unauthenticated');
            }
            const result: ShopDetailDto[] = await getMyShop(userId);
            return response.ok(res, result, 'shop:get_my_shop_success');
        } catch (err) {
            next(err);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ValidationError('auth:unauthenticated');
            }
            const dto = req.body as CreateSellerShopDto;

            const files = (req.files || {}) as FileFieldMap;
            const logo = files.logo?.[0];
            const banner = files.banner?.[0];

            if (logo) {
                dto.logo_url = await uploadFileToMinIO(logo.originalname, logo.buffer, logo.mimetype, 'uploads/shops/logos');
            }

            if (banner) {
                dto.banner_url = await uploadFileToMinIO(
                    banner.originalname,
                    banner.buffer,
                    banner.mimetype,
                    'uploads/shops/banners',
                );
            }

            const result: ShopDetailDto = await createMyShop(userId, dto);
            return response.created(res, result, 'shop:create_success');
        } catch (err) {
            next(err);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const shopId = req.params.id;
            if (!userId) {
                throw new ValidationError('auth:unauthenticated');
            }
            if (!shopId) {
                throw new ValidationError('shop:id_invalid');
            }
            const dto = req.body as UpdateSellerShopDto;

            const files = (req.files || {}) as FileFieldMap;
            const logo = files.logo?.[0];
            const banner = files.banner?.[0];

            if (logo) {
                dto.logo_url = await uploadFileToMinIO(logo.originalname, logo.buffer, logo.mimetype, 'uploads/shops/logos');
            }

            if (banner) {
                dto.banner_url = await uploadFileToMinIO(
                    banner.originalname,
                    banner.buffer,
                    banner.mimetype,
                    'uploads/shops/banners',
                );
            }

            const result: ShopDetailDto = await updateMyShop(userId, shopId, dto);
            return response.ok(res, result, 'shop:update_success');
        } catch (err) {
            next(err);
        }
    },

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const shopId = req.params.id;
            if (!userId) {
                throw new ValidationError('auth:unauthenticated');
            }
            if (!shopId) {
                throw new ValidationError('shop:id_invalid');
            }
            const dto = req.body as UpdateSellerShopStatusDto;
            const result: ShopDetailDto = await updateMyShopStatus(userId, shopId, dto);
            return response.ok(res, result, 'shop:update_status_success');
        } catch (err) {
            next(err);
        }
    },

    async deleteMine(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const shopId = req.params.id;
            if (!userId) {
                throw new ValidationError('auth:unauthenticated');
            }
            if (!shopId) {
                throw new ValidationError('shop:id_invalid');
            }
            await deleteMyShop(userId, shopId);
            return response.ok(res, { ok: true }, 'shop:delete_success');
        } catch (err) {
            next(err);
        }
    },
};

export const favoriteShopController = {
    async listMine(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ValidationError('auth:unauthenticated');
            }
            const result: FavoriteShopListItemDto[] = await listMyFavoriteShops(userId);
            return response.ok(res, result, 'shop:get_favorites_success');
        } catch (err) {
            next(err);
        }
    },

    async add(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ValidationError('auth:unauthenticated');
            }
            const shopId = req.body?.shop_id as string | undefined;
            if (!shopId) {
                throw new ValidationError('shop:id_invalid');
            }
            await addMyFavoriteShop(userId, shopId);
            return response.ok(res, { ok: true }, 'shop:add_favorite_success');
        } catch (err) {
            next(err);
        }
    },

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const shopId = req.params.shopId;
            if (!userId) {
                throw new ValidationError('auth:unauthenticated');
            }
            if (!shopId) {
                throw new ValidationError('shop:id_invalid');
            }
            await removeMyFavoriteShop(userId, shopId);
            return response.ok(res, { ok: true }, 'shop:remove_favorite_success');
        } catch (err) {
            next(err);
        }
    },
};

export const adminShopController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query as unknown as AdminShopListQueryDto;
            const result: ShopSummaryDto[] = await adminListShops(query);
            return response.ok(res, result, 'shop:admin_list_success');
        } catch (err) {
            next(err);
        }
    },

    async detail(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new ValidationError('shop:id_invalid');
            }
            const result: ShopDetailDto = await adminGetShopDetail(id);
            return response.ok(res, result, 'shop:admin_get_detail_success');
        } catch (err) {
            next(err);
        }
    },

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body as { status: 'active' | 'suspended' | 'closed' };
            if (!id) {
                throw new ValidationError('shop:id_invalid');
            }
            if (!status) {
                throw new ValidationError('shop:status_invalid');
            }
            await adminUpdateShopStatus(id, status);
            return response.ok(res, { ok: true }, 'shop:admin_update_status_success');
        } catch (err) {
            next(err);
        }
    },

    async updateFeature(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { is_featured } = req.body as { is_featured: boolean };
            if (!id) {
                throw new ValidationError('shop:id_invalid');
            }
            await adminUpdateShopFeature(id, Boolean(is_featured));
            return response.ok(res, { ok: true }, 'shop:admin_update_feature_success');
        } catch (err) {
            next(err);
        }
    },

    async listFeatured(req: Request, res: Response, next: NextFunction) {
        try {
            const result: ShopSummaryDto[] = await adminListFeaturedShops();
            return response.ok(res, result, 'shop:admin_list_featured_success');
        } catch (err) {
            next(err);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new ValidationError('shop:id_invalid');
            }
            await adminDeleteShop(id);
            return response.ok(res, { ok: true }, 'shop:admin_delete_success');
        } catch (err) {
            next(err);
        }
    },
};
