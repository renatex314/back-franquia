import { Router } from "express";
import franquiaController from "./franquia.controller";
import franqueadoController from "./franqueado.controller";
import authController from "./auth.controller";
import alunoController from "./aluno.controller";

const router = Router();

/*****************************/
/***       FRANQUIA        ***/
/*****************************/

router.get("/franquia/dropdown", franquiaController.getFranquiaDropdown);
router.get("/franquia/:franquiaId", franquiaController.getFranquia);

/*****************************/
/***      FRANQUEADO       ***/
/*****************************/

router.get("/franqueado/dropdown", franqueadoController.getFranqueadoDropdown);

/*****************************/
/***        ALUNO          ***/
/*****************************/
router.get(
  "/aluno/notas/desempenho",
  alunoController.getAlunoRegisteredCoursesStatus
);
router.get("/aluno/cursos/list", alunoController.getAlunoCoursesDataList);
router.get(
  "/aluno/cursos/:matriculaId",
  alunoController.getAlunoSelectedCourseData
);
router.get("/aluno/pagamentos/list", alunoController.getAlunoPaymentsList);

/*****************************/
/***       DADOS ME        ***/
/*****************************/
router.get("/me", authController.getUserMeData);

export default router;
