import { Request, Response, NextFunction } from 'express';
import * as locationService from './location.service';
import { CreateShippingAddressDto, UpdateShippingAddressDto } from './location.dto';
import { UnauthorizedError } from '../../exception/AppError';

export const listProvincesController = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await locationService.listProvinces();
        res.json({ data });
    } catch (err) {
        next(err);
    }
};

export const listWardsByProvinceController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { provinceId } = req.params;
        const data = await locationService.listWardsByProvince(provinceId);
        res.json({ data });
    } catch (err) {
        next(err);
    }
};

export const listMyShippingAddressesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new UnauthorizedError('auth:unauthenticated');
        }

        const data = await locationService.listMyShippingAddresses(req.user.id);
        res.json({ data });
    } catch (err) {
        next(err);
    }
};

export const createMyShippingAddressController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new UnauthorizedError('auth:unauthenticated');
        }

        const body = req.body as CreateShippingAddressDto;

        const data = await locationService.createMyShippingAddress(req.user.id, body);

        res.status(201).json({ data });
    } catch (err) {
        next(err);
    }
};

export const updateMyShippingAddressController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new UnauthorizedError('auth:unauthenticated');
        }

        const { id } = req.params;
        const body = req.body as UpdateShippingAddressDto;

        const data = await locationService.updateMyShippingAddress(req.user.id, id, body);

        res.json({ data });
    } catch (err) {
        next(err);
    }
};

export const deleteMyShippingAddressController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new UnauthorizedError('auth:unauthenticated');
        }

        const { id } = req.params;

        await locationService.deleteMyShippingAddress(req.user.id, id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export const setDefaultMyShippingAddressController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new UnauthorizedError('auth:unauthenticated');
        }

        const { id } = req.params;

        const data = await locationService.setDefaultMyShippingAddress(req.user.id, id);

        res.json({ data });
    } catch (err) {
        next(err);
    }
};
