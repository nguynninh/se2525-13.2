export interface CreateCategoryDto {
    name: string;
    parent_id?: string;
    icon_url?: string;
}

export interface UpdateCategoryDto {
    name?: string;
    parent_id?: string | null;
    icon_url?: string | null;
}

export interface CategoryResponseDto {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    icon_url: string | null;
    children?: CategoryResponseDto[];
    created_at: Date;
    updated_at: Date;
}