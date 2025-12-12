import { Request, Response, NextFunction } from 'express';
import response from '../../utils/response';
import {
    createSellerApplication,
    getMyLatest,
    listSellerPendingApplications,
    listSellerHistoryApplications,
    reviewSellerApplication,
} from './sellerApplication.service';

import {
    CreateSellerApplicationDto,
    ReviewSellerApplication,
    SellerApplicationResponseDto,
    SellerApplicationWithUserResponseDto,
    MySellerApplicationResponseDto,
    ReviewSellerApplicationDto,
} from './sellerApplication.dto';

import { ValidationError } from '../../exception/AppError';

export const createSellerApplicationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ValidationError('auth:unauthenticated');
        }
        const dto = req.body as CreateSellerApplicationDto;

        const application: SellerApplicationResponseDto = await createSellerApplication(userId, dto);

        return response.created(res, application, 'user:application_created_successfully');
    } catch (err) {
        next(err);
    }
};

export const getMyLatestSellerApplicationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ValidationError('auth:unauthenticated');
        }

        const result: MySellerApplicationResponseDto = await getMyLatest(userId);

        response.ok(res, result, 'user:get_seller_application_successfully');
    } catch (err) {
        next(err);
    }
};

export const listSellerPendingApplicationsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await listSellerPendingApplications();
        response.ok(res, result, 'admin:get_pending_seller_applications_successfully');
    } catch (err) {
        next(err);
    }
};

export const listSellerHistoryApplicationsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rawStatus = req.query.status;
        let status: 'approved' | 'rejected' | undefined = undefined;

        if (typeof rawStatus === 'string') {
            if (rawStatus === 'approved' || rawStatus === 'rejected') {
                status = rawStatus;
            } else {
                throw new ValidationError('user:invalid_status_filter');
            }
        }

        const result: SellerApplicationWithUserResponseDto[] = await listSellerHistoryApplications(status);

        return response.ok(res, result, 'admin:get_seller_applications_history_successfully');
    } catch (err) {
        next(err);
    }
};

export const reviewSellerApplicationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;
        if (!adminId) {
            throw new ValidationError('auth:unauthenticated');
        }

        const applicationId = req.params.id; // 👈 ĐỔI TỪ applicationId -> id
        if (!applicationId) {
            throw new ValidationError('user:application_id_required');
        }

        const status = req.body as ReviewSellerApplicationDto;

        const dto: ReviewSellerApplication = {
            ...status,
            application_id: applicationId,
            admin_id: adminId,
        };

        const result: SellerApplicationResponseDto = await reviewSellerApplication(dto);

        response.ok(res, result, 'user:review_seller_application_successfully');
    } catch (err) {
        next(err);
    }
};
