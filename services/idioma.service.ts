import { getConnection } from "../controllers/db.controller";
import { Idioma } from "../types/idioma";
import { GetByFieldsProps } from "../types/utils";

const getIdiomaByFields = async (props: GetByFieldsProps<Idioma>) => {
  const connection = getConnection();

  try {
    const idioma: Idioma = await connection.select().from('idioma').where(props).first();

    return idioma;
  } catch (err) {
    console.error(err);

    throw new Error('Erro ao obter o idioma');
  }
}

export default {
  getIdiomaByFields
};