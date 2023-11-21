import knex, { Knex } from "knex";
const knexStringCase = require("knex-stringcase");

let connection: Knex | null = null;

const getConfiguredConnection = () => {
  return knex(
    knexStringCase({
      client: process?.env?.DB_CONNECTION_POSTGREE ? "pg" : "mysql2",
      connection: {
        connectionString: process?.env?.DB_CONNECTION_POSTGREE,
        host: process.env.DB_HOST_MYSQL || "0.0.0.0",
        port: process.env.DB_PORT_MYSQL || 3306,
        user: process.env.DB_USER_MYSQL || "aplicacao",
        password: process.env.DB_PASSWORD_MYSQL || "Senha123@",
        database: process.env.DB_DATABASE_MYSQL || "franquia",
        timezone: process.env.DB_TIMEZONE_MYSQL || "UTC",
        decimalNumbers: true,
      },
    } as Knex.Config<any>)
  );
};

export const getConnection = () => {
  if (connection === null) {
    connection = getConfiguredConnection();
  }

  return connection;
};
