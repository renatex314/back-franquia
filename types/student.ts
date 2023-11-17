import { Curso } from "./curso";
import { FranquiaCurso } from "./franquiacurso";
import { Idioma } from "./idioma";
import { Matricula } from "./matricula";
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
