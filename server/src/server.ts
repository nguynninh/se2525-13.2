import app from './app';
import http from 'http';
import debug from 'debug';
import { sequelize } from './models';
import { connectRedis } from './config/redis';
require('dotenv').config();

const debugLog = debug('SE2025-13.2-SEVER:server');

const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

const server = http.createServer(app);

function normalizePort(val: string): number | string | false {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ DB connected!');

        await connectRedis();

        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
    } catch (e) {
        console.error('❌ DB connection failed:', (e as Error).message);
        process.exit(1);
    }
})();

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + (addr?.port || port);
    debugLog(`Listening on ${bind}`);
    console.log(`Server đang chạy tại ${bind}`);
}
