import { getConnection } from "../controllers/db.controller";
import { Curso } from "../types/curso";
import { GetByFieldsProps } from "../types/utils";

const getCursoByFields = async (props: GetByFieldsProps<Curso>) => {
  const connection = getConnection();

  try {
    const curso: Curso = await connection.select().from('curso').where(props).first();
  
    return curso;
  } catch (err) {
    console.error(err);

    throw new Error('Erro ao obter o curso');
  }
}

export default {
  getCursoByFields
};