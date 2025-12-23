import { UserRole } from '../../models/User.model';
import { SellerStatus } from '../../models/Seller.model';

export type SellerStatusDto = SellerStatus;

/*
 * ---------- INPUT DTOs ----------
 */
export interface RegisterStartDto {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface RegisterResendDto {
    email: string;
}

export interface RegisterFinalizeDto {
    code: string;
}

export interface ChangePasswordDto {
    current_password: string;
    new_password: string;
}

export interface ListUsersQueryDto {
    role?: UserRole;
    search?: string;
}

/*
 * ---------- OUTPUT DTOs ----------
 */
export type RegisterStartResponse =
    | { sent: true; ttl: number; windowRemaining: number; rotated: boolean }
    | { sent: false; reason: string; ttlRemaining: number }
    | { sent: false; reason: string; retryAfter: number };

export type RegisterResendResponse = RegisterStartResponse;

export interface UserResponseDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: UserRole;
    phone: string | null;
    profile_url?: string | null;
}

export type RegisterFinalizeResponse = UserResponseDto;

export interface UpdateUserDto {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    phone?: string | null;
    profile_url?: string | null;
}

export type UpdateMeDto = Pick<UpdateUserDto, 'first_name' | 'last_name' | 'phone' | 'profile_url'>;

export interface MeCustomerDto {
    id: string;
    loyalty_points: number;
}

export interface MeResponseDto extends UserResponseDto {
    customer: MeCustomerDto | null;
}

// Seller

export interface SellerResponseDto {
    id: string;
    user_id: string;
    status: SellerStatus;
}

export interface SellerWithUserResponseDto extends SellerResponseDto {
    user: Pick<UserResponseDto, 'id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'profile_url'>;
}

export interface CustomerResponseDto {
    id: string;
    user_id: string;
    loyalty_points: number;
}

export interface ListSellersQueryDto {
    status?: SellerStatus;
}

export interface VerifyUserDto {
    email: string;
}

export interface UserIdDto {
    id: string;
}

export interface AdminResponseDto {
    id: string;
    user_id: string;
}

export interface AdminUserDetailResponseDto {
    user: UserResponseDto;
    customer: CustomerResponseDto | null;
    seller: SellerResponseDto | null;
    admin: AdminResponseDto | null;
}
