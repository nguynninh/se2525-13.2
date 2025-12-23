export interface RegisterDeviceTokenDto {
    device_id: string;
    platform: 'android' | 'ios' | 'web';
    push_token: string;
    app_version?: string | null;
    os_version?: string | null;
}

export interface DeviceTokenDto extends RegisterDeviceTokenDto {
    id: string;
    user_id: string;
    is_active: boolean;
    last_used_at: Date | null;
    created_at: Date;
    updated_at: Date;
}
