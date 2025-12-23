import { SellerApplication } from '../../models/SellerApplication.model';
import { Seller } from '../../models/Seller.model';
import { User } from '../../models/User.model';
import {
    SellerApplicationStatus,
    CreateSellerApplicationDto,
    ReviewSellerApplication,
    SellerApplicationResponseDto,
    SellerApplicationWithUserResponseDto,
    MySellerApplicationResponseDto,
} from './sellerApplication.dto';
import { ValidationError, NotFoundError, InternalServerError } from '../../exception/AppError';

// Tạo đơn đăng ký seller mới
export const createSellerApplication = async (
    userId: string,
    dto: CreateSellerApplicationDto,
): Promise<SellerApplicationResponseDto> => {
    // Check user
    const user = await User.findByPk(userId);
    if (!user) {
        throw new NotFoundError('user:user_not_found');
    }

    // Check seller
    const existingSeller = await Seller.findOne({ where: { user_id: userId } });
    if (existingSeller) {
        throw new ValidationError('user:already_seller');
    }

    // Check pending application
    const pending = await SellerApplication.findOne({
        where: { user_id: userId, status: 'pending' },
    });
    if (pending) {
        throw new ValidationError('user:pending_application_exists');
    }

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

// Lấy hồ sơ đăng ký seller mới nhất của user
export const getMyLatest = async (userId: string): Promise<MySellerApplicationResponseDto> => {
    const application = await SellerApplication.findOne({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_url'],
            },
        ],
    });

    if (!application) {
        throw new NotFoundError('user:seller_application_not_found');
    }

    const user = (application as SellerApplication & { user?: User }).user;
    if (!user) {
        throw new InternalServerError('user:user_not_found');
    }

    const rawCreated = (application as any).created_at as Date | string | undefined;
    const rawUpdated = (application as any).updated_at as Date | string | undefined;

    const created_at = rawCreated instanceof Date ? rawCreated.toISOString() : rawCreated ? String(rawCreated) : '';
    const updated_at = rawUpdated instanceof Date ? rawUpdated.toISOString() : rawUpdated ? String(rawUpdated) : '';

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

    if (application.status === 'pending') {
        return {
            ...base,
            status: 'pending',
        };
    }

    if (application.status === 'approved') {
        return {
            ...base,
            status: 'approved',
        };
    }

    return {
        ...base,
        status: 'rejected',
        rejection_reason: application.rejection_reason || '',
    };
};

// Admin hiển thị hồ sơ seller pending
export const listSellerPendingApplications = async (): Promise<SellerApplicationWithUserResponseDto[]> => {
    const applications = await SellerApplication.findAll({
        where: { status: 'pending' },
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_url'],
            },
        ],
        order: [['created_at', 'ASC']],
    });

    return applications.map((application) => {
        const user = (application as SellerApplication & { user?: User }).user;

        if (!user) {
            throw new InternalServerError('user:user_not_found');
        }

        return {
            id: application.id,
            user_id: application.user_id,
            status: application.status as SellerApplicationStatus,
            accepted_terms: application.accepted_terms,
            rejection_reason: application.rejection_reason ?? null,
            reviewed_by: application.reviewed_by ?? null,
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

// Admin  lịch sử hồ sơ seller (rejected, approved)
export const listSellerHistoryApplications = async (
    status?: 'approved' | 'rejected',
): Promise<SellerApplicationWithUserResponseDto[]> => {
    const where: any = {};

    if (status) {
        where.status = status;
    } else {
        where.status = ['approved', 'rejected'];
    }

    const applications = await SellerApplication.findAll({
        where,
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_url'],
            },
        ],
        order: [['updated_at', 'DESC']],
    });

    return applications.map((application) => {
        const user = (application as SellerApplication & { user?: User }).user;

        if (!user) {
            throw new InternalServerError('user:user_not_found');
        }

        return {
            id: application.id,
            user_id: application.user_id,
            status: application.status as SellerApplicationStatus,
            accepted_terms: application.accepted_terms,
            rejection_reason: application.rejection_reason ?? null,
            reviewed_by: application.reviewed_by ?? null,
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

// Admin duyệt hồ sơ seller
export const reviewSellerApplication = async (dto: ReviewSellerApplication): Promise<SellerApplicationResponseDto> => {
    const application = await SellerApplication.findByPk(dto.application_id);

    if (!application) {
        throw new NotFoundError('user:seller_application_not_found');
    }

    if (application.status !== 'pending') {
        throw new ValidationError('user:seller_application_already_reviewed');
    }

    application.status = dto.status;
    application.reviewed_by = dto.admin_id;

    if (dto.status === 'rejected') {
        application.rejection_reason = dto.rejection_reason;
        await application.save();
        return {
            id: application.id,
            user_id: application.user_id,
            status: application.status as SellerApplicationStatus,
            accepted_terms: application.accepted_terms,
            rejection_reason: application.rejection_reason ?? null,
            reviewed_by: application.reviewed_by ?? null,
        };
    }

    application.rejection_reason = null;

    // Tạo seller khi duyệt hồ sơ thành công
    const existingSeller = await Seller.findOne({ where: { user_id: application.user_id } });
    if (!existingSeller) {
        await Seller.create({
            user_id: application.user_id,
            status: 'active',
        });
    }

    await application.save();

    // Đổi role user sang seller
    const user = await User.findByPk(application.user_id);
    if (!user) {
        throw new InternalServerError('user:user_not_found');
    }

    if (user.role !== 'seller') {
        user.role = 'seller';
        await user.save();
    }

    return {
        id: application.id,
        user_id: application.user_id,
        status: application.status as SellerApplicationStatus,
        accepted_terms: application.accepted_terms,
        rejection_reason: application.rejection_reason ?? null,
        reviewed_by: application.reviewed_by ?? null,
    };
};
