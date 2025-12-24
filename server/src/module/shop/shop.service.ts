import { Op, Transaction } from 'sequelize';
import { sequelize } from '../../models';

import { Shop } from '../../models/Shop.model';
import { Address } from '../../models/Address.model';
import { Ward } from '../../models/Wards.model';
import { Province } from '../../models/Provinces.model';
import { Seller } from '../../models/Seller.model';
import { User } from '../../models/User.model';
import { FavoriteShop } from '../../models/FavoriteShop.model';

import {
    ShopSummaryDto,
    ShopDetailDto,
    ShopListQueryDto,
    CreateSellerShopDto,
    UpdateSellerShopDto,
    UpdateSellerShopStatusDto,
    AdminShopListQueryDto,
    AdminShopDetailDto,
    FavoriteShopListItemDto,
} from './shop.dto';

import { NotFoundError, ValidationError, InternalServerError } from '../../exception/AppError';
import { redisHelper } from '../../utils/redisHelper';

const SHOP_CACHE_TTL_SEC = parseInt(process.env.SHOP_CACHE_TTL_SEC ?? '300', 10);

const generateSlug = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

type ShopWithSeller = Shop & { seller: Seller & { user: User } };
type ShopWithDetail = ShopWithSeller & {
    address: Address & { ward: Ward & { province: Province } };
};

const shopCacheKey = {
    publicList: (query: ShopListQueryDto) => {
        const search = query.search?.trim().toLowerCase() ?? '';
        const sort = query.sort ?? 'created_at';
        const featured = query.featured === true ? '1' : '0';
        return `shop:public:list:s=${encodeURIComponent(search)}:sort=${sort}:feat=${featured}`;
    },
    publicDetail: (slug: string) => `shop:public:detail:${slug}`,
};

const invalidateShopCache = async (slugs: string[] = []) => {
    try {
        const uniqueSlugs = Array.from(new Set(slugs.filter(Boolean)));
        const tasks: Promise<unknown>[] = [redisHelper.delPattern('shop:public:list:*')];

        uniqueSlugs.forEach((slug) => tasks.push(redisHelper.del(shopCacheKey.publicDetail(slug))));

        await Promise.allSettled(tasks);
    } catch (error) {
        console.error('Chưa có shop cache:', error);
    }
};

// Danh sách shop đang active
export const listPublicShops = async (query: ShopListQueryDto): Promise<ShopSummaryDto[]> => {
    const cacheKey = shopCacheKey.publicList(query);
    try {
        const cached = await redisHelper.get<ShopSummaryDto[]>(cacheKey);
        if (cached) {
            return cached;
        }
    } catch (error) {
        console.error('Chưa có danh sách shop cache:', error);
    }

    const where: any = {
        status: 'active',
    };

    if (query.search) {
        const s = `%${query.search.trim()}%`;
        where[Op.or] = [{ name: { [Op.iLike]: s } }, { slug: { [Op.iLike]: s } }];
    }

    if (query.featured === true) {
        where.is_featured = true;
    }

    let order: any[] = [['created_at', 'DESC']];

    if (query.sort === 'rating') {
        order = [
            ['rating_avg', 'DESC'],
            ['rating_count', 'DESC'],
        ];
    } else if (query.sort === 'name') {
        order = [['name', 'ASC']];
    }

    const rows = (await Shop.findAll({
        where,
        include: [
            {
                model: Seller,
                as: 'seller',
                include: [
                    {
                        model: User,
                        as: 'user',
                    },
                ],
            },
        ],
        order,
    })) as ShopWithSeller[];

    const result = rows.map((shop: any) => {
        const seller = shop.seller;
        const user = seller?.user;

        if (!seller || !user) {
            throw new InternalServerError('shop:seller_info_not_loaded');
        }

        return {
            id: shop.id,
            name: shop.name,
            slug: shop.slug,
            logo_url: shop.logo_url,
            is_featured: shop.is_featured,
            status: shop.status,
            rating_avg: Number(shop.rating_avg),
            rating_count: Number(shop.rating_count),
            seller: {
                seller_id: seller.id,
                user_id: seller.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
        };
    });

    try {
        await redisHelper.set(cacheKey, result, SHOP_CACHE_TTL_SEC);
    } catch (error) {
        console.error('shop:list cache write failed:', error);
    }

    return result;
};

// lấy chi tiết shop theo slug
export const getPublicShopDetailBySlug = async (slug: string): Promise<ShopDetailDto> => {
    const cacheKey = shopCacheKey.publicDetail(slug);
    try {
        const cached = await redisHelper.get<ShopDetailDto>(cacheKey);
        if (cached) {
            return cached;
        }
    } catch (error) {
        console.error('shop:detail cache read failed:', error);
    }

    const shop = (await Shop.findOne({
        where: { slug, status: 'active' },
        include: [
            {
                model: Address,
                as: 'address',
                include: [
                    {
                        model: Ward,
                        as: 'ward',
                        include: [{ model: Province, as: 'province' }],
                    },
                ],
            },
            {
                model: Seller,
                as: 'seller',
                include: [
                    {
                        model: User,
                        as: 'user',
                    },
                ],
            },
        ],
    })) as ShopWithDetail | null;

    if (!shop) {
        throw new NotFoundError('shop:not_found');
    }

    const seller = shop.seller;
    const user = seller?.user;
    if (!seller || !user) {
        throw new InternalServerError('shop:seller_info_not_loaded');
    }

    const address = shop.address;
    const ward = address?.ward;
    const province = ward?.province;
    if (!address || !ward || !province) {
        throw new InternalServerError('shop:address_not_loaded');
    }

    const detail: ShopDetailDto = {
        id: shop.id,
        name: shop.name,
        slug: shop.slug,
        logo_url: shop.logo_url,
        is_featured: shop.is_featured,
        status: shop.status,
        rating_avg: Number(shop.rating_avg),
        rating_count: Number(shop.rating_count),
        seller: {
            seller_id: seller.id,
            user_id: seller.user_id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
        },
        description: shop.description,
        banner_url: shop.banner_url,
        hotline: shop.hotline,
        address: {
            address_line: address.address_line,
            ward: {
                code: ward.code,
                name: ward.name,
                province: {
                    code: province.code,
                    name: province.name,
                },
            },
        },
    };

    try {
        await redisHelper.set(cacheKey, detail, SHOP_CACHE_TTL_SEC);
    } catch (error) {
        console.error('Chưa có cache shop chi tiết:', error);
    }

    return detail;
};

const findSellerByUserIdOrThrow = async (userId: string): Promise<Seller> => {
    const seller = await Seller.findOne({ where: { user_id: userId } });
    if (!seller) {
        throw new ValidationError('seller:not_seller');
    }
    return seller;
};

// lấy shop của mình
export const getMyShop = async (userId: string): Promise<ShopDetailDto> => {
    const seller = await findSellerByUserIdOrThrow(userId);

    const shop = (await Shop.findOne({
        where: { seller_id: seller.id },
        include: [
            {
                model: Address,
                as: 'address',
                include: [
                    {
                        model: Ward,
                        as: 'ward',
                        include: [{ model: Province, as: 'province' }],
                    },
                ],
            },
            {
                model: Seller,
                as: 'seller',
                include: [
                    {
                        model: User,
                        as: 'user',
                    },
                ],
            },
        ],
    })) as ShopWithDetail | null;

    if (!shop) {
        throw new NotFoundError('shop:not_found');
    }

    const sellerInfo = shop.seller;
    const user = sellerInfo?.user;
    if (!sellerInfo || !user) {
        throw new InternalServerError('shop:seller_info_not_loaded');
    }

    const address = shop.address;
    const ward = address?.ward;
    const province = ward?.province;
    if (!address || !ward || !province) {
        throw new InternalServerError('shop:address_not_loaded');
    }

    return {
        id: shop.id,
        name: shop.name,
        slug: shop.slug,
        logo_url: shop.logo_url,
        is_featured: shop.is_featured,
        status: shop.status,
        rating_avg: Number(shop.rating_avg),
        rating_count: Number(shop.rating_count),
        seller: {
            seller_id: sellerInfo.id,
            user_id: sellerInfo.user_id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
        },
        description: shop.description,
        banner_url: shop.banner_url,
        hotline: shop.hotline,
        address: {
            address_line: address.address_line,
            ward: {
                code: ward.code,
                name: ward.name,
                province: {
                    code: province.code,
                    name: province.name,
                },
            },
        },
    };
};

// tạo shop mới
export const createMyShop = async (userId: string, dto: CreateSellerShopDto): Promise<ShopDetailDto> => {
    const detail = await sequelize.transaction(async (tx: Transaction) => {
        const seller = await findSellerByUserIdOrThrow(userId);

        const existed = await Shop.findOne({
            where: { seller_id: seller.id },
            transaction: tx,
        });
        if (existed) {
            throw new ValidationError('shop:already_exists');
        }

        const nameExisted = await Shop.findOne({
            where: { name: dto.name },
            transaction: tx,
        });
        if (nameExisted) {
            throw new ValidationError('shop:name_exists');
        }

        const baseSlug = generateSlug(dto.slug || dto.name);
        let candidateSlug = baseSlug;
        let slugSuffix = 1;
        while (
            await Shop.findOne({
                where: { slug: candidateSlug },
                transaction: tx,
            })
        ) {
            candidateSlug = `${baseSlug}-${slugSuffix++}`;
        }

        // Accept ward_id as UUID or ward code
        let wardRecord: Ward | null = null;
        const wardId = dto.address.ward_id;
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
        if (uuidRegex.test(wardId)) {
            wardRecord = await Ward.findByPk(wardId, { transaction: tx });
        } else {
            wardRecord = await Ward.findOne({ where: { code: wardId }, transaction: tx });
        }
        if (!wardRecord) {
            throw new NotFoundError('shop:ward_not_found');
        }

        const address = await Address.create(
            {
                address_line: dto.address.address_line,
                ward_id: dto.address.ward_id,
            },
            { transaction: tx },
        );

        const shop = await Shop.create(
            {
                seller_id: seller.id,
                address_id: address.id,
                name: dto.name,
                slug: candidateSlug,
                description: dto.description ?? null,
                logo_url: dto.logo_url ?? null,
                banner_url: dto.banner_url ?? null,
                hotline: dto.hotline ?? null,
                status: 'active',
                rating_avg: 0,
            rating_count: 0,
            is_featured: false,
        },
            { transaction: tx },
        );

        const full = (await Shop.findByPk(shop.id, {
            include: [
                {
                    model: Address,
                    as: 'address',
                    include: [
                        {
                            model: Ward,
                            as: 'ward',
                            include: [{ model: Province, as: 'province' }],
                        },
                    ],
                },
                {
                    model: Seller,
                    as: 'seller',
                    include: [
                        {
                            model: User,
                            as: 'user',
                        },
                    ],
                },
            ],
            transaction: tx,
        })) as ShopWithDetail | null;

        if (!full) {
            throw new InternalServerError('shop:create_failed');
        }

        const sellerInfo = full.seller;
        const user = sellerInfo?.user;
        if (!sellerInfo || !user) {
            throw new InternalServerError('shop:seller_info_not_loaded');
        }

        const fullAddress = full.address;
        const ward = fullAddress?.ward;
        const province = ward?.province;
        if (!fullAddress || !ward || !province) {
            throw new InternalServerError('shop:address_not_loaded');
        }

        return {
            id: full.id,
            name: full.name,
            slug: full.slug,
            logo_url: full.logo_url,
            is_featured: full.is_featured,
            status: full.status,
            rating_avg: Number(full.rating_avg),
            rating_count: Number(full.rating_count),
            seller: {
                seller_id: sellerInfo.id,
                user_id: sellerInfo.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
            description: full.description,
            banner_url: full.banner_url,
            hotline: full.hotline,
            address: {
                address_line: fullAddress.address_line,
                ward: {
                    code: ward.code,
                    name: ward.name,
                    province: {
                        code: province.code,
                        name: province.name,
                    },
                },
            },
        };
    });

    await invalidateShopCache([detail.slug]);
    return detail;
};

// cập nhật thông tin shop
export const updateMyShop = async (userId: string, dto: UpdateSellerShopDto): Promise<ShopDetailDto> => {
    const { detail, oldSlug } = await sequelize.transaction(async (tx: Transaction) => {
        const seller = await findSellerByUserIdOrThrow(userId);

        const shop = await Shop.findOne({
            where: { seller_id: seller.id },
            transaction: tx,
        });

        if (!shop) {
            throw new NotFoundError('shop:not_found');
        }

        const oldSlug = shop.slug;
        const oldName = shop.name;

        const newName = dto.name;
        if (newName !== undefined) {
            if (newName !== oldName) {
                const nameExisted = await Shop.findOne({
                    where: {
                        name: newName,
                        id: { [Op.ne]: shop.id },
                    },
                    transaction: tx,
                });
                if (nameExisted) {
                    throw new ValidationError('shop:name_exists');
                }
            }
            shop.name = newName;
        }
        if (dto.description !== undefined) shop.description = dto.description ?? null;
        if (dto.logo_url !== undefined) shop.logo_url = dto.logo_url ?? null;
        if (dto.banner_url !== undefined) shop.banner_url = dto.banner_url ?? null;
        if (dto.hotline !== undefined) shop.hotline = dto.hotline ?? null;

        if (newName && newName !== oldName) {
            const baseSlug = generateSlug(newName);
            let candidate = baseSlug;
            let suffix = 1;

            while (
                await Shop.findOne({
                    where: {
                        slug: candidate,
                        id: { [Op.ne]: shop.id },
                    },
                    transaction: tx,
                })
            ) {
                candidate = `${baseSlug}-${suffix++}`;
            }

            shop.slug = candidate;
        }

        if (dto.address) {
            const addr = await Address.findByPk(shop.address_id, { transaction: tx });
            if (!addr) {
                throw new InternalServerError('shop:address_not_found');
            }

            if (dto.address.ward_id) {
                const ward = await Ward.findByPk(dto.address.ward_id, { transaction: tx });
                if (!ward) {
                    throw new NotFoundError('shop:ward_not_found');
                }
                addr.ward_id = dto.address.ward_id;
            }

            if (dto.address.address_line !== undefined) {
                addr.address_line = dto.address.address_line;
            }

            await addr.save({ transaction: tx });
        }

        await shop.save({ transaction: tx });

        const full = (await Shop.findByPk(shop.id, {
            include: [
                {
                    model: Address,
                    as: 'address',
                    include: [
                        {
                            model: Ward,
                            as: 'ward',
                            include: [{ model: Province, as: 'province' }],
                        },
                    ],
                },
                {
                    model: Seller,
                    as: 'seller',
                    include: [
                        {
                            model: User,
                            as: 'user',
                        },
                    ],
                },
            ],
            transaction: tx,
        })) as ShopWithDetail | null;

        if (!full) {
            throw new InternalServerError('shop:update_failed');
        }

        const sellerInfo = full.seller;
        const user = sellerInfo?.user;
        if (!sellerInfo || !user) {
            throw new InternalServerError('shop:seller_info_not_loaded');
        }

        const address = full.address;
        const ward = address?.ward;
        const province = ward?.province;
        if (!address || !ward || !province) {
            throw new InternalServerError('shop:address_not_loaded');
        }

        const detail: ShopDetailDto = {
            id: full.id,
            name: full.name,
            slug: full.slug,
            logo_url: full.logo_url,
            is_featured: full.is_featured,
            status: full.status,
            rating_avg: Number(full.rating_avg),
            rating_count: Number(full.rating_count),
            seller: {
                seller_id: sellerInfo.id,
                user_id: sellerInfo.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
            description: full.description,
            banner_url: full.banner_url,
            hotline: full.hotline,
            address: {
                address_line: address.address_line,
                ward: {
                    code: ward.code,
                    name: ward.name,
                    province: {
                        code: province.code,
                        name: province.name,
                    },
                },
            },
        };

        return { detail, oldSlug };
    });

    await invalidateShopCache([oldSlug, detail.slug]);
    return detail;
};

// cập nhật trạng thái shop
export const updateMyShopStatus = async (userId: string, dto: UpdateSellerShopStatusDto): Promise<ShopDetailDto> => {
    const { detail, slug } = await sequelize.transaction(async (tx: Transaction) => {
        const seller = await findSellerByUserIdOrThrow(userId);

        const shop = await Shop.findOne({
            where: { seller_id: seller.id },
            transaction: tx,
        });

        if (!shop) {
            throw new NotFoundError('shop:not_found');
        }

        if (!['active', 'closed'].includes(dto.status)) {
            throw new ValidationError('shop:status_invalid');
        }

        shop.status = dto.status;
        await shop.save({ transaction: tx });

        const full = (await Shop.findByPk(shop.id, {
            include: [
                {
                    model: Address,
                    as: 'address',
                    include: [
                        {
                            model: Ward,
                            as: 'ward',
                            include: [{ model: Province, as: 'province' }],
                        },
                    ],
                },
                {
                    model: Seller,
                    as: 'seller',
                    include: [
                        {
                            model: User,
                            as: 'user',
                        },
                    ],
                },
            ],
            transaction: tx,
        })) as ShopWithDetail | null;

        if (!full) {
            throw new InternalServerError('shop:update_failed');
        }

        const sellerInfo = full.seller;
        const user = sellerInfo?.user;
        if (!sellerInfo || !user) {
            throw new InternalServerError('shop:seller_info_not_loaded');
        }

        const address = full.address;
        const ward = address?.ward;
        const province = ward?.province;
        if (!address || !ward || !province) {
            throw new InternalServerError('shop:address_not_loaded');
        }

        const detail: ShopDetailDto = {
            id: full.id,
            name: full.name,
            slug: full.slug,
            logo_url: full.logo_url,
            is_featured: full.is_featured,
            status: full.status,
            rating_avg: Number(full.rating_avg),
            rating_count: Number(full.rating_count),
            seller: {
                seller_id: sellerInfo.id,
                user_id: sellerInfo.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
            description: full.description,
            banner_url: full.banner_url,
            hotline: full.hotline,
            address: {
                address_line: address.address_line,
                ward: {
                    code: ward.code,
                    name: ward.name,
                    province: {
                        code: province.code,
                        name: province.name,
                    },
                },
            },
        };

        return { detail, slug: full.slug };
    });

    await invalidateShopCache([slug]);
    return detail;
};

// Admin: list shop với filter
export const adminListShops = async (query: AdminShopListQueryDto): Promise<ShopSummaryDto[]> => {
    const where: any = {};

    if (query.status) {
        where.status = query.status;
    }

    if (query.search) {
        const s = `%${query.search.trim()}%`;
        where[Op.or] = [{ name: { [Op.iLike]: s } }, { slug: { [Op.iLike]: s } }];
    }

    const include: any[] = [
        {
            model: Seller,
            as: 'seller',
            include: [
                {
                    model: User,
                    as: 'user',
                },
            ],
        },
    ];

    if (query.seller_id) {
        (include[0] as any).where = { id: query.seller_id };
    }

    const rows = (await Shop.findAll({
        where,
        include,
        order: [['created_at', 'DESC']],
    })) as ShopWithSeller[];

    return rows.map((shop: any) => {
        const seller = shop.seller;
        const user = seller?.user;

        if (!seller || !user) {
            throw new InternalServerError('shop:seller_info_not_loaded');
        }

        return {
            id: shop.id,
            name: shop.name,
            slug: shop.slug,
            logo_url: shop.logo_url,
            is_featured: shop.is_featured,
            status: shop.status,
            rating_avg: Number(shop.rating_avg),
            rating_count: Number(shop.rating_count),
            seller: {
                seller_id: seller.id,
                user_id: seller.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
        };
    });
};

// Admin: chi tiết shop
export const adminGetShopDetail = async (id: string): Promise<AdminShopDetailDto> => {
    const shop = (await Shop.findByPk(id, {
        include: [
            {
                model: Address,
                as: 'address',
                include: [
                    {
                        model: Ward,
                        as: 'ward',
                        include: [{ model: Province, as: 'province' }],
                    },
                ],
            },
            {
                model: Seller,
                as: 'seller',
                include: [
                    {
                        model: User,
                        as: 'user',
                    },
                ],
            },
        ],
    })) as ShopWithDetail | null;

    if (!shop) {
        throw new NotFoundError('shop:not_found');
    }

    const seller = shop.seller;
    const user = seller?.user;
    if (!seller || !user) {
        throw new InternalServerError('shop:seller_info_not_loaded');
    }

    const address = shop.address;
    const ward = address?.ward;
    const province = ward?.province;
    if (!address || !ward || !province) {
        throw new InternalServerError('shop:address_not_loaded');
    }

    return {
        id: shop.id,
        name: shop.name,
        slug: shop.slug,
        logo_url: shop.logo_url,
        is_featured: shop.is_featured,
        status: shop.status,
        rating_avg: Number(shop.rating_avg),
        rating_count: Number(shop.rating_count),
        seller: {
            seller_id: seller.id,
            user_id: seller.user_id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
        },
        description: shop.description,
        banner_url: shop.banner_url,
        hotline: shop.hotline,
        address: {
            address_line: address.address_line,
            ward: {
                code: ward.code,
                name: ward.name,
                province: {
                    code: province.code,
                    name: province.name,
                },
            },
        },
    };
};

// Admin: đổi trạng thái shop
export const adminUpdateShopStatus = async (id: string, status: 'active' | 'suspended' | 'closed'): Promise<void> => {
    const shop = await Shop.findByPk(id);

    if (!shop) {
        throw new NotFoundError('shop:not_found');
    }

    const slug = shop.slug;

    shop.status = status;
    await shop.save();
    await invalidateShopCache([slug]);
};

// Admin: bật/tắt featured
export const adminUpdateShopFeature = async (id: string, isFeature: boolean): Promise<void> => {
    const shop = await Shop.findByPk(id);

    if (!shop) {
        throw new NotFoundError('shop:not_found');
    }

    const slug = shop.slug;

    shop.is_featured = isFeature;
    await shop.save();
    await invalidateShopCache([slug]);
};

// Admin: danh sách featured shop
export const adminListFeaturedShops = async (): Promise<ShopSummaryDto[]> => {
    const rows = (await Shop.findAll({
        where: { is_featured: true },
        include: [
            {
                model: Seller,
                as: 'seller',
                include: [
                    {
                        model: User,
                        as: 'user',
                    },
                ],
            },
        ],
        order: [
            ['rating_avg', 'DESC'],
            ['rating_count', 'DESC'],
        ],
    })) as ShopWithSeller[];

    return rows.map((shop: any) => {
        const seller = shop.seller;
        const user = seller?.user;

        if (!seller || !user) {
            throw new InternalServerError('shop:seller_info_not_loaded');
        }

        return {
            id: shop.id,
            name: shop.name,
            slug: shop.slug,
            logo_url: shop.logo_url,
            is_featured: shop.is_featured,
            status: shop.status,
            rating_avg: Number(shop.rating_avg),
            rating_count: Number(shop.rating_count),
            seller: {
                seller_id: seller.id,
                user_id: seller.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
        };
    });
};

// Admin: xóa shop + địa chỉ liên quan
export const adminDeleteShop = async (id: string): Promise<void> => {
    let slugToClear: string | null = null;

    await sequelize.transaction(async (tx: Transaction) => {
        const shop = await Shop.findByPk(id, { transaction: tx });
        if (!shop) {
            throw new NotFoundError('shop:not_found');
        }

        slugToClear = shop.slug;
        const addressId = shop.address_id;

        await shop.destroy({ transaction: tx });

        if (addressId) {
            await Address.destroy({ where: { id: addressId }, transaction: tx });
        }
    });

    await invalidateShopCache(slugToClear ? [slugToClear] : []);
};

// Người dùng: danh sách shop đã yêu thích
export const listMyFavoriteShops = async (userId: string): Promise<FavoriteShopListItemDto[]> => {
    const favorites = (await FavoriteShop.findAll({
        where: { user_id: userId },
        include: [
            {
                model: Shop,
                as: 'shop',
                include: [
                    {
                        model: Seller,
                        as: 'seller',
                        include: [
                            {
                                model: User,
                                as: 'user',
                            },
                        ],
                    },
                ],
            },
        ],
        order: [['created_at', 'DESC']],
    })) as (FavoriteShop & { shop: ShopWithSeller })[];

    return favorites
        .map((f) => f.shop)
        .filter((s): s is ShopWithSeller => !!s)
        .map((shop) => {
            const seller = shop.seller;
            const user = seller?.user;

            if (!seller || !user) {
                throw new InternalServerError('shop:seller_info_not_loaded');
            }

            return {
                id: shop.id,
                name: shop.name,
                slug: shop.slug,
                logo_url: shop.logo_url,
                is_featured: shop.is_featured,
                status: shop.status,
                rating_avg: Number(shop.rating_avg),
                rating_count: Number(shop.rating_count),
                seller: {
                    seller_id: seller.id,
                    user_id: seller.user_id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                },
            };
        });
};

// Người dùng: thêm shop vào yêu thích
export const addMyFavoriteShop = async (userId: string, shopId: string): Promise<void> => {
    return sequelize.transaction(async (tx: Transaction) => {
        const shop = await Shop.findByPk(shopId, { transaction: tx });
        if (!shop || shop.status !== 'active') {
            throw new NotFoundError('shop:not_found');
        }

        const existed = await FavoriteShop.findOne({
            where: { user_id: userId, shop_id: shopId },
            transaction: tx,
        });

        if (existed) {
            return;
        }

        await FavoriteShop.create(
            {
                user_id: userId,
                shop_id: shopId,
            },
            { transaction: tx },
        );
    });
};

// Người dùng: bỏ yêu thích shop
export const removeMyFavoriteShop = async (userId: string, shopId: string): Promise<void> => {
    await FavoriteShop.destroy({
        where: { user_id: userId, shop_id: shopId },
    });
};
