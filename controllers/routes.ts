import { Router } from "express";
import franquiaController from "./franquia.controller";
import franqueadoController from "./franqueado.controller";

const router = Router();

/*****************************/
/***       FRANQUIA        ***/
/*****************************/

router.get('/franquia/dropdown', franquiaController.getFranquiaDropdown);
router.get('/franquia/:franquiaId', franquiaController.getFranquia);

/*****************************/
/***      FRANQUEADO       ***/
/*****************************/

router.get('/franqueado/dropdown', franqueadoController.getFranqueadoDropdown);

export default router;
