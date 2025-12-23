import { UserResponseDto } from '../user/user.dto';
import { SellerStatus } from '../../models/Seller.model';

/*
 * ---------- INPUT DTOs ----------
 */
export interface CreateSellerDto {
    user_id: string;
}

export interface UpdateSellerStatusDto {
    status: SellerStatus;
}

/*
 * ---------- OUTPUT DTOs ----------
 */
export interface SellerResponseDto {
    id: string;
    user_id: string;
    status: SellerStatus;
}

export interface SellerWithUserResponseDto extends SellerResponseDto {
    user: Pick<UserResponseDto, 'id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'profile_url'>;
}
