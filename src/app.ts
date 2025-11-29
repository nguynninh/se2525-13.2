import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './registry';
import i18nMiddleware from './i18n';
import { errorHandler } from './middlewares/errorHandler';
import indexRouter from './routers/index.route';
import authRouter from './routers/api/v1/auth.route';
import sellerApplicationRouter from './routers/api/v1/sellerApplication.route';
import userRouter from './routers/api/v1/user.route';

dotenv.config();

const app: Express = express();

// Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(i18nMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/seller-applications', sellerApplicationRouter);
app.use('/api/user', userRouter);

app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

export default app;
