import { getConnection } from "../controllers/db.controller";
import { FranquiaCurso } from "../types/franquiacurso";
import { GetByFieldsProps } from "../types/utils";

const getFranquiaCursoByFields = async (
  props: GetByFieldsProps<FranquiaCurso>
) => {
  const connection = getConnection();

  try {
    const franquiaCurso: FranquiaCurso = await connection
      .select()
      .from("franquia_curso")
      .where(props)
      .first();

    return franquiaCurso;
  } catch (err) {
    console.error(err);

    throw new Error("Erro ao obter curso da franquia");
  }
};

export default {
  getFranquiaCursoByFields,
};
