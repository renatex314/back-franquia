import { RequestHandler } from "express";
import matriculaService from "../services/matricula.service";
import { GetAlunoRegisteredCoursesStatusResponse } from "../types/student";
import cursoService from "../services/curso.service";
import franquiacursoService from "../services/franquiacurso.service";
import idiomaService from "../services/idioma.service";
import avaliacaoService from "../services/avaliacao.service";

const getAlunoRegisteredCoursesStatus: RequestHandler = async (req, res) => {
  const alunoId = Number(req.query.alunoId);
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
      });
    }

    return res.status(200).json(response);
  } catch (err) {
    res.status(500).send((err as Error)?.message);
  }
};

export default {
  getAlunoRegisteredCoursesStatus,
};
