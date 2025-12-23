import { SellerApplication } from '../../models/SellerApplication.model';
import { Seller } from '../../models/Seller.model';
import { User } from '../../models/User.model';
import { Shop } from '../../models/Shop.model';

import {
    SellerApplicationStatus,
    CreateSellerApplicationDto,
    ReviewSellerApplication,
    SellerApplicationResponseDto,
    SellerApplicationWithUserResponseDto,
    MySellerApplicationResponseDto,
} from './sellerApplication.dto';
import { ValidationError, NotFoundError, InternalServerError } from '../../exception/AppError';

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

export const createSellerApplication = async (
    userId: string,
    dto: CreateSellerApplicationDto,
): Promise<SellerApplicationResponseDto> => {
    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError('user:user_not_found');

    const existingSeller = await Seller.findOne({ where: { user_id: userId } });
    if (existingSeller) throw new ValidationError('user:already_seller');

    const pending = await SellerApplication.findOne({
        where: { user_id: userId, status: 'pending' },
    });
    if (pending) throw new ValidationError('user:pending_application_exists');

    const application = await SellerApplication.create({
        user_id: userId,
        status: 'pending',
        accepted_terms: dto.accepted_terms,
    });

    return {
        id: application.id,
        user_id: application.user_id,
        status: application.status as SellerApplicationStatus,
        accepted_terms: application.accepted_terms,
        rejection_reason: application.rejection_reason ?? null,
        reviewed_by: application.reviewed_by ?? null,
    };
};

export const getMyLatest = async (userId: string): Promise<MySellerApplicationResponseDto> => {
    const application = await SellerApplication.findOne({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_url'] }],
    });

    if (!application) throw new NotFoundError('user:seller_application_not_found');

    const user = (application as SellerApplication & { user?: User }).user;
    if (!user) throw new InternalServerError('user:user_not_found');

    const rawCreated = (application as any).created_at;
    const rawUpdated = (application as any).updated_at;
    const created_at = rawCreated instanceof Date ? rawCreated.toISOString() : String(rawCreated || '');
    const updated_at = rawUpdated instanceof Date ? rawUpdated.toISOString() : String(rawUpdated || '');

    const base = {
        id: application.id,
        accepted_terms: application.accepted_terms,
        created_at,
        updated_at,
        user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            profile_url: user.profile_url,
        },
    };

    return {
        ...base,
        status: application.status as SellerApplicationStatus,
        rejection_reason: application.rejection_reason || '',
    };
};

export const listSellerPendingApplications = async (): Promise<SellerApplicationWithUserResponseDto[]> => {
    const applications = await SellerApplication.findAll({
        where: { status: 'pending' },
        include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_url'] }],
        order: [['created_at', 'ASC']],
    });

    return applications.map((app) => {
        const user = (app as SellerApplication & { user?: User }).user;
        if (!user) throw new InternalServerError('user:user_not_found');
        return {
            id: app.id,
            user_id: app.user_id,
            status: app.status as SellerApplicationStatus,
            accepted_terms: app.accepted_terms,
            rejection_reason: app.rejection_reason ?? null,
            reviewed_by: app.reviewed_by ?? null,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                profile_url: user.profile_url,
            },
        };
    });
};

export const listSellerHistoryApplications = async (status?: 'approved' | 'rejected'): Promise<SellerApplicationWithUserResponseDto[]> => {
    const where: any = status ? { status } : { status: ['approved', 'rejected'] };
    
    const applications = await SellerApplication.findAll({
        where,
        include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_url'] }],
        order: [['updated_at', 'DESC']],
    });

    return applications.map((app) => {
        const user = (app as SellerApplication & { user?: User }).user;
        if (!user) throw new InternalServerError('user:user_not_found');
        return {
            id: app.id,
            user_id: app.user_id,
            status: app.status as SellerApplicationStatus,
            accepted_terms: app.accepted_terms,
            rejection_reason: app.rejection_reason ?? null,
            reviewed_by: app.reviewed_by ?? null,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                profile_url: user.profile_url,
            },
        };
    });
};

export const reviewSellerApplication = async (dto: ReviewSellerApplication): Promise<SellerApplicationResponseDto> => {
    const application = await SellerApplication.findByPk(dto.application_id);
    if (!application) throw new NotFoundError('user:seller_application_not_found');
    if (application.status !== 'pending') throw new ValidationError('user:seller_application_already_reviewed');

    application.status = dto.status;
    application.reviewed_by = dto.admin_id;

    if (dto.status === 'rejected') {
        application.rejection_reason = dto.rejection_reason;
        await application.save();
        return { ...application.dataValues, rejection_reason: dto.rejection_reason } as any;
    }

    application.rejection_reason = null;

    // 1. Tìm hoặc Tạo Seller
    let seller = await Seller.findOne({ where: { user_id: application.user_id } });
    if (!seller) {
        seller = await Seller.create({
            user_id: application.user_id,
            status: 'active',
        });
    }

    // 2. Tạo Shop (Dùng seller_id thay vì user_id)
    const user = await User.findByPk(application.user_id);
    const shopName = user ? `${user.first_name} Shop` : `Shop ${Date.now()}`;
    const shopSlug = generateSlug(shopName) + '-' + Date.now().toString().slice(-4);

    // --- SỬA LỖI TẠI ĐÂY: Tìm theo seller_id, không dùng userId ---
    const existingShop = await Shop.findOne({ where: { seller_id: seller.id } as any });
    
    if (!existingShop) {
        await Shop.create({
            // userId: application.user_id, <-- XÓA DÒNG NÀY VÌ DB KHÔNG CÓ
            seller_id: seller.id, // Dùng khóa ngoại seller_id
            name: shopName,
            slug: shopSlug,
            address: 'Địa chỉ mặc định',
            phone: user?.phone || '0000000000'
        } as any);
    }

    await application.save();

    if (user && user.role !== 'seller') {
        user.role = 'seller';
        await user.save();
    }

    return {
        id: application.id,
        user_id: application.user_id,
        status: application.status as SellerApplicationStatus,
        accepted_terms: application.accepted_terms,
        rejection_reason: null,
        reviewed_by: application.reviewed_by ?? null,
    };
};