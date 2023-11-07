import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import authService from "../services/auth.service";
import { decodeVerifyToken, generateToken } from "../utils";
import { StudentLoginData, StudentRegisterData } from "../types/auth";
import studentService from "../services/student.service";
import { Student } from "../types/student";

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
      const userToken = generateToken(studentLoginData.alunoEmail);

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

    res.status(200).send(generateToken(studentData.alunoEmail));
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
};

const getStudentMeData: RequestHandler = async (req, res) => {
  const token = req.headers?.authorization?.split(" ")?.[1] || "";

  try {
    const tokenData = decodeVerifyToken(token);

    const studentData: Student = await studentService.getStudentByFields({
      alunoEmail: tokenData.alunoEmail
    });

    if (!studentData)
      return res.status(401).send("Aluno não encontrado no sistema");

    const studentReturnData = { ...studentData } as Partial<Student>;

    delete studentReturnData.alunoId;
    delete studentReturnData.alunoSenhaHash;

    res.status(200).send(studentData);
  } catch (err) {
    console.error(err);

    res.status(500).send((err as Error)?.message);
  }
};

export default {
  loginStudent,
  registerStudent,
  getStudentMeData,
};
