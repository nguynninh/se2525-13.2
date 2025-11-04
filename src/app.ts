import express from 'express';
import cors from 'cors';
import i18nMiddleware from "./i18n";
import type { Request, Response } from 'express';
import config from './config/config';
import authRouter from './routers/authRouter';
import userRouter from './routers/userRouter';
import chatRouter from './routers/chatRouter';
import { errorHandler } from './middlewares/errorHandler';
import './models/associations';

const app = express();

app.use(express.json());
app.use(cors());
app.use(i18nMiddleware);

const base = config.apiBasePath || '';

app.use(`${base}/auth`, authRouter);
app.use(`${base}/users`, userRouter);
app.use(`${base}/chat`, chatRouter);

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
