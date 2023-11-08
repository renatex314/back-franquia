import { getConnection } from "../controllers/db.controller";

const getFranqueadoList = async () => {
  const connection = getConnection();

  try {
    const franquias = await connection.select().from('franqueado');

    return franquias;
  } catch (err) {
    console.error(err);

    throw new Error((err as Error)?.message);
  }
}

export default {
  getFranqueadoList
};