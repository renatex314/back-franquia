import { getConnection } from "../controllers/db.controller";
import { CursoFranquiaProfessor } from "../types/cursofranquiaprofessor";
import { GetByFieldsProps } from "../types/utils";

const getCursofranquiaProfessorListByFields = async (
  props: GetByFieldsProps<CursoFranquiaProfessor>
) => {
  const connection = getConnection();

  try {
    const cursofranquiaProfessor: Array<CursoFranquiaProfessor> =
      await connection.select().from("professor_cursofranquia").where(props);

    return cursofranquiaProfessor;
  } catch (err) {
    console.error(err);

    throw new Error("Erro ao obter os dados do professor ao curso da franquia");
  }
};

export default {
  getCursofranquiaProfessorListByFields,
};
