export interface Student {
  alunoId: number;
  alunoNome: string;
  alunoEndereco: string;
  alunoTelefone?: string;
  alunoCpf: string;
  alunoEmail: string;
  alunoSenhaHash: string;
  alunoDataNascimento: string;
  alunoFranquiaId: number
}

export type CreateStudentData = Omit<Student, 'alunoId'>;