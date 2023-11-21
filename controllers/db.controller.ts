import knex, { Knex } from "knex";
import pg from "pg";
const knexStringCase = require("knex-stringcase");

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) =>
  Number(value)
);

let connection: Knex | null = null;

const getConfiguredConnection = () => {
  return knex(
    knexStringCase({
      client: process?.env?.DB_CONNECTION_POSTGRE ? "pg" : "mysql2",
      connection: {
        connectionString: process?.env?.DB_CONNECTION_POSTGRE,
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
