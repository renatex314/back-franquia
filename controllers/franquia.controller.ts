import { RequestHandler } from "express";
import franquiaService from "../services/franquia.service";
import { FranquiaDropdown } from "../types/franquia";

const getFranquiaDropdown: RequestHandler = async (_, res) => {
  try {
    const franquias = await franquiaService.getFranquiaList();
    const franquiasDropdown: FranquiaDropdown = franquias.map((franquia) => ({
      value: franquia.franquiaId,
      label: franquia.franquiaNome
    }));

    res.json(franquiasDropdown);
  } catch (err) {
    res.status(500).send((err as Error)?.message);
  }
}

const getFranquia: RequestHandler = async (req, res) => {
  try {
    const franquiaId = req.params.franquiaId;

    if (!franquiaId) {
      throw new Error('ID da franquia é obrigatório');
    }

    const franquia = await franquiaService.getFranquiaByFields({ franquiaId });

    res.json(franquia);
  } catch (err) {
    res.status(500).send((err as Error)?.message);
  }
}

export default {
  getFranquiaDropdown,
  getFranquia
}