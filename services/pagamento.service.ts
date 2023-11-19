import { getConnection } from "../controllers/db.controller";
import { Pagamento, PagamentoResponse } from "../types/pagamento";
import { GetByFieldsProps } from "../types/utils";

const getPagamentosByFields = async (
  props: GetByFieldsProps<Pagamento>
): Promise<Array<PagamentoResponse>> => {
  const connection = getConnection();

  try {
    const pagamentos: Array<Pagamento> = await connection
      .select()
      .from("pagamento")
      .where(props);

    const now = new Date(new Date().toISOString().split("T")[0]);

    return pagamentos.map((pagamento) => ({
      ...pagamento,
      pagamentoStatus:
        pagamento.pagamentoStatus === "pendente" &&
        new Date(pagamento.pagamentoData.toISOString().split("T")[0]) < now
          ? "atrasado"
          : pagamento.pagamentoStatus,
    }));
  } catch (err) {
    console.error(err);

    throw new Error("Erro ao obter os pagamentos");
  }
};

export default {
  getPagamentosByFields,
};
