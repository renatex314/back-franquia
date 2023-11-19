export interface Pagamento {
  pagamentoId: number;
  pagamentoValor: number;
  pagamentoData: Date;
  pagamentoMetodo: "crédito" | "débito" | "boleto";
  pagamentoStatus: "pendente" | "pago";
  pagamentoMatriculaId: number;
}

export type PagamentoResponse = Omit<Pagamento, "pagamentoStatus"> & {
  pagamentoStatus: "pendente" | "pago" | "atrasado";
};
