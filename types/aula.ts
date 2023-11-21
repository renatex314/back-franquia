import { Professor } from "./professor";

export interface Aula {
  aulaId: number;
  aulaData: Date;
  aulaLocal: string;
  aulaStatus: "programada" | "realizada" | "cancelada";
  aulaFranquiaCursoId: number;
  aulaProfessorId: number;
}

export type AulaResponseItem = Omit<Aula, "aulaProfessorId"> & {
  professor: Professor;
};
