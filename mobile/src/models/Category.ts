export interface Category {
    id: string;
    parent_id: string | null;
    name: string;
    slug: string;
    icon_url: string | null;
    created_at: string;
    updated_at: string;
}
