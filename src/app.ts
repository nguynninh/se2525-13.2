import express from 'express';
import cors from 'cors';
import i18nMiddleware from "./i18n";
import type { Request, Response } from 'express';
import config from './config/config';
import authRouter from './routers/authRouter';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(cors());
app.use(i18nMiddleware);

const base = config.apiBasePath || '';

app.use(`${base}/auth`, authRouter);

app.get(`${base}/healthy`, (req: Request, res: Response) => {
	res.status(200).json({
		code: 200,
        message: req.t('common:success'),
	});
});

app.use((req: Request, res: Response) => {
	res.status(404).json({
		code: 404,
        message: req.t('common:error'),
	});
});

app.use(errorHandler);

export default app;