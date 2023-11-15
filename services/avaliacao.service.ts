import { getConnection } from "../controllers/db.controller";
import { Avaliacao } from "../types/avaliacao";
import { GetByFieldsProps } from "../types/utils";

const getAvaliacoesByFields = async (props: GetByFieldsProps<Avaliacao>) => {
  const connection = getConnection();

  try {
    const avaliacoes: Array<Avaliacao> = await connection
      .select()
      .from("avaliacao")
      .where(props);

    return avaliacoes;
  } catch (err) {
    console.error(err);

    throw new Error("Erro ao obter as avaliações");
  }
};

export default {
  getAvaliacoesByFields,
};
