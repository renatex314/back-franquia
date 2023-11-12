import { getConnection } from "../controllers/db.controller";
import { Professor } from "../types/professor";
import { GetByFieldsProps } from "../types/utils";

const getProfessorByFields = async (fields: GetByFieldsProps<Professor>) => {
  const connection = getConnection();

  try {
    const professorData: Professor = await connection.select().from('professor').where(fields).first();
    
    return professorData;
  } catch (err) {
    console.error(err);

    throw new Error('Não foi possível obter os dados do professor');
  }
}

export default {
  getProfessorByFields
};