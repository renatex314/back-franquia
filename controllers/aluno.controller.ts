import { RequestHandler } from "express";
import aulaService from "../services/aula.service";
import avaliacaoService from "../services/avaliacao.service";
import cursoService from "../services/curso.service";
import cursofranquiaprofessorService from "../services/cursofranquiaprofessor.service";
import franquiacursoService from "../services/franquiacurso.service";
import idiomaService from "../services/idioma.service";
import matriculaService from "../services/matricula.service";
import pagamentoService from "../services/pagamento.service";
import professorService from "../services/professor.service";
import studentService from "../services/student.service";
import { AulaResponseItem } from "../types/aula";
import { Professor } from "../types/professor";
import {
  GetAlunoCoursesDataListResponse,
  GetAlunoPaymentsListResponse,
  GetAlunoRegisteredCoursesStatusResponse,
  getAlunoSelectedCourseDataResponse,
} from "../types/student";
import { getTokenDataByAuthString } from "../utils";
import { PagamentoResponse } from "../types/pagamento";

const getAlunoRegisteredCoursesStatus: RequestHandler = async (req, res) => {
  const tokenData = getTokenDataByAuthString(
    req.headers["authorization"] || ""
  );

  const alunoId = (
    await studentService.getStudentByFields({
      alunoEmail: tokenData.userEmail,
    })
  )?.alunoId;

  if (!alunoId) {
    return res.status(400).send("O aluno não pôde ser encontrado");
  }

  const month = Number(req.query.month);
  const year = Number(req.query.year);

  if (!alunoId || !month || !year) {
    return res.status(400).send("Id do aluno, mês e ano são obrigatórios");
  }

  const afterDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const beforeDate = new Date(Date.UTC(year, month - 1, 31, 23, 59, 59, 999));

  try {
    const matriculasAtivas = (
      await matriculaService.getMatriculasByFields({
        matriculaAlunoId: alunoId,
      })
    ).filter((matricula) => matricula.matriculaStatus === "ativa");
    const response: GetAlunoRegisteredCoursesStatusResponse = [];

    for (let i = 0; i < matriculasAtivas.length; i++) {
      const matriculaAtual = matriculasAtivas[i];
      const matriculaId = matriculaAtual.matriculaId;
      const franquiaCurso = await franquiacursoService.getFranquiaCursoByFields(
        { franquiaCursoId: matriculaAtual.matriculaCursoFranquiaId }
      );
      const curso = await cursoService.getCursoByFields({
        cursoId: franquiaCurso.franquiaCursoCursoId,
      });
      const idioma = await idiomaService.getIdiomaByFields({
        idiomaId: curso.cursoIdiomaId,
      });
      const media = (
        await avaliacaoService.getAvaliacoesByFields({
          avaliacaoMatriculaId: matriculaAtual.matriculaId,
        })
      )
        .filter((avaliacao) => {
          const avaliacaoDate = new Date(avaliacao.avaliacaoData);

          return afterDate <= avaliacaoDate && avaliacaoDate <= beforeDate;
        })
        .reduce(
          (prevSum, avaliacao, _, array) =>
            prevSum + avaliacao.avaliacaoNota / array.length,
          0
        );

      response.push({
        curso,
        idioma,
        franquiaCurso,
        media,
        matriculaId,
      });
    }

    return res.status(200).json(response);
  } catch (err) {
    res.status(500).send((err as Error)?.message);
  }
};

const getAlunoCoursesDataList: RequestHandler = async (req, res) => {
  const tokenData = getTokenDataByAuthString(
    req.headers["authorization"] || ""
  );

  if (!tokenData) return res.status(400).send("Aluno não encontrado");

  try {
    const alunoData = await studentService.getStudentByFields({
      alunoEmail: tokenData.userEmail,
    });

    const response: GetAlunoCoursesDataListResponse = [];

    const matriculas = await matriculaService.getMatriculasByFields({
      matriculaAlunoId: alunoData.alunoId,
    });
    for (let i = 0; i < matriculas.length; i++) {
      const matriculaData = matriculas[i];
      const cursoFranquiaData =
        await franquiacursoService.getFranquiaCursoByFields({
          franquiaCursoId: matriculaData.matriculaCursoFranquiaId,
        });
      const cursoData = await cursoService.getCursoByFields({
        cursoId: cursoFranquiaData.franquiaCursoCursoId,
      });

      const professores: Array<Professor> = [];
      const cursofranquiaProfessorList =
        await cursofranquiaprofessorService.getCursofranquiaProfessorListByFields(
          {
            professorCursofranquiaFranquiaCursoId:
              matriculaData.matriculaCursoFranquiaId,
          }
        );
      for (let j = 0; j < cursofranquiaProfessorList.length; j++) {
        const cursofranquiaProfessorData = cursofranquiaProfessorList[j];

        professores.push(
          await professorService.getProfessorByFields({
            professorId:
              cursofranquiaProfessorData.professorCursofranquiaProfessorId,
          })
        );
      }

      response.push({
        matricula: matriculaData,
        curso: cursoData,
        professores: professores,
      });
    }

    res.status(200).json(response);
  } catch (err) {
    res.status(500).send((err as Error)?.message);
  }
};

const getAlunoSelectedCourseData: RequestHandler = async (req, res) => {
  const tokenData = getTokenDataByAuthString(
    req.headers["authorization"] || ""
  );
  const matriculaId = Number(req.params.matriculaId);

  if (!matriculaId) {
    return res.status(400).send("O ID da matrícula é obrigatório");
  }

  try {
    const alunoData = await studentService.getStudentByFields({
      alunoEmail: tokenData.userEmail,
    });
    const matriculaData = (
      await matriculaService.getMatriculasByFields({
        matriculaId,
        matriculaAlunoId: alunoData.alunoId,
      })
    )?.[0];

    if (
      !matriculaData ||
      matriculaData?.matriculaAlunoId !== alunoData.alunoId
    ) {
      return res.status(404).send("Este aluno não possuí esta matrícula");
    }

    const cursoFranquiaData =
      await franquiacursoService.getFranquiaCursoByFields({
        franquiaCursoId: matriculaData.matriculaCursoFranquiaId,
      });
    const cursoData = await cursoService.getCursoByFields({
      cursoId: cursoFranquiaData.franquiaCursoCursoId,
    });
    const idiomaData = await idiomaService.getIdiomaByFields({
      idiomaId: cursoData.cursoIdiomaId,
    });
    const avaliacoesData = await avaliacaoService.getAvaliacoesByFields({
      avaliacaoMatriculaId: matriculaData.matriculaId,
    });
    const pagamentosData = await pagamentoService.getPagamentosByFields({
      pagamentoMatriculaId: matriculaData.matriculaId,
    });
    const professoresCursosData =
      await cursofranquiaprofessorService.getCursofranquiaProfessorListByFields(
        {
          professorCursofranquiaFranquiaCursoId:
            cursoFranquiaData.franquiaCursoId,
        }
      );
    const professoresData: Array<Professor> = [];

    for (let i = 0; i < professoresCursosData.length; i++) {
      const professorId =
        professoresCursosData[i].professorCursofranquiaProfessorId;
      const professorData: Partial<Professor> =
        await professorService.getProfessorByFields({ professorId });

      delete professorData.professorSenhaHash;
      delete professorData.professorTelefone;
      delete professorData.professorCpf;

      professoresData.push(professorData as Professor);
    }

    const aulasData = await aulaService.getAulasByFields({
      aulaFranquiaCursoId: cursoFranquiaData.franquiaCursoId,
    });

    const aulasDataResponse: Array<AulaResponseItem> = [];

    for (let i = 0; i < aulasData.length; i++) {
      const aulaData = aulasData[i];
      const professorId = aulasData[i].aulaProfessorId;
      const professorData: Partial<Professor> =
        await professorService.getProfessorByFields({ professorId });

      delete professorData.professorSenhaHash;
      delete professorData.professorTelefone;
      delete professorData.professorCpf;

      aulasDataResponse.push({
        aulaId: aulaData.aulaId,
        aulaData: aulaData.aulaData,
        aulaLocal: aulaData.aulaLocal,
        aulaStatus: aulaData.aulaStatus,
        professor: professorData as Professor,
        aulaFranquiaCursoId: aulaData.aulaFranquiaCursoId,
      });
    }

    const response: getAlunoSelectedCourseDataResponse = {
      matricula: matriculaData,
      curso: cursoData,
      aulas: aulasDataResponse,
      idioma: idiomaData,
      avaliacoes: avaliacoesData,
      pagamentos: pagamentosData,
      professores: professoresData,
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).send((err as Error)?.message?.toString());
  }
};

const getAlunoPaymentsList: RequestHandler = async (req, res) => {
  const tokenData = getTokenDataByAuthString(
    req.headers["authorization"] || ""
  );

  const alunoId = (
    await studentService.getStudentByFields({
      alunoEmail: tokenData.userEmail,
    })
  ).alunoId;

  const response: GetAlunoPaymentsListResponse = [];

  const matriculas = await matriculaService.getMatriculasByFields({
    matriculaAlunoId: alunoId,
  });

  for (let i = 0; i < matriculas.length; i++) {
    const matriculaData = matriculas[i];
    const cursoFranquiaDataCursoId = (
      await franquiacursoService.getFranquiaCursoByFields({
        franquiaCursoId: matriculaData.matriculaCursoFranquiaId,
      })
    ).franquiaCursoCursoId;
    const cursoData = await cursoService.getCursoByFields({
      cursoId: cursoFranquiaDataCursoId,
    });
    const pagamentosData = await pagamentoService.getPagamentosByFields({
      pagamentoMatriculaId: matriculaData.matriculaId,
    });

    pagamentosData.forEach((pagamentoData) => {
      response.push({
        ...pagamentoData,
        curso: cursoData,
        matricula: matriculaData,
      });
    });
  }

  const pagamentoToSortNumber = (pagamento: PagamentoResponse) =>
    pagamento.pagamentoStatus === "pago"
      ? 0
      : pagamento.pagamentoStatus === "pendente"
      ? 1
      : 2;

  response.sort((a, b) => pagamentoToSortNumber(b) - pagamentoToSortNumber(a));

  return res.status(200).json(response);
};

export default {
  getAlunoRegisteredCoursesStatus,
  getAlunoCoursesDataList,
  getAlunoSelectedCourseData,
  getAlunoPaymentsList,
};
