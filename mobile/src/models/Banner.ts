export interface Banner {
    id: string;
    title: string;
    image_url: string;
    link?: string;
    priority: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
