import { Op } from 'sequelize';
import { User } from '../../models/User.model';
import { Customer } from '../../models/Customer.model';
import { Seller } from '../../models/Seller.model';
import { Admin } from '../../models/Admin.model';
import { Cart } from '../../models/Cart.model';
import { FavoriteShop } from '../../models/FavoriteShop.model';
import { FavoriteItem } from '../../models/FavoriteItem.model';
import { Order } from '../../models/Order.model';
import { OrderStatusHistory } from '../../models/OrderStatusHistory.model';
import { Notification } from '../../models/Notification.model';
import { ProductReview } from '../../models/ProductReview.model';
import { ProductQuestion } from '../../models/ProductQuestion.model';
import { SellerApplication } from '../../models/SellerApplication.model';
import { ShippingAddress } from '../../models/ShippingAddress.model';
import { sequelize } from '../../models';
import {
    UserResponseDto,
    UpdateMeDto,
    ChangePasswordDto,
    SellerStatusDto,
    SellerResponseDto,
    SellerWithUserResponseDto,
    ListUsersQueryDto,
    CustomerResponseDto,
    AdminResponseDto,
    AdminUserDetailResponseDto,
    MeResponseDto,
} from './user.dto';
import { listMyShippingAddresses } from '../location/location.service';
import { NotFoundError, ValidationError, InternalServerError } from '../../exception/AppError';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const comparePassword = async (plain: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(plain, hash);
};

const hashPassword = async (plain: string): Promise<string> => {
    return bcrypt.hash(plain, SALT_ROUNDS);
};

export const getMe = async (userId: string): Promise<MeResponseDto> => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new NotFoundError('user:user_not_found');
    }

    const customer = await Customer.findOne({ where: { user_id: userId } });

    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile_url: user.profile_url,
        customer: customer
            ? {
                  id: customer.id,
                  loyalty_points: customer.loyalty_points,
              }
            : null,
    };
};

export const updateMe = async (userId: string, dto: UpdateMeDto): Promise<UserResponseDto> => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new NotFoundError('user:user_not_found');
    }

    if (dto.first_name !== undefined) user.first_name = dto.first_name;
    if (dto.last_name !== undefined) user.last_name = dto.last_name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.profile_url !== undefined) user.profile_url = dto.profile_url;

    await user.save();

    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile_url: user.profile_url,
    };
};

export const changePassword = async (userId: string, dto: ChangePasswordDto): Promise<void> => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new NotFoundError('user:user_not_found');
    }

    console.log('dto in changePassword:', dto);
    console.log('current_password =', dto.current_password);
    console.log('hash in DB       =', user.password);

    const isMatch = await comparePassword(dto.current_password, user.password);
    if (!isMatch) {
        throw new ValidationError('auth:password_incorrect');
    }

    console.log('isMatch =', isMatch);

    const newHashed = await hashPassword(dto.new_password);
    user.password = newHashed;
    await user.save();
};

export const updateAvatar = async (userId: string, profileUrl: string): Promise<UserResponseDto> => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new NotFoundError('user:user_not_found');
    }

    user.profile_url = profileUrl;
    await user.save();

    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile_url: user.profile_url,
    };
};

export const deleteMe = async (userId: string): Promise<void> => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new NotFoundError('user:user_not_found');
    }

    await user.destroy();
};

// đổi status seller
export const adminUpdateSellerStatus = async (
    sellerId: string,
    status: SellerStatusDto,
): Promise<SellerResponseDto> => {
    const seller = await Seller.findByPk(sellerId);
    if (!seller) {
        throw new NotFoundError('user:seller_not_found');
    }

    seller.status = status;
    await seller.save();

    return {
        id: seller.id,
        user_id: seller.user_id,
        status: seller.status as SellerStatusDto,
    };
};

// xóa seller
export const adminDeleteSeller = async (sellerId: string): Promise<void> => {
    const seller = await Seller.findByPk(sellerId);
    if (!seller) {
        throw new NotFoundError('user:seller_not_found');
    }

    const user = await User.findByPk(seller.user_id);
    if (!user) {
        throw new InternalServerError('user:user_not_found_for_seller');
    }

    //đổi role về customer nếu đang là seller
    if (user.role === 'seller') {
        user.role = 'customer';
        await user.save();
    }

    await seller.destroy();
};

// xóa user
export const adminDeleteUser = async (userId: string): Promise<void> => {
    await sequelize.transaction(async (tx) => {
        const user = await User.findByPk(userId, { transaction: tx });
        if (!user) {
            throw new NotFoundError('user:user_not_found');
        }

        if (user.role === 'seller') {
            const seller = await Seller.findOne({ where: { user_id: userId }, transaction: tx });
            if (seller) {
                // reuse seller delete to handle role downgrade
                await adminDeleteSeller(seller.id);
            } else {
                user.role = 'customer';
                await user.save({ transaction: tx });
            }
        } else if (user.role === 'customer') {
            const customer = await Customer.findOne({ where: { user_id: userId }, transaction: tx });
            if (customer) {
                await customer.destroy({ transaction: tx });
            }
        }

        // clean up related data to avoid FK errors
        await Promise.all([
            ShippingAddress.destroy({ where: { user_id: userId }, transaction: tx }),
            Cart.destroy({ where: { user_id: userId }, transaction: tx }),
            FavoriteShop.destroy({ where: { user_id: userId }, transaction: tx }),
            FavoriteItem.destroy({ where: { user_id: userId }, transaction: tx }),
            SellerApplication.destroy({ where: { user_id: userId }, transaction: tx }),
            Notification.destroy({ where: { user_id: userId }, transaction: tx }),
            ProductReview.destroy({ where: { user_id: userId }, transaction: tx }),
            ProductQuestion.destroy({ where: { user_id: userId }, transaction: tx }),
            OrderStatusHistory.destroy({ where: { changed_by_user_id: userId }, transaction: tx }),
            Order.destroy({ where: { user_id: userId }, transaction: tx }),
        ]);

        await user.destroy({ transaction: tx });
    });
};

export const getSellerMe = async (userId: string): Promise<SellerWithUserResponseDto> => {
    const seller = await Seller.findOne({
        where: { user_id: userId },
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_url'],
            },
        ],
    });

    if (!seller) {
        throw new NotFoundError('user:seller_not_found');
    }

    const user = (seller as Seller & { user?: User }).user;
    if (!user) {
        throw new InternalServerError('user:user_not_found_for_seller');
    }

    return {
        id: seller.id,
        user_id: seller.user_id,
        status: seller.status as SellerStatusDto,
        user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            profile_url: user.profile_url,
        },
    };
};

// Admin list users
export const adminListUsers = async (params: ListUsersQueryDto): Promise<UserResponseDto[]> => {
    const where: any = {};

    if (params.role) {
        where.role = params.role;
    }

    if (params.search && params.search.trim() !== '') {
        const q = `%${params.search.trim()}%`;

        where[Op.or] = [
            { first_name: { [Op.iLike]: q } },
            { last_name: { [Op.iLike]: q } },
            { email: { [Op.iLike]: q } },
        ];
    }

    const users = await User.findAll({
        where,
        order: [['updated_at', 'DESC']],
    });

    return users.map((user: User): UserResponseDto => {
        return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            profile_url: user.profile_url,
        };
    });
};

// admin xem chi tiết user
export const adminGetUserFullDetail = async (userId: string): Promise<AdminUserDetailResponseDto> => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new NotFoundError('user:user_not_found');
    }

    const [customer, seller, admin, shippingAddresses] = await Promise.all([
        Customer.findOne({ where: { user_id: userId } }),
        Seller.findOne({ where: { user_id: userId } }),
        Admin.findOne({ where: { user_id: userId } }),
        listMyShippingAddresses(userId),
    ]);

    const customerDto: CustomerResponseDto | null = customer
        ? {
              id: customer.id,
              user_id: customer.user_id,
              loyalty_points: customer.loyalty_points,
          }
        : null;

    const sellerDto: SellerResponseDto | null = seller
        ? {
              id: seller.id,
              user_id: seller.user_id,
              status: seller.status as SellerStatusDto,
          }
        : null;

    const adminDto: AdminResponseDto | null = admin
        ? {
              id: admin.id,
              user_id: admin.user_id,
          }
        : null;

    return {
        user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            profile_url: user.profile_url,
        },
        customer: customerDto,
        seller: sellerDto,
        admin: adminDto,
        shipping_addresses: shippingAddresses,
    };
};
