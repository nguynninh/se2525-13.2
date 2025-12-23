import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import i18nMiddleware from './i18n';
import { errorHandler } from './middlewares/errorHandler';
import indexRouter from './routers/index.route';
import authRouter from './routers/api/v1/auth.route';

dotenv.config();

const app: Express = express();

// Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(i18nMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Áp dụng router
app.use('/', indexRouter);
app.use('/api/auth', authRouter);

// Bắt Lỗi
app.use(errorHandler);

export default app;
