'use strict';

import path from 'path';
import { Sequelize } from 'sequelize';
import User from './User.model';

const env = process.env.NODE_ENV || 'development';
const config = require(path.resolve(__dirname, '../../src/config/config.js'))[env];

let sequelize: Sequelize;
if (config.use_env_variable) {
    const key = String(config.use_env_variable);
    const uri = process.env[key];
    if (!uri) {
        throw new Error(`Environment variable "${key}" is not set, but config.use_env_variable is provided.`);
    }
    sequelize = new Sequelize(uri, config);
} else {
    sequelize = new Sequelize(String(config.database), String(config.username), config.password ?? undefined, config);
}

User.initModel(sequelize);

const models = { User };
User.associate?.(models);

export { sequelize, User };
