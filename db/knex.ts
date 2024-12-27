import { Knex } from 'knex';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const knexConfig: Knex.Config = {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST || 'dbaaa',
      port: parseInt(process.env.DATABASE_PORT as string) || 5432,
      user: process.env.DATABASE_USER || 'condo',
      password: process.env.DATABASE_PASSWORD || 'condo123.',
      database: process.env.DATABASE_NAME || 'condo',
    },
    migrations: {
        tableName: 'migrations',
        directory: './migrations',
    },
};

export default knexConfig;
