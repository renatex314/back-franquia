export interface Franquia {
  franquiaId: number;
  franquiaNome: string;
  franquiaEndereco: string;
  franquiaTelefone: string;
  franquiaFranqueadoId: number;
}

export type FranquiaList = Array<Franquia>;

export type FranquiaDropdown = Array<{ value: number; label: string }>;