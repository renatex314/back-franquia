import { Dropdown } from "./utils";

export interface Franqueado {
  franqueadoId: number;
  franqueadoEndereco: string;
  franqueadoTelefone: string;
  franqueadoCpf: string;
}

export type FranqueadoList = Array<Franqueado>;

export type FranqueadoDropdown = Dropdown;