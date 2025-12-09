import { Address } from '../../models/Address.model';
import { Province } from '../../models/Provinces.model';
import { Ward } from '../../models/Wards.model';
import { ShippingAddress } from '../../models/ShippingAddress.model';
import {
    CreateShippingAddressDto,
    UpdateShippingAddressDto,
    ShippingAddressResponseDto,
    ProvinceResponseDto,
    WardResponseDto,
} from './location.dto';
import { NotFoundError, ValidationError, InternalServerError } from '../../exception/AppError';
import { Transaction } from 'sequelize';
import { sequelize } from '../../models/index';

const mapToShippingAddressDto = (shippingAddress: any): ShippingAddressResponseDto => {
    const addr = shippingAddress.address;
    const ward = addr.ward;
    const province = ward.province;

    return {
        id: shippingAddress.id,
        receiver_name: shippingAddress.receiver_name,
        receiver_phone: shippingAddress.receiver_phone,
        is_default: shippingAddress.is_default,
        created_at: shippingAddress.created_at,
        updated_at: shippingAddress.updated_at,
        address: {
            address_line: addr.address_line,
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

// Lấy danh sách tỉnh/thành phố
export const listProvinces = async (): Promise<ProvinceResponseDto[]> => {
    const provinces = await Province.findAll({
        order: [['name', 'ASC']],
    });

    return provinces.map(
        (p: Province): ProvinceResponseDto => ({
            code: p.code,
            name: p.name,
        }),
    );
};

// Lấy danh sách quận/huyện theo tỉnh/thành phố
export const listWardsByProvince = async (provinceId: string): Promise<WardResponseDto[]> => {
    const province = await Province.findByPk(provinceId);
    if (!province) {
        throw new NotFoundError('shipping:province_not_found');
    }

    const wards = await Ward.findAll({
        where: { province_id: provinceId },
        order: [['name', 'ASC']],
    });

    return wards.map(
        (w: Ward): WardResponseDto => ({
            code: w.code,
            name: w.name,
            province_id: province.id,
            province_name: province.name,
        }),
    );
};

// Lấy thông tin quận/huyện theo ID
export const getWardById = async (wardId: string): Promise<Ward> => {
    const ward = await Ward.findByPk(wardId, {
        include: [{ model: Province, as: 'province' }],
    });

    if (!ward) {
        throw new NotFoundError('shipping:ward_not_found');
    }

    return ward;
};

// Lấy danh sách địa chỉ giao hàng của người dùng
export const listMyShippingAddresses = async (userId: string): Promise<ShippingAddressResponseDto[]> => {
    const rows = await ShippingAddress.findAll({
        where: { user_id: userId },
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
        ],
        order: [['created_at', 'DESC']],
    });

    return rows.map(mapToShippingAddressDto);
};

// Tạo địa chỉ giao hàng cho người dùng
export const createMyShippingAddress = async (
    userId: string,
    dto: CreateShippingAddressDto,
): Promise<ShippingAddressResponseDto> => {
    return sequelize.transaction(async (tx: Transaction) => {
        const { address, receiver_name, receiver_phone, is_default } = dto;

        const ward = await Ward.findByPk(address.ward_id, { transaction: tx });
        if (!ward) {
            throw new NotFoundError('shipping:ward_not_found');
        }

        // Tạo địa chỉ
        const createdAddress = await Address.create(
            {
                address_line: address.address_line,
                ward_id: address.ward_id,
            },
            { transaction: tx },
        );

        // Kiểm tra default
        const count = await ShippingAddress.count({
            where: { user_id: userId },
            transaction: tx,
        });

        let finalIsDefault = is_default ?? false;
        if (count === 0) {
            finalIsDefault = true;
        }

        if (finalIsDefault) {
            await ShippingAddress.update({ is_default: false }, { where: { user_id: userId }, transaction: tx });
        }

        // Tạo địa chỉ giao hàng
        const shippingAddress = await ShippingAddress.create(
            {
                user_id: userId,
                address_id: createdAddress.id,
                receiver_name,
                receiver_phone,
                is_default: finalIsDefault,
            },
            { transaction: tx },
        );

        const full = await ShippingAddress.findByPk(shippingAddress.id, {
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
            ],
            transaction: tx,
        });

        if (!full) {
            throw new ValidationError('shipping:create_failed');
        }

        return mapToShippingAddressDto(full);
    });
};

// Cập nhật địa chỉ giao hàng của người dùng
export const updateMyShippingAddress = async (
    userId: string,
    id: string,
    dto: UpdateShippingAddressDto,
): Promise<ShippingAddressResponseDto> => {
    return sequelize.transaction(async (tx: Transaction) => {
        const shippingAddress = await ShippingAddress.findOne({
            where: { id, user_id: userId },
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
            ],
            transaction: tx,
            lock: tx.LOCK.UPDATE,
        });

        if (!shippingAddress) {
            throw new NotFoundError('shipping:address_not_found');
        }

        if (!shippingAddress.address) {
            throw new InternalServerError('shipping:address_not_loaded');
        }

        if (dto.address) {
            const { ward_id, address_line } = dto.address;

            if (ward_id) {
                const ward = await Ward.findByPk(ward_id, {
                    transaction: tx,
                });
                if (!ward) {
                    throw new NotFoundError('shipping:ward_not_found');
                }
                shippingAddress.address.ward_id = ward_id;
            }

            if (address_line) {
                shippingAddress.address.address_line = address_line;
            }

            await shippingAddress.address.save({ transaction: tx });
        }

        if (dto.receiver_name !== undefined) {
            shippingAddress.receiver_name = dto.receiver_name;
        }
        if (dto.receiver_phone !== undefined) {
            shippingAddress.receiver_phone = dto.receiver_phone;
        }

        if (dto.is_default === true && !shippingAddress.is_default) {
            await ShippingAddress.update({ is_default: false }, { where: { user_id: userId }, transaction: tx });
            shippingAddress.is_default = true;
        } else if (dto.is_default === false && shippingAddress.is_default) {
            const otherCount = await ShippingAddress.count({
                where: { user_id: userId, id: { $ne: id } as any },
                transaction: tx,
            });
            if (otherCount === 0) {
                throw new ValidationError('shipping:cannot_unset_only_default');
            }
            shippingAddress.is_default = false;
        }

        await shippingAddress.save({ transaction: tx });

        await shippingAddress.reload({
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
            ],
            transaction: tx,
        });

        return mapToShippingAddressDto(shippingAddress);
    });
};

// Xoá địa chỉ giao hàng của người dùng
export const deleteMyShippingAddress = async (userId: string, id: string): Promise<void> => {
    await sequelize.transaction(async (tx: Transaction) => {
        const shippingAddress = await ShippingAddress.findOne({
            where: { id, user_id: userId },
            include: [{ model: Address, as: 'address' }],
            transaction: tx,
            lock: tx.LOCK.UPDATE,
        });

        if (!shippingAddress) {
            throw new NotFoundError('shipping:address_not_found');
        }

        const wasDefault = shippingAddress.is_default;

        // Xoá shipping address
        await shippingAddress.destroy({ transaction: tx });

        // Xoá luôn address đi kèm
        if (shippingAddress.address) {
            await shippingAddress.address.destroy({ transaction: tx });
        }

        if (wasDefault) {
            // Gán default cho 1 địa chỉ khác nếu có
            const another = await ShippingAddress.findOne({
                where: { user_id: userId },
                order: [['created_at', 'DESC']],
                transaction: tx,
            });
            if (another) {
                another.is_default = true;
                await another.save({ transaction: tx });
            }
        }
    });
};

// Đặt địa chỉ giao hàng mặc định cho người dùng
export const setDefaultMyShippingAddress = async (userId: string, id: string): Promise<ShippingAddressResponseDto> => {
    return sequelize.transaction(async (tx: Transaction) => {
        const shippingAddress = await ShippingAddress.findOne({
            where: { id, user_id: userId },
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
            ],
            transaction: tx,
            lock: tx.LOCK.UPDATE,
        });

        if (!shippingAddress) {
            throw new NotFoundError('shipping:address_not_found');
        }

        await ShippingAddress.update({ is_default: false }, { where: { user_id: userId }, transaction: tx });

        shippingAddress.is_default = true;
        await shippingAddress.save({ transaction: tx });

        return mapToShippingAddressDto(shippingAddress);
    });
};
