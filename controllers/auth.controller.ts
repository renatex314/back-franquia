import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import authService from "../services/auth.service";
import { decodeVerifyToken, generateToken } from "../utils";
import { StudentLoginData, StudentRegisterData } from "../types/auth";
import studentService from "../services/student.service";
import { Student } from "../types/student";
import { Professor } from "../types/professor";
import professorService from "../services/professor.service";

const loginStudent: RequestHandler = async (req, res) => {
  const studentLoginData: StudentLoginData = req.body;

  if (studentLoginData.alunoEmail && studentLoginData.alunoSenha) {
    const studentDataFromDB = await studentService.getStudentByFields({ alunoEmail: studentLoginData.alunoEmail })

    if (
      studentDataFromDB &&
      bcrypt.compareSync(
        studentLoginData.alunoSenha,
        studentDataFromDB.alunoSenhaHash
      )
    ) {
      const userToken = generateToken('aluno', studentLoginData.alunoEmail);

      return res.status(200).send(userToken);
    }
  } else {
    return res.status(401).send("Email e/ou senha não informado(s)");
  }

  return res.status(401).send("Credenciais inválidas");
};

const registerStudent: RequestHandler = async (req, res) => {
  const studentData: StudentRegisterData = req.body;

  if (!studentData?.alunoEmail || !studentData?.alunoSenha || !studentData?.alunoCpf) {
    return res.status(400).send("É necessário fornecer E-mail, senha e CPF");
  }

  try {
    await authService.registerStudent(studentData);

    res.status(200).send(generateToken('aluno', studentData.alunoEmail));
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
};

const getUserMeData: RequestHandler = async (req, res) => {
  const token = req.headers?.authorization?.split(" ")?.[1] || "";

  try {
    const tokenData = decodeVerifyToken(token);

    if (!tokenData.role) return res.status(400).send('role não encontrado');

    let userData: Partial<Professor | Student> = {};

    if (tokenData.role === 'aluno') {
      userData = await studentService.getStudentByFields({
        alunoEmail: tokenData.userEmail
      });
      delete userData.alunoSenhaHash;
    }

    if (tokenData.role === 'professor') {
      userData = await professorService.getProfessorByFields({
        professorEmail: tokenData.userEmail
      });
      delete userData.professorSenhaHash;
    }

    if (!userData) {
      return res.status(400).send('usuário não encontrado no sistema');
    } else {
      if (tokenData.role === 'aluno') {
        delete (userData as Partial<Student>).alunoSenhaHash;
      }

      if (tokenData.role === 'professor') {
        delete (userData as Partial<Professor>).professorSenhaHash;
      }
    }

    res.status(200).json({ role: tokenData.role, userData });
  } catch (err) {
    console.error(err);

    res.status(500).send((err as Error)?.message);
  }
};

export default {
  loginStudent,
  registerStudent,
  getUserMeData,
};
