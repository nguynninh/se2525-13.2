import { UserResponseDto } from '../user/user.dto';

/*
 * ---------- INPUT DTOs ----------
 */

export interface UpdateCustomerLoyaltyDto {
    loyalty_points: number;
}

export interface CreateCustomerDto {
    user_id: string;
}

/*
 * ---------- OUTPUT DTOs ----------
 */

export interface CustomerResponseDto {
    id: string;
    user_id: string;
    loyalty_points: number;
}

// Trả luôn thông tin user đi kèm
export interface CustomerWithUserResponseDto extends CustomerResponseDto {
    user: Pick<UserResponseDto, 'id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'profile_url'>;
}
