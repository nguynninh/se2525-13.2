import UserModel from "../models/UserModel";
import { Request, Response } from "express";
import dotenv from 'dotenv';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseFormatter';

dotenv.config();

const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { firstname, lastname, email, password } = req.body;

    const newUser = await UserModel.create({ email, password, firstname, lastname });

    return successResponse(res, {
        message: req.t('user:user_created_successfully'),
        data: {
            user: {
                ...newUser.toJSON(),
                password: undefined,
            }
        }
    });
});

export { 
    createUser,
};