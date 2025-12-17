import { UserResponseDto } from '../user/user.dto';

export interface CreateReviewDto {
    product_id: string;
    rating: number;
    comment?: string;
    images?: string;
}

export interface UpdateReviewDto {
    rating?: number;
    comment?: string;
    images?: string;
}

export interface ReviewResponseDto {
    id: string;
    product_id: string;
    user_id: string;
    user?: UserResponseDto;
    rating: number;
    comment: string | null;
    images: string | null;
    created_at: Date;
}

export interface ReviewListResponseDto {
    data: ReviewResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    };
}

export interface CreateQuestionDto {
    product_id: string;
    question: string;
}

export interface AnswerQuestionDto {
    answer: string;
}

export interface QuestionResponseDto {
    id: string;
    product_id: string;
    user_id: string;
    user?: UserResponseDto;
    question: string;
    answer: string | null;
    answered_by: string | null;
    answerer?: UserResponseDto;
    created_at: Date;
    updated_at: Date;
}

export interface QuestionListResponseDto {
    data: QuestionResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    };
}