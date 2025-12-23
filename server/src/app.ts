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

dotenv.config();

const app: Express = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(i18nMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (_req, res) => {
    res.send('Welcome to Hiki App');
});

const apiPrefix = process.env.API_PREFIX || '/api';
app.use(apiPrefix, indexRouter);

app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

export default app;
