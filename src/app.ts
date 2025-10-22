import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import i18nMiddleware from './i18n';
import indexRouter from './routers/index.route';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app: Express = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(i18nMiddleware);

app.use('/', indexRouter);

app.use(errorHandler);

export default app;
