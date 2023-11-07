import { getConnection } from "../controllers/db.controller";
import { Franquia, FranquiaList } from "../types/franquia";

const getFranquiaList = async () => {
  const connection = await getConnection();

  try {
    const franquias: FranquiaList = await connection.select().from('franquia');

    return franquias;
  } catch (err) {
    console.error(err);

    throw new Error('Erro ao obter a lista de franquias');
  }
}

const getFranquiaByFields = async (fields: { [key in keyof Franquia]?: string | number }) => {
  const connection = await getConnection();

  try {
    const franquia: Franquia = await connection.select().from('franquia').where(fields).first();

    return franquia;
  } catch (err) {
    console.error(err);

    throw new Error('Erro ao obter a franquia');
  }
}

export default {
  getFranquiaByFields,
  getFranquiaList
};