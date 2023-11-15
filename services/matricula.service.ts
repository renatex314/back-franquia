import { getConnection } from "../controllers/db.controller"
import { Matricula } from "../types/matricula"
import { GetByFieldsProps } from "../types/utils"

const getMatriculasByFields = async (props: GetByFieldsProps<Matricula>) => {
  const connection = getConnection();

  try {
    const matriculas: Array<Matricula> = await connection.select().from('matricula').where(props);
    
    return matriculas;
  } catch (err) {
    console.error(err);

    throw new Error('Erro ao obter matrícula');
  }
}

export default {
  getMatriculasByFields
}