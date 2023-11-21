import { Aula, AulaResponseItem } from "./aula";
import { Avaliacao } from "./avaliacao";
import { Curso } from "./curso";
import { FranquiaCurso } from "./franquiacurso";
import { Idioma } from "./idioma";
import { Matricula } from "./matricula";
import { Pagamento, PagamentoResponse } from "./pagamento";
import { Professor } from "./professor";

export interface Student {
  alunoId: number;
  alunoNome: string;
  alunoEndereco: string;
  alunoTelefone?: string;
  alunoCpf: string;
  alunoEmail: string;
  alunoSenhaHash: string;
  alunoDataNascimento: string;
  alunoFranquiaId: number;
}

export type CreateStudentData = Omit<Student, "alunoId">;

export type GetAlunoRegisteredCoursesStatusResponse = Array<{
  curso: Curso;
  idioma: Idioma;
  franquiaCurso: FranquiaCurso;
  matriculaId: number;
  media: number;
}>;

export type GetAlunoCoursesDataListResponse = Array<{
  matricula: Matricula;
  curso: Curso;
  professores: Array<Professor>;
}>;

export type getAlunoSelectedCourseDataResponse = {
  matricula: Matricula;
  curso: Curso;
  idioma: Idioma;
  aulas: Array<AulaResponseItem>;
  avaliacoes: Array<Avaliacao>;
  professores: Array<Professor>;
  pagamentos: Array<PagamentoResponse>;
};

export type GetAlunoPaymentsListResponse = Array<
  PagamentoResponse & {
    matricula: Matricula;
    curso: Curso;
  }
>;
