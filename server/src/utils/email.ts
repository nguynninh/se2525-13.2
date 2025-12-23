import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;
let currentKey = '';

function buildKey(host?: string, port?: number, secure?: boolean) {
    return `${host || ''}|${port || ''}|${secure ? 1 : 0}`;
}

export async function getTransporter(): Promise<nodemailer.Transporter> {
    const host = process.env.SMTP_HOST || undefined;
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';
    const user = process.env.SMTP_USER || undefined;
    const pass = process.env.SMTP_PASS || undefined;

    const key = buildKey(host, port, secure);

    if (transporter && key === currentKey) {
        return transporter;
    }

    if (host) {
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
            console.log('Cổng SMTP đã sẵn sàng', { host, port, secure });
        } catch (err) {
            console.error('SMTP xác thực thất bại:', err);
        }

        currentKey = key;
        return transporter;
    }
}

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        text,
        html,
    });

    if (!process.env.SMTP_HOST) {
        const url = nodemailer.getTestMessageUrl(info);
        if (url) {
            console.log('Ethereal preview URL:', url);
        }
    }
}
