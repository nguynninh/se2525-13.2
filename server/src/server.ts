import app from './app';
import config from './config/config';
import {connectDatabase} from './config/databaseClient';

app.listen(config.port, () => {
  connectDatabase();
  console.log(`Server running on port ${config.port}`);
});