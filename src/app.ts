import { time } from 'console';
import express from 'express';
import type { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get('/healthy', (req: Request, res: Response) => {
	res.status(200).json({
		code: 200,
        message: 'OK',
	});
});

app.use((req: Request, res: Response) => {
	res.status(404).json({
		code: 404,
        message: 'Not Found',
	});
});

export default app;