import { Knex } from 'knex';
console.log("DB",process.env.DATABASE_HOST);
const knexConfig: Knex.Config = {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST || 'dbaa',
      port: parseInt(process.env.DATABASE_PORT as string) || 5432,
      user: process.env.DATABASE_USER || 'condooo',
      password: process.env.DATABASE_PASSWORD || 'condo1232.',
      database: process.env.DATABASE_NAME || 'cond33o',
    },
    migrations: {
        tableName: 'migrations',
        directory: './migrations',
    },
};

export default knexConfig;
