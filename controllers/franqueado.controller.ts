import { RequestHandler } from "express";
import franqueadoService from "../services/franqueado.service";
import { FranqueadoDropdown, FranqueadoList } from "../types/franqueado";

const getFranqueadoDropdown: RequestHandler = async (_, res) => {
  try {
    const franqueados: FranqueadoList = await franqueadoService.getFranqueadoList();
    const franqueadoDropdown: FranqueadoDropdown = franqueados.map((franqueado) => ({
      value: franqueado.franqueadoId,
      label: franqueado.franqueadoCpf
    }));

    res.json(franqueadoDropdown);
  } catch (err) {
    res.status(500).send((err as Error)?.message);
  }
}

export default {
  getFranqueadoDropdown
};