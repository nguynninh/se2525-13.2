// import { Request, Response } from "express";
// import dotenv from 'dotenv';
// import { asyncHandler } from '../utils/asyncHandler';
// import { successResponse } from '../utils/responseFormatter';
// import { NotFoundError, UnauthorizedError, ValidationError } from '../exception/AppError';
// import { GoogleGenerativeAI } from "@google/generative-ai";

// dotenv.config();

// const API_KEY = process.env.AI_API_KEY || '';
// const MODEL = process.env.AI_MODEL || 'gemini-2.5-flash';

// const internalChatAI = asyncHandler(async (req: Request, res: Response) => {
//     const { message } = req.body;

//     if (!API_KEY) {
//         throw new ValidationError(req.t('chat:ai_api_key_not_configured'));
//     }

//     try {
//         const genAI = new GoogleGenerativeAI(API_KEY);
//         const model = genAI.getGenerativeModel({ model: MODEL });

//         const acceptLanguage = req.headers['accept-language'];
//         let language = 'vi';

//         if (acceptLanguage) {
//             const lang = acceptLanguage.toString().toLowerCase();
//             if (lang.includes("en")) language = "en";
//             else if (lang.includes("jp")) language = "jp";
//             else if (lang.includes("cn")) language = "cn";
//         }

//         const customPrompt = `
//             Bạn là một trợ lý AI trẻ trung, nói chuyện kiểu thân mật, hơi nhây, có khi pha tí hài hước.
//             Dù vui tính nhưng vẫn lịch sự và giúp đỡ người dùng chính xác.
//             Khi trả lời, cố gắng thêm chút biểu cảm, cảm thán hoặc câu đùa nhẹ nhàng.
//             Luôn trả lời bằng ngôn ngữ: ${language}.

//             Người dùng nói: "${message}"`;

//         const result = await model.generateContent(customPrompt);
//         const text = result.response.text();

//         return successResponse(res, {
//             code: 200,
//             message: req.t('chat:response_generated_successfully'),
//             data: { reply: text },
//         });
//     } catch (error: any) {
//         throw new NotFoundError(req.t('chat:ai_service_unavailable'));
//     }
// });

// export {
//     internalChatAI
// };
