import app from './app';
import config from './config/config';
import {connectDatabase} from './config/databaseClient';
import {connectRedis} from './config/redisClient';
import {initRoles} from './seeds/initRoles';
import createCategories from './seeds/createCategories';
import createProducts from './seeds/createProducts';

app.listen(config.port, async () => {
  await connectDatabase();
  await connectRedis();
  await initRoles();
  await createCategories();
  await createProducts();
  
  console.log(`Server running on port ${config.port}`);
});
