export interface Matricula {
  matriculaId: number;
  matriculaStatus: 'ativa' | 'inativa';
  matriculaData: string;
  matriculaAlunoId: number;
  matriculaCursoFranquiaId: number;
}