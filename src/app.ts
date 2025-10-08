import express from 'express';
import i18nMiddleware from "./i18n";
import type { Request, Response } from 'express';
import config from './config/config';

const app = express();

app.use(express.json());
app.use(i18nMiddleware);

const base = config.apiBasePath || '';

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

export default app;