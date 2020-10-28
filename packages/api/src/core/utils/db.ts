import knex from 'knex';
import config from '../../knexfile';

export const DB = knex(config);
