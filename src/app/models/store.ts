export interface Store {
  id: number;
  descricao: string;
}

export interface StorePriced {
  loja: {
    id: number;
    descricao: string;
  };
  precoVenda: string;
}
