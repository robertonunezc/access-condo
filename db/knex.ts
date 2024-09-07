import { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';
const dotEnv = dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});
const knexConfig: Knex.Config = {
    client: 'mysql',
    connection: {
      host: dotEnv.parsed?.DATABASE_HOST || 'db',
      port: parseInt(dotEnv.parsed?.DATABASE_PORT as string) || 3306,
      user: dotEnv.parsed?.DATABASE_USER || 'condo',
      password: dotEnv.parsed?.DATABASE_PASSWORD || 'condo123.',
      database: dotEnv.parsed?.DATABASE_NAME || 'condo',
    },
    migrations: {
        tableName: 'migrations',
        directory: './migrations',
    },
};

export default knexConfig;
