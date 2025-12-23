import { PaymentStatus } from '../../models/Order.model';

export interface PaymentSummaryDto {
    id: string;
    order_id: string;
    payment_method_id: number;
    status: PaymentStatus | 'pending' | 'success' | 'failed' | 'refunded';
    amount: number;
    transaction_code: string | null;
    paid_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

export interface PaymentDetailDto extends PaymentSummaryDto {
    raw_payload: any | null;
}
