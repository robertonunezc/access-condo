import { Knex } from 'knex';

const knexConfig: Knex.Config = {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST || 'db',
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
