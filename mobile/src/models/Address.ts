export interface Address {
    id: string;
    receiver_name: string;
    receiver_phone: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
    address: {
        address_line: string;
        ward: {
            code: string;
            name: string;
            province: {
                code: string;
                name: string;
            }
        }
    }
}
