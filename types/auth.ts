export interface StudentLoginData {
  alunoEmail: string;
  alunoSenha: string;
}

export interface StudentRegisterData {
  alunoNome: string;
  alunoEndereco: string;
  alunoTelefone?: string;
  alunoCpf: string;
  alunoEmail: string;
  alunoSenha: string;
  alunoDataNascimento: string;
  alunoFranquiaId: number;
}