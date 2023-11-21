import { getConnection } from "../controllers/db.controller";
import { Aula } from "../types/aula";
import { GetByFieldsProps } from "../types/utils";

const getAulasByFields = async (props: GetByFieldsProps<Aula>) => {
  const connection = getConnection();

  try {
    const aulas: Array<Aula> = await connection
      .select()
      .from("aula")
      .where(props);

    return aulas;
  } catch (err) {
    console.error(err);

    throw new Error("Erro ao obter as aulas");
  }
};

export default {
  getAulasByFields,
};
