import bcrypt from 'bcrypt';
import { StudentRegisterData } from "../types/auth";
import studentService from "./student.service";

const registerStudent = async (registerStudentData: StudentRegisterData) => {
  try {
    const studentByEmail = await studentService.getStudentByFields({ alunoEmail: registerStudentData.alunoEmail });
    const studentByCpf = await studentService.getStudentByFields({ alunoCpf: registerStudentData.alunoCpf });

    if (studentByEmail || studentByCpf) {
      throw new Error('Aluno já está cadastrado');
    }

    const studentHashPassword = bcrypt.hashSync(registerStudentData.alunoSenha, 10);
    
    await studentService.createStudent({
      alunoNome: registerStudentData.alunoNome,
      alunoEmail: registerStudentData.alunoEmail,
      alunoCpf: registerStudentData.alunoCpf,
      alunoEndereco: registerStudentData.alunoEndereco,
      alunoDataNascimento: registerStudentData.alunoDataNascimento,
      alunoTelefone: registerStudentData.alunoTelefone,
      alunoSenhaHash: studentHashPassword,
      alunoFranquiaId: registerStudentData.alunoFranquiaId
    });
  } catch (err) {
    console.error(err);

    throw new Error((err as Error).message);
  }
}

export default {
  registerStudent
};
