import { getConnection } from "../controllers/db.controller";
import { CreateStudentData, Student } from "../types/student";

const getStudentByFields = async (fields: {[key in keyof Student]?: number | string}) => {
  const connection = getConnection();

  try {
    const student: Student = await connection.select().from('aluno').where(fields).first();

    return student;
  } catch (err) {
    console.error(err);

    throw new Error('Ocorreu um erro ao obter os dados do aluno');
  }
}

const createStudent = async (studentData: CreateStudentData) => {
  const connection = getConnection();
  const trx = await connection.transaction();

  try {
    await connection.insert(studentData).into('aluno').transacting(trx);

    trx.commit();
  } catch (err) {
    console.error(err);
    trx.rollback();
    
    throw new Error('Ocorru um erro ao cadastrar o aluno');
  }
}

export default {
  getStudentByFields,
  createStudent
};