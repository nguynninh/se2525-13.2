import { ShipmentStatus } from '../../models/Shipment.model';
import { ShipmentStatusSource } from '../../models/ShipmentStatusHistory.model';

export interface ShipmentStatusHistoryDto {
    id: string;
    shipment_id: string;
    old_status: ShipmentStatus | null;
    new_status: ShipmentStatus;
    event_time: Date;
    source: ShipmentStatusSource;
    description: string | null;
    raw_payload: any | null;
    created_at: Date;
}

export interface ShipmentDto {
    id: string;
    order_id: string;
    tracking_code: string | null;
    status: ShipmentStatus;
    fee: number;
    cod_amount: number;
    shipped_at: Date | null;
    delivered_at: Date | null;
    estimated_delivery_date: string | null;
    created_at: Date;
    updated_at: Date;
    status_history: ShipmentStatusHistoryDto[];
}

export interface CreateShipmentDto {
    order_id: string;
    tracking_code?: string | null;
    status?: ShipmentStatus;
    fee?: number;
    cod_amount?: number;
    shipped_at?: Date | null;
    delivered_at?: Date | null;
    estimated_delivery_date?: string | null;
}

export interface UpdateShipmentStatusDto {
    status: ShipmentStatus;
    source?: ShipmentStatusSource;
    description?: string | null;
    raw_payload?: any | null;
}
