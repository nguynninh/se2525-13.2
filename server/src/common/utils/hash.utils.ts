import * as bcrypt from 'bcrypt';

export class HashUtils {
    // Mã hóa mật khẩu
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    // Kiểm tra mật khẩu
    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
