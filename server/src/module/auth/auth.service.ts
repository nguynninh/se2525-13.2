// Xử lý logic nghiệp vụ cho xác thực người dùng
// Bao gồm đăng ký, đăng nhập, đăng nhập xã hội, làm mới token, và lấy hồ sơ

import bcrypt from 'bcrypt';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import axios from 'axios';
import crypto from 'crypto';
import { sendEmail } from '../../utils/email';
import { User } from '../../models/User.model';
import { UnauthorizedError, ValidationError, NotFoundError, InternalServerError } from '../../exception/AppError';
import { redisHelper } from '../../utils/redisHelper';
import { LoginDto, SocialLoginDto, AuthResponseDto, RefreshTokenResponseDto, RefreshTokenDto } from './auth.dto';
import {
    RegisterStartDto,
    RegisterResendDto,
    RegisterFinalizeDto,
    RegisterStartResponse,
    RegisterResendResponse,
    RegisterFinalizeResponse,
} from '../user/user.dto';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/tokeninfo';
const FACEBOOK_TOKEN_URL = 'https://graph.facebook.com/me';

const VERIFY_CODE_TTL = parseInt(process.env.VERIFY_CODE_TTL || '300', 10);
const RESET_CODE_TTL = parseInt(process.env.RESET_CODE_TTL || '300', 10);
const RESEND_THROTTLE_SECONDS = parseInt(process.env.RESEND_THROTTLE_SECONDS || '60', 10);
const MAX_OTP_ATTEMPTS = parseInt(process.env.MAX_OTP_ATTEMPTS || '5', 10);
const REGISTER_WINDOW_TTL = parseInt(process.env.REGISTER_WINDOW_TTL || '1200', 10);

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const bcryptSaltRounds = 10;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    throw new InternalServerError('auth:server_misconfigured');
}

const ACCESS_SECRET: jwt.Secret = JWT_ACCESS_SECRET;
const REFRESH_SECRET: jwt.Secret = JWT_REFRESH_SECRET;
const ACCESS_OPTS: jwt.SignOptions = { expiresIn: JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'] };
const REFRESH_OPTS: jwt.SignOptions = { expiresIn: JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] };

const normEmail = (e: string) => e.trim().toLowerCase();
const gen4 = () => crypto.randomInt(0, 10000).toString().padStart(4, '0'); // Tạo random otp 4 chữ số

// Redis key
const kVerifyCode = (email: string) => `otp:verify:${normEmail(email)}`; // OTP theo email
const kVerifyCodeByCode = (code: string) => `otp:verify:bycode:${code}`; // map code -> email
const kVerifyAttempts = (email: string) => `otp:verify:attempts:${normEmail(email)}`; // số lần sai
const kVerifyThrottle = (email: string) => `otp:verify:throttle:${normEmail(email)}`; // chống spam resend
const kRegWindow = (email: string) => `verify_window:${normEmail(email)}`; // phiên đăng ký
const kRegPending = (email: string) => `reg:pending:${normEmail(email)}`; // pending user JSON

// So sánh chuỗi
function safeEqual(a: string, b: string) {
    // timing-safe so sánh chuỗi
    const A = Buffer.from(String(a));
    const B = Buffer.from(String(b));
    return A.length === B.length && crypto.timingSafeEqual(A, B);
}

// Hàm gửi otp cho đăng ký
async function sendVerifyCodeEmail(email: string, code: string, ttlSec: number) {
    const minutes = Math.max(1, Math.floor(ttlSec / 60));
    const subject = 'Mã xác minh đăng ký';
    const text = `Mã OTP của bạn là ${code}. Mã sẽ hết hạn sau ${minutes} phút.`;
    await sendEmail(email, subject, text);
}

// Tạo/rotate OTP và map code->email
async function issueOtp(email: string, effectiveTtl: number) {
    const old = (await redisHelper.get(kVerifyCode(email))) as string | null;
    if (old) await redisHelper.del(kVerifyCodeByCode(old));

    const code = gen4();
    await redisHelper.set(kVerifyCode(email), code, effectiveTtl);
    await redisHelper.set(kVerifyAttempts(email), '0', effectiveTtl);
    await redisHelper.set(kVerifyThrottle(email), '1', RESEND_THROTTLE_SECONDS);
    await redisHelper.set(kVerifyCodeByCode(code), normEmail(email), effectiveTtl);

    return { code, hadOld: !!old };
}

// Đăng ký (Start → Resend → Finalize)
export const authRegister = {
    // Khởi tạo phiên đăng ký và phát otp lần đầu
    async start(dto: RegisterStartDto): Promise<RegisterStartResponse> {
        const email = normEmail(dto.email);

        // Email đã tồn tại?
        const existed = await User.findOne({ where: { email } });
        if (existed) throw new ValidationError('auth:email_exists');

        // Cửa sổ đăng ký
        let windowRemain = await redisHelper.ttl(kRegWindow(email));
        if (windowRemain > 0) {
            return { sent: false, reason: 'auth:register_in_progress', ttlRemaining: windowRemain };
        }
        await redisHelper.set(kRegWindow(email), '1', REGISTER_WINDOW_TTL);
        windowRemain = REGISTER_WINDOW_TTL;

        // Lưu pending user
        const password_hash = await bcrypt.hash(dto.password, bcryptSaltRounds);
        const pending = { first_name: dto.first_name, last_name: dto.last_name, password_hash };
        await redisHelper.set(kRegPending(email), JSON.stringify(pending), windowRemain);

        // Phát OTP đầu tiên
        const effectiveTtl = Math.max(1, Math.min(VERIFY_CODE_TTL, windowRemain));
        const { code, hadOld } = await issueOtp(email, effectiveTtl);
        await sendVerifyCodeEmail(email, code, effectiveTtl);

        return { sent: true, ttl: effectiveTtl, windowRemaining: windowRemain, rotated: hadOld };
    },

    // Resend OTP
    async resend(dto: RegisterResendDto): Promise<RegisterResendResponse> {
        const email = normEmail(dto.email);

        // check email tồn tại
        const existed = await User.findOne({ where: { email } });
        if (existed) throw new ValidationError('auth:email_exists');

        // Kiểm tra dữ liệu đã được lưu tạm vào redis chưa
        const pendingStr = await redisHelper.get(kRegPending(email));
        if (!pendingStr) {
            // không mở phiên mới trong resend
            const ttl = await redisHelper.ttl(kRegWindow(email));
            return { sent: false, reason: 'auth:register_not_initialized', ttlRemaining: Math.max(ttl, 0) };
        }

        // Kiểm tra cửa sổ đăng ký
        let windowRemain = await redisHelper.ttl(kRegWindow(email));
        if (windowRemain <= 0) {
            return { sent: false, reason: 'auth:register_session_expired', ttlRemaining: 0 };
        }

        // Chống spam resend
        const throttle = await redisHelper.get(kVerifyThrottle(email));
        if (throttle) {
            const t = await redisHelper.ttl(kVerifyThrottle(email));
            return { sent: false, reason: 'auth:otp_reset_too_soon', retryAfter: Math.max(t, 0) };
        }

        const effectiveTtl = Math.max(1, Math.min(VERIFY_CODE_TTL, windowRemain));
        const { code, hadOld } = await issueOtp(email, effectiveTtl);
        await sendVerifyCodeEmail(email, code, effectiveTtl);

        return { sent: true, ttl: effectiveTtl, windowRemaining: windowRemain, rotated: hadOld };
    },

    // Kiểm tra otp, hoàn tất đăng ký và tạo user
    async finalize(dto: RegisterFinalizeDto): Promise<RegisterFinalizeResponse> {
        // Kiểm tra có otp chưa
        const code = String(dto.code || '').trim();
        if (!code) throw new ValidationError('auth:otp_required');

        // Từ code → email (nếu không có: code hết hạn/không hợp lệ)
        const emailFromCode = (await redisHelper.get(kVerifyCodeByCode(code))) as string | null;
        if (!emailFromCode) throw new ValidationError('auth:otp_expired');

        const email = normEmail(emailFromCode);

        const existed = await User.findOne({ where: { email } });
        if (existed) throw new ValidationError('auth:email_exists');

        // OTP hiện hành theo email
        const currentOtp = (await redisHelper.get(kVerifyCode(email))) as string | null;
        if (!currentOtp) throw new ValidationError('auth:otp_expired');

        // Lần thử
        const attemptsStr = (await redisHelper.get(kVerifyAttempts(email))) as string | null;
        const attempts = attemptsStr ? Number(attemptsStr) : 0;

        // So sánh OTP
        if (!safeEqual(currentOtp, code)) {
            const count = attempts + 1;
            const remainTtl = Math.max(await redisHelper.ttl(kVerifyCode(email)), 1);
            await redisHelper.set(kVerifyAttempts(email), String(count), remainTtl);

            if (count >= MAX_OTP_ATTEMPTS) {
                await redisHelper.del(kVerifyCode(email));
                await redisHelper.del(kVerifyCodeByCode(code));
                throw new ValidationError('auth:otp_too_many_attempts');
            }
            throw new ValidationError('auth:otp_incorrect');
        }

        // Lấy pending user
        const pending = await redisHelper.getJSON<{ first_name: string; last_name: string; password_hash: string }>(
            kRegPending(email),
        );
        if (!pending) throw new ValidationError('auth:register_session_expired');

        // Tạo user
        const user = await User.create({
            first_name: pending.first_name,
            last_name: pending.last_name,
            email,
            password: pending.password_hash,
            role: 'customer',
            profile_url: null,
        });

        console.log(user);

        // Cleanup tất cả keys Redis liên quan
        await redisHelper.del(kVerifyCode(email));
        await redisHelper.del(kVerifyCodeByCode(code));
        await redisHelper.del(kVerifyAttempts(email));
        await redisHelper.del(kVerifyThrottle(email));
        await redisHelper.del(kRegWindow(email));
        await redisHelper.del(kRegPending(email));

        return {
            id: user.dataValues.id,
            first_name: user.dataValues.first_name,
            last_name: user.dataValues.last_name,
            email: user.dataValues.email,
            role: user.dataValues.role ?? null,
            profile_url: user.dataValues.profile_url ?? null,
        };
    },
};

// const authService = {
//     // Hàm bất đồng bộ nhận vào dữ liệu kiểu LoginDto và trả về kiểu AuthResponseDto
//     async login(data: LoginDto): Promise<AuthResponseDto> {
//         const { email, password } = data;

//         // Tìm người dùng theo email
//         const user = await User.findOne({ where: { email } });
//         if (!user) {
//             throw new UnauthorizedError('auth:invalid_credentials');
//         }

//         // So sánh mật khẩu
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             throw new UnauthorizedError('auth:wrong_password');
//         }

//         // Tạo access token và refresh token
//         const accessToken = jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, ACCESS_OPTS);
//         const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, REFRESH_OPTS);

//         return {
//             user: {
//                 id: user.id,
//                 first_name: user.first_name,
//                 last_name: user.last_name,
//                 email: user.email,
//                 role: user.role,
//                 profile_url: user.profile_url,
//             },
//             accessToken,
//             refreshToken,
//         };
//     },

//     async loginSocial(data: SocialLoginDto): Promise<AuthResponseDto> {
//         const { provider, credential } = data;
//         let userInfo: { email: string; first_name: string; last_name: string; picture?: string };

//         // Xử lý đăng nhập Google
//         if (provider === 'google') {
//             try {
//                 const response = await axios.get(`${GOOGLE_TOKEN_URL}?id_token=${credential}`);
//                 const { email, given_name, family_name, picture } = response.data;
//                 if (!email) {
//                     throw new ValidationError('auth:invalid_credential');
//                 }
//                 userInfo = { email, first_name: given_name, last_name: family_name, picture };
//             } catch (error) {
//                 throw new ValidationError('auth:invalid_credential');
//             }
//         }
//         // Xử lý đăng nhập Facebook
//         else if (provider === 'facebook') {
//             try {
//                 const response = await axios.get(
//                     `${FACEBOOK_TOKEN_URL}?access_token=${credential}&fields=email,first_name,last_name,picture`,
//                 );
//                 const { email, first_name, last_name, picture } = response.data;
//                 if (!email) {
//                     throw new ValidationError('auth:invalid_credential');
//                 }
//                 userInfo = { email, first_name, last_name, picture: picture?.data?.url };
//             } catch (error) {
//                 throw new ValidationError('auth:invalid_credential');
//             }
//         } else {
//             throw new ValidationError('auth:invalid_provider');
//         }

//         // Tìm hoặc tạo người dùng
//         let user = await User.findOne({ where: { email: userInfo.email } });
//         if (!user) {
//             user = await User.create({
//                 first_name: userInfo.first_name,
//                 last_name: userInfo.last_name,
//                 email: userInfo.email,
//                 password: '',
//                 role: 'customer',
//                 profile_url: userInfo.picture,
//             });
//         }

//         // Tạo token
//         const accessToken = jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, ACCESS_OPTS);
//         const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, REFRESH_OPTS);

//         return {
//             user: {
//                 id: user.id,
//                 first_name: user.first_name,
//                 last_name: user.last_name,
//                 email: user.email,
//                 role: user.role,
//                 profile_url: user.profile_url,
//             },
//             accessToken,
//             refreshToken,
//         };
//     },

//     async refreshToken(dto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
//         try {
//             const refreshToken = dto.refreshToken;

//             //Verify refresh token
//             const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string };

//             // Đối chiếu với Redis
//             const storedToken = await redisHelper.get(`refresh_token:${decoded.id}`);
//             if (storedToken !== refreshToken) {
//                 throw new UnauthorizedError('auth:invalid_refresh_token');
//             }

//             const user = await User.findByPk(decoded.id);
//             if (!user) {
//                 throw new UnauthorizedError('auth:user_not_found');
//             }

//             // Tạo mới token
//             const newAccessToken = jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, ACCESS_OPTS);
//             return { id: user.id, accessToken: newAccessToken };
//         } catch (err) {
//             if (err instanceof TokenExpiredError) {
//                 // refresh token hết hạn -> bắt login lại
//                 throw new UnauthorizedError('auth:token_expired');
//             }
//             throw new UnauthorizedError('auth:invalid_token');
//         }
//     },

//     async getProfile(userId: string) {
//         const user = await User.findByPk(userId, {
//             attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'profile_url'],
//         });
//         if (!user) {
//             throw new NotFoundError('auth:user_not_found');
//         }
//         return user;
//     },
// };

// export default authService;
