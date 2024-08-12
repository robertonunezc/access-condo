import { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';
const dotEnv = dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});
const knexConfig: Knex.Config = {
    client: 'mysql',
    connection: {
      host: dotEnv.parsed?.DATABASE_HOST || 'localhost',
      port: parseInt(dotEnv.parsed?.DATABASE_PORT as string) || 3306,
      user: dotEnv.parsed?.DATABASE_USER || 'pedro',
      password: dotEnv.parsed?.DATABASE_PASSWORD || 'password',
      database: dotEnv.parsed?.DATABASE_NAME || 'mydb',
    },
    migrations: {
        tableName: 'migrations',
        directory: './migrations',
    },
};

export default knexConfig;
