import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  apiBasePath: string;
}

const nodeEnv = process.env.NODE_ENV || 'development';
const rawApiBase = process.env.API_BASE_PATH;
const apiBasePath = rawApiBase === undefined ? (nodeEnv === 'development' ? '/api/v1' : '/v1') : rawApiBase;

const config: Config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv,
  apiBasePath,
};

export default config;