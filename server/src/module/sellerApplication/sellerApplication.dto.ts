import { UserResponseDto } from '../user/user.dto';

export type SellerApplicationStatus = 'pending' | 'approved' | 'rejected';

export type SellerApplicationHistoryStatus = Extract<SellerApplicationStatus, 'approved' | 'rejected'>;

/*
 * ---------- INPUT DTOs (User side) ----------
 */

// User gửi đơn đăng ký seller
export interface CreateSellerApplicationDto {
    accepted_terms: boolean;
}

/*
 * ---------- INPUT DTOs (Admin side) ----------
 */

// Admin duyệt hồ sơ seller
export type ReviewSellerApplicationDto =
    | {
          status: 'approved';
      }
    | {
          status: 'rejected';
          rejection_reason: string;
      };

export type ReviewSellerApplication = ReviewSellerApplicationDto & {
    application_id: string;
    admin_id: string;
};

// filter danh sách hồ sơ
export interface ListSellerApplicationsQueryDto {
    status?: SellerApplicationStatus;
    user_id?: string;
}

/*
 * ---------- OUTPUT DTOs ----------
 */

export interface SellerApplicationResponseDto {
    id: string;
    user_id: string;
    status: SellerApplicationStatus;
    accepted_terms: boolean;
    rejection_reason: string | null;
    reviewed_by: string | null;
}

export interface SellerApplicationWithUserResponseDto extends SellerApplicationResponseDto {
    user: Pick<UserResponseDto, 'id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'profile_url'>;
}

export type MySellerApplicationResponseDto =
    | {
          id: string;
          status: 'pending';
          accepted_terms: boolean;
          created_at: string;
          updated_at: string;
          user: Pick<UserResponseDto, 'id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'profile_url'>;
      }
    | {
          id: string;
          status: 'approved';
          accepted_terms: boolean;
          created_at: string;
          updated_at: string;
          user: Pick<UserResponseDto, 'id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'profile_url'>;
      }
    | {
          id: string;
          status: 'rejected';
          accepted_terms: boolean;
          created_at: string;
          updated_at: string;
          rejection_reason: string;
          user: Pick<UserResponseDto, 'id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'profile_url'>;
      };
