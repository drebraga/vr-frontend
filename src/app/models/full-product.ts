import { Store } from './store';

export interface FullProduct {
  id: number;
  descricao: string;
  custo?: string;
  imagem?: string;
  lojas: {
    precoVenda: string;
    loja: Store;
  }[];
}
