import app from './app';
import config from './config/config';
import {connectDatabase} from './config/databaseClient';
import {connectRedis} from './config/redisClient';
import {initRoles} from './seeds/initRoles';

app.listen(config.port, async () => {
  await connectDatabase();
  await connectRedis();
  await initRoles();
  
  console.log(`Server running on port ${config.port}`);
});