export interface ProvinceResponseDto {
    code: string;
    name: string;
}

export interface WardResponseDto {
    id: string;
    code: string;
    name: string;
    province_id: string;
    province_name: string;
}

export interface AddressPayloadDto {
    address_line: string;
    ward_id: string;
}

export interface CreateShippingAddressDto {
    receiver_name: string;
    receiver_phone: string;
    address: AddressPayloadDto;
    is_default?: boolean;
}

export interface UpdateShippingAddressDto {
    receiver_name?: string;
    receiver_phone?: string;
    address?: Partial<AddressPayloadDto>;
    is_default?: boolean;
}

export interface ShippingAddressResponseDto {
    id: string;
    receiver_name: string;
    receiver_phone: string;
    is_default: boolean;
    created_at: Date;
    updated_at: Date;
    address: {
        address_line: string;
        ward: {
            code: string;
            name: string;
            province: {
                code: string;
                name: string;
            };
        };
    };
}
