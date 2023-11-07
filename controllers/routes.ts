import { Router } from "express";
import franquiaController from "./franquia.controller";

const router = Router();

/*****************************/
/***       FRANQUIA        ***/
/*****************************/

router.get('/franquia/dropdown', franquiaController.getFranquiaDropdown);
router.get('/franquia/:franquiaId', franquiaController.getFranquia);

export default router;
