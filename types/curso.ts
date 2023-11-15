export interface Curso {
  cursoId: number;
  cursoNome: string;
  cursoNivel: 'iniciante' | 'intermediario' | 'avançado';
  cursoIdiomaId: number;
}