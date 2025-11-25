import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;
let currentKey = '';

function buildKey(host?: string, port?: number, secure?: boolean) {
    return `${host || ''}|${port || ''}|${secure ? 1 : 0}`;
}

export async function getTransporter(): Promise<nodemailer.Transporter> {
    const host = process.env.SMTP_HOST || undefined;
    const port = Number(process.env.SMTP_PORT || 1025); // MailHog: 1025
    const secure = String(process.env.SMTP_SECURE).toLowerCase() === 'true'; // MailHog: false
    const user = process.env.SMTP_USER || undefined;
    const pass = process.env.SMTP_PASS || undefined;

    const key = buildKey(host, port, secure);

    // Nếu đã có transporter nhưng cấu hình thay đổi → tạo lại
    if (transporter && key === currentKey) {
        return transporter;
    }

    if (host) {
        // SMTP thật (MailHog cũng là SMTP)
        transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: user && pass ? { user, pass } : undefined,
            tls: { rejectUnauthorized: false },
            logger: true,
            debug: true,
        });

        try {
            await transporter.verify();
            console.log('✅ SMTP transporter ready', { host, port, secure });
        } catch (err) {
            console.error('❌ SMTP verify failed:', err);
        }

        currentKey = key;
        return transporter;
    }

    // Fallback: Ethereal (chỉ dùng khi KHÔNG có SMTP_HOST)
    const acc = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
        host: acc.smtp.host,
        port: acc.smtp.port,
        secure: acc.smtp.secure,
        auth: { user: acc.user, pass: acc.pass },
        logger: true,
        debug: true,
    });
    currentKey = 'ethereal';
    return transporter;
}

/**
 * Gửi email (text/html).
 *
 * @param to      - Người nhận (email)
 * @param subject - Tiêu đề email
 * @param text    - Nội dung text thuần.
 *
 * - Nếu đang dùng Ethereal (tức KHÔNG có SMTP_HOST), in ra preview URL để mở mail trên web
 * - Khi dùng MailHog, không có preview URL từ Nodemailer; xem mail tại http://localhost:8025
 */

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
    const transporter = await getTransporter();

    // Gửi email. "from" lấy từ MAIL_FROM (.env) hoặc default ở trên
    const info = await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        text,
    });

    if (!process.env.SMTP_HOST) {
        const url = nodemailer.getTestMessageUrl(info);
        if (url) {
            console.log('🔗 Ethereal preview URL:', url);
        }
    }
}
