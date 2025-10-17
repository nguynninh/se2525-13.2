import app from './app';
import config from './config/config';
import {connectDatabase} from './config/databaseClient';
import {connectRedis} from './config/redisClient';

app.listen(config.port, () => {
  connectDatabase();
  connectRedis();
  console.log(`Server running on port ${config.port}`);
});