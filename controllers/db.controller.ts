import knex, { Knex } from 'knex';
const knexStringCase = require('knex-stringcase');

let connection: Knex | null = null;

const getConfiguredConnection = () => {
  return knex(knexStringCase({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || '0.0.0.0',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'aplicacao',
      password: process.env.DB_PASSWORD || 'Senha123@',
      database: process.env.DB_DATABASE || 'franquia',
      timezone: process.env.DB_TIMEZONE || 'UTC'
    },
  }))
}

export const getConnection = () => {
  if (connection === null) {
    connection = getConfiguredConnection();
  }

  return connection;
};