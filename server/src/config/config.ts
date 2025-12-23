import dotenv from 'dotenv';
dotenv.config();

type DbEnv = {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
    dialect: 'postgres';
    logging: false | ((sql: string) => void);
    dialectOptions?: Record<string, any>;
};

const isSSL = String(process.env.DB_SSL || '').toLowerCase() === 'true';

const base: DbEnv = {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'app',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    ...(isSSL ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } } : {}),
};

module.exports = {
    development: { ...base },
    test: {
        ...base,
        database: `${base.database}_test`,
        logging: false,
    },
    production: {
        ...base,
        logging: false,
    },
};
