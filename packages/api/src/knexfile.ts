import glob from 'fast-glob';

const migrationDirs = glob.sync('**/migrations', { onlyDirectories: true });

export default {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    pool: { min: 1, max: 1 },
    migrations: {
        directory: migrationDirs,
    }
};