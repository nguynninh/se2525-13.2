export const appConfig = {
    port: parseInt(process.env.PORT || '3000', 10),
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    env: process.env.NODE_ENV || 'development',
};
