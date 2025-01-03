import { Knex } from 'knex';
import {config} from '../src/infra/config';
console.log("DB",config.dbHost);
const knexConfig: Knex.Config = {
    client: 'pg',
    connection: {
      host: config.dbHost,
      port: config.dbPort,
      user: config.dbUser,
      password:config.dbPassword,
      database:config.dbName,
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
        tableName: 'migrations',
        directory: './migrations',
    },
};

export default knexConfig;
