// Xử lý logic nghiệp vụ cho xác thực người dùng
// Bao gồm đăng ký, đăng nhập, đăng nhập xã hội, làm mới token, và lấy hồ sơ

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import crypto from 'crypto';
import { sendEmail } from '../../utils/email';
import { User } from '../../models/User.model';
import { Customer } from '../../models/Customer.model';
import { sequelize } from '../../models';
import { UnauthorizedError, ValidationError, InternalServerError } from '../../exception/AppError';
import { redisHelper } from '../../utils/redisHelper';
import {
    LoginDto,
    SocialLoginDto,
    LoginResponseDto,
    RefreshTokenResponseDto,
    RefreshTokenDto,
    ForgotPasswordDto,
    ForgotPasswordResponseDto,
    ResendPasswordDto,
    ResendPasswordResponseDto,
    VerifyResponseDto,
    ResetVerifyDto,
    ResetFinalizeDto,
    ResetFinalizeResponseDto,
} from './auth.dto';
import {
    RegisterStartDto,
    RegisterResendDto,
    RegisterFinalizeDto,
    RegisterStartResponse,
    RegisterResendResponse,
    RegisterFinalizeResponse,
} from '../user/user.dto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const GOOGLE_TOKENINFO_URL = 'https://oauth2.googleapis.com/tokeninfo';
const FB_ME_URL = 'https://graph.facebook.com/me';

const VERIFY_CODE_TTL = parseInt(process.env.VERIFY_CODE_TTL || '300', 10);
const RESET_CODE_TTL = parseInt(process.env.RESET_CODE_TTL || '300', 10);
const RESEND_THROTTLE_SECONDS = parseInt(process.env.RESEND_THROTTLE_SECONDS || '60', 10);
const MAX_OTP_ATTEMPTS = parseInt(process.env.MAX_OTP_ATTEMPTS || '5', 10);
const REGISTER_WINDOW_TTL = parseInt(process.env.REGISTER_WINDOW_TTL || '1200', 10);
const RESET_WINDOW_TTL = parseInt(process.env.REGISTER_WINDOW_TTL || '1200', 10);

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

type Provider = 'google' | 'facebook';

const normEmail = (e: string) => e.trim().toLowerCase();
const gen4 = () => crypto.randomInt(0, 10000).toString().padStart(4, '0'); // Tạo random otp 4 chữ số

// Redis key

// Key cho đăng ký và xác minh email
const kVerifyCode = (email: string) => `otp:verify:${normEmail(email)}`; // OTP theo email
const kVerifyCodeByCode = (code: string) => `otp:verify:bycode:${code}`; // map code -> email
const kVerifyAttempts = (email: string) => `otp:verify:attempts:${normEmail(email)}`; // số lần sai
const kVerifyThrottle = (email: string) => `otp:verify:throttle:${normEmail(email)}`; // chống spam resend
const kRegWindow = (email: string) => `verify_window:${normEmail(email)}`; // phiên đăng ký
const kRegPending = (email: string) => `reg:pending:${normEmail(email)}`; // pending user JSON
const kRefresh = (userId: string, jti: string) => `auth:refresh:${userId}:${jti}`; // lưu rf token theo jti

// Key cho đặt lại mật khẩu
const kResetCode = (email: string) => `otp:reset:${normEmail(email)}`;
const kResetCodeByCode = (code: string) => `otp:reset:bycode:${code}`;
const kResetAttempts = (email: string) => `otp:reset:attempts:${normEmail(email)}`;
const kResetThrottle = (email: string) => `otp:reset:throttle:${normEmail(email)}`;
const kResetPass = (code: string) => `otp:reset:pass:${code}`;
const kResetWindow = (email: string) => `reset_window:${normEmail(email)}`;

function splitName(full?: string): { first: string; last: string } {
    const n = (full || '').trim().split(/\s+/);
    if (n.length === 0) return { first: 'User', last: 'New' };
    if (n.length === 1) return { first: n[0], last: '' };
    return { first: n[0], last: n.slice(1).join(' ') };
}

async function hashRandomPassword() {
    const raw = crypto.randomBytes(24).toString('hex');
    const hash = await bcrypt.hash(raw, 10);
    return hash;
}

async function verifyGoogle(credential: string) {
    // credential là id_token (JWT) từ Google
    try {
        const { data } = await axios.get(GOOGLE_TOKENINFO_URL, { params: { id_token: credential } });
        if (!data?.email) throw new ValidationError('auth:social_email_missing');
        if (GOOGLE_CLIENT_ID && data.aud !== GOOGLE_CLIENT_ID) {
            throw new UnauthorizedError('auth:invalid_token');
        }
        if (String(data.email_verified) !== 'true') {
            throw new UnauthorizedError('auth:email_not_verified');
        }
        return {
            email: data.email as string,
            name: (data.name as string) || '',
            given_name: (data.given_name as string) || '',
            family_name: (data.family_name as string) || '',
        };
    } catch (e) {
        throw new UnauthorizedError('auth:invalid_token');
    }
}

async function verifyFacebook(credential: string) {
    // credential là user access token từ Facebook SDK
    try {
        const { data } = await axios.get(FB_ME_URL, {
            params: { fields: 'id,name,email', access_token: credential },
        });
        // data: { id, name, email? }
        if (!data?.email) throw new ValidationError('auth:social_email_missing');
        return {
            email: data.email as string,
            name: (data.name as string) || '',
        };
    } catch {
        throw new UnauthorizedError('auth:invalid_token');
    }
}

// So sánh chuỗi
function safeEqual(a: string, b: string) {
    const A = Buffer.from(String(a));
    const B = Buffer.from(String(b));
    return A.length === B.length && crypto.timingSafeEqual(A, B);
}

// Hàm gửi otp cho đăng ký
async function sendVerifyCodeEmail(email: string, code: string, ttlSec: number) {
    const minutes = Math.max(1, Math.floor(ttlSec / 60));
    const subject = 'Mã xác minh đăng ký';
    const text = `Mã OTP xác minh đăng ký của bạn là ${code}. Mã sẽ hết hạn sau ${minutes} phút.`;
    await sendEmail(email, subject, text);
}

// Gửi OTP quên mật khẩu
async function sendResetCodeEmail(email: string, code: string, ttlSec: number) {
    const minutes = Math.max(1, Math.floor(ttlSec / 60));
    const subject = 'Mã đặt lại mật khẩu';
    const text = `Mã OTP đặt lại mật khẩu của bạn là ${code}. Mã sẽ hết hạn sau ${minutes} phút.`;
    await sendEmail(email, subject, text);
}

// Tạo/rotate OTP cho đăng ký
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

// Tạo/rotate OTP cho quên mật khẩu
async function issueResetOtp(email: string, effectiveTtl: number) {
    const old = (await redisHelper.get(kResetCode(email), false)) as string | null;
    if (old) await redisHelper.del(kResetCodeByCode(old));

    const code = gen4();
    await redisHelper.set(kResetCode(email), code, effectiveTtl);
    await redisHelper.set(kResetAttempts(email), '0', effectiveTtl);
    await redisHelper.set(kResetThrottle(email), '1', RESEND_THROTTLE_SECONDS);
    await redisHelper.set(kResetCodeByCode(code), normEmail(email), effectiveTtl);
    return { code, hadOld: !!old };
}

// Chuyển exp dạng chuỗi
const toSeconds = (exp: string | number) =>
    typeof exp === 'number'
        ? exp
        : (() => {
              const m = /^(\d+)([smhd])$/i.exec(String(exp));
              if (!m) return 7 * 24 * 3600;
              const n = Number(m[1]);
              const u = m[2].toLowerCase();
              return u === 's' ? n : u === 'm' ? n * 60 : u === 'h' ? n * 3600 : n * 86400;
          })();

// Khởi tạo và lưu jti refresh token vào Redis
async function issueTokensAndPersistRefresh(user: { id: string; role: string }, refreshTtlOverrideSec?: number) {
    const refreshJti = crypto.randomUUID();

    const accessToken = jwt.sign({ sub: user.id, role: user.role }, ACCESS_SECRET, ACCESS_OPTS);

    let refreshToken: string;
    let refreshTtlSec: number;

    if (typeof refreshTtlOverrideSec === 'number') {
        // Nếu refresh token được cấp lại
        const nowSec = Math.floor(Date.now() / 1000);
        const expSec = nowSec + Math.max(0, refreshTtlOverrideSec);
        refreshToken = jwt.sign({ sub: user.id, jti: refreshJti, typ: 'refresh', exp: expSec }, REFRESH_SECRET, {});
        refreshTtlSec = Math.max(1, refreshTtlOverrideSec);
    } else {
        // Trường hợp LOGIN: phát refresh lần đầu
        refreshToken = jwt.sign({ sub: user.id, jti: refreshJti, typ: 'refresh' }, REFRESH_SECRET, REFRESH_OPTS);
        refreshTtlSec = toSeconds(JWT_REFRESH_EXPIRES_IN);
    }

    await redisHelper.set(kRefresh(user.id, refreshJti), { createdAt: Date.now() }, refreshTtlSec);

    return { accessToken, refreshToken };
}

// kiểm tra chung OTP
async function verifyResetCode(codeRaw: string): Promise<{ email: string; ttlLeftSec: number }> {
    const code = String(codeRaw || '').trim();
    if (!code) throw new ValidationError('auth:otp_required');

    const emailFromCode = (await redisHelper.get(kResetCodeByCode(code), false)) as string | null;
    if (!emailFromCode) throw new ValidationError('auth:otp_expired');

    const email = normEmail(emailFromCode);
    const currentOtp = (await redisHelper.get(kResetCode(email), false)) as string | null;
    if (!currentOtp) throw new ValidationError('auth:otp_expired');

    const attemptsStr = (await redisHelper.get(kResetAttempts(email), false)) as string | null;
    const attempts = attemptsStr ? Number(attemptsStr) : 0;

    if (!safeEqual(currentOtp, code)) {
        const remainTtl = Math.max(await redisHelper.ttl(kResetCode(email)), 1);
        const count = attempts + 1;
        await redisHelper.set(kResetAttempts(email), String(count), remainTtl);

        if (count >= MAX_OTP_ATTEMPTS) {
            await redisHelper.del(kResetCode(email));
            await redisHelper.del(kResetCodeByCode(code));
            throw new ValidationError('auth:otp_max_attempts_reached');
        }
        throw new ValidationError('auth:otp_incorrect');
    }

    const ttlLeftSec = Math.max(await redisHelper.ttl(kResetCode(email)), 1);
    return { email, ttlLeftSec };
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

        // Từ code → email
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
        const user = await sequelize.transaction(async (tx) => {
            const createdUser = await User.create(
                {
                    first_name: pending.first_name,
                    last_name: pending.last_name,
                    email,
                    password: pending.password_hash,
                    role: 'customer',
                    profile_url: null,
                },
                { transaction: tx },
            );

            // Khởi tạo customer với 100 loyalty points
            await Customer.create(
                {
                    user_id: createdUser.getDataValue('id'),
                    loyalty_points: 100,
                },
                { transaction: tx },
            );

            return createdUser;
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
            id: user.getDataValue('id'),
            first_name: user.getDataValue('first_name'),
            last_name: user.getDataValue('last_name'),
            email: user.getDataValue('email'),
            role: user.getDataValue('role'),
            phone: user.getDataValue('phone'),
            profile_url: user.getDataValue('profile_url'),
        };
    },
};

export const authLogin = {
    // Đăng nhập thường
    async login(dto: LoginDto): Promise<LoginResponseDto> {
        const email = normEmail(dto.email);
        const password = dto.password ?? '';

        // Tìm người dùng theo email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedError('auth:invalid_credentials');
        }

        // So sánh mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('auth:wrong_password');
        }

        const { accessToken, refreshToken } = await issueTokensAndPersistRefresh(user);

        return {
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                phone: user.phone ?? null,
                profile_url: user.profile_url,
            },
            accessToken,
            refreshToken,
        };
    },

    async loginSocial(dto: SocialLoginDto): Promise<LoginResponseDto> {
        const provider = dto.provider;
        const cred = dto.credential?.trim();
        if (!cred) throw new ValidationError('auth:credential_required');

        let email = '';
        let first = '';
        let last = '';

        if (provider === 'google') {
            const g = await verifyGoogle(cred);
            email = g.email;
            const { first: f, last: l } =
                g.given_name || g.family_name ? { first: g.given_name, last: g.family_name } : splitName(g.name);
            first = f || 'User';
            last = l || '';
        } else if (provider === 'facebook') {
            const fb = await verifyFacebook(cred);
            email = fb.email;
            const { first: f, last: l } = splitName(fb.name);
            first = f || 'User';
            last = l || '';
        } else {
            throw new ValidationError('auth:invalid_provider');
        }

        const norm = normEmail(email);
        let user = await User.findOne({ where: { email: norm } });

        if (!user) {
            // tạo user mới qua social
            const password_hash = await hashRandomPassword();
            user = await User.create({
                first_name: first,
                last_name: last,
                email: norm,
                password: password_hash,
                role: 'customer',
                profile_url: null,
            });
        }

        const { accessToken, refreshToken } = await issueTokensAndPersistRefresh(user);

        return {
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                phone: user.phone ?? null,
                profile_url: user.profile_url ?? null,
            },
            accessToken,
            refreshToken,
        };
    },
};

// Cấp access token mới từ refresh token
export const authRefreshToken = {
    async refreshToken(dto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
        let payload: any;

        // verify token
        try {
            payload = jwt.verify(dto.refreshToken, REFRESH_SECRET);
        } catch {
            throw new UnauthorizedError('auth:invalid_token');
        }

        if (payload.typ !== 'refresh') throw new UnauthorizedError('auth:invalid_token');

        const userId = String(payload.sub);
        const oldJti = String(payload.jti);
        const key = kRefresh(userId, oldJti);

        // Check jti trong Redis
        const session = await redisHelper.get(key);
        if (!session) {
            throw new UnauthorizedError('auth:refresh_revoked');
        }

        //  Tính thơi gian còn lại từ exp của token cũ
        const nowSec = Math.floor(Date.now() / 1000); // Thời gian hiện tại
        const expSec = typeof payload.exp === 'number' ? payload.exp : 0; // Hạn cố định
        const secondsLeft = expSec - nowSec;

        // Nếu đã hết hạn => dọn jti cũ và báo lỗi
        if (secondsLeft <= 0) {
            await redisHelper.del(key);
            throw new UnauthorizedError('auth:token_expired');
        }

        await redisHelper.del(key);

        const user = await User.findByPk(userId);
        if (!user) throw new UnauthorizedError('auth:invalid_token');

        // Phát token mới và lưu jti mới với ttl còn lại
        const { accessToken, refreshToken } = await issueTokensAndPersistRefresh(user, secondsLeft);

        return { sub: userId, accessToken, refreshToken };
    },
};

// Đăng xuất
export const authLogout = {
    // Dăng xuất một phiên
    async logoutOne(dto: RefreshTokenDto): Promise<{ ok: true }> {
        let payload: any;
        try {
            payload: jwt.verify(dto.refreshToken, REFRESH_SECRET);
            if (payload?.typ === 'refresh' && payload?.sub && payload?.jti) {
                await redisHelper.del(kRefresh(String(payload.sub), String(payload.jti)));
            }
        } catch {
            // Có thể trả lỗi nhưng vì mục đích logout nên im lặng
        }
        return { ok: true };
    },
};

// Quên mật khẩu
export const authForgotPassword = {
    // Yêu cầu đặt lại mật khẩu
    async request(dto: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> {
        const email = normEmail(dto.email);

        let windowRemain = await redisHelper.ttl(kResetWindow(email));
        if (windowRemain > 0) {
            return { sent: false, reason: 'auth:reset_in_progress', ttlRemaining: windowRemain };
        }

        await redisHelper.set(kResetWindow(email), '1', RESET_WINDOW_TTL);
        windowRemain = RESET_WINDOW_TTL;

        // Phát OTP
        const effectiveTtl = Math.max(1, Math.min(RESET_CODE_TTL, windowRemain));
        const { code, hadOld } = await issueResetOtp(email, effectiveTtl);

        await sendResetCodeEmail(email, code, effectiveTtl);

        return { sent: true, ttl: effectiveTtl, windowRemaining: windowRemain, rotated: hadOld };
    },

    // Resend OTP đặt lại mật khẩu
    async resend(dto: ResendPasswordDto): Promise<ResendPasswordResponseDto> {
        const email = normEmail(dto.email);

        let windowRemain = await redisHelper.ttl(kResetWindow(email));
        if (windowRemain <= 0) {
            return { sent: false, reason: 'auth:reset_not_initialized', ttlRemaining: 0 };
        }

        const throttle = await redisHelper.get(kResetThrottle(email), false);
        if (throttle) {
            const t = await redisHelper.ttl(kResetThrottle(email));
            return { sent: false, reason: 'auth:otp_reset_too_soon', retryAfter: Math.max(t, 0) };
        }

        const effectiveTtl = Math.max(1, Math.min(RESET_CODE_TTL, windowRemain));
        const { code, hadOld } = await issueResetOtp(email, effectiveTtl);
        await sendResetCodeEmail(email, code, effectiveTtl);

        return { sent: true, ttl: effectiveTtl, windowRemaining: windowRemain, rotated: hadOld };
    },

    // Xác thực OTP
    async verify(dto: ResetVerifyDto): Promise<VerifyResponseDto> {
        const { email, ttlLeftSec } = await verifyResetCode(dto.code);

        const passTtl = Math.min(ttlLeftSec, 600);
        await redisHelper.set(kResetPass(dto.code), '1', passTtl);

        return { ok: true, ttl: passTtl, email };
    },

    // đặt lại mật khẩu
    async finalize(dto: ResetFinalizeDto): Promise<ResetFinalizeResponseDto> {
        const code = String(dto.code || '').trim();
        if (!code) throw new ValidationError('auth:otp_required');

        const emailFromCode = await redisHelper.get<string>(kResetCodeByCode(code), false);
        if (!emailFromCode) throw new ValidationError('auth:otp_expired');
        const email = normEmail(emailFromCode);

        // Đổi mật khẩu nếu user tồn tại
        let userId: string | null = null;
        const user = await User.findOne({ where: { email } });
        if (user) {
            user.password = await bcrypt.hash(dto.new_password, 10);
            await user.save();
            userId = user.id;

            await redisHelper.delPattern(`auth:refresh:${user.id}:*`);
        }

        // Cleanup session reset
        await redisHelper.del(kResetPass(code));
        await redisHelper.del(kResetCode(email));
        await redisHelper.del(kResetCodeByCode(code));
        await redisHelper.del(kResetAttempts(email));
        await redisHelper.del(kResetThrottle(email));
        await redisHelper.del(kResetWindow(email));

        return { userId, email };
    },
};
