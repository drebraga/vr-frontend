import { Store } from './store';

export interface RegisterProductObj {
  descricao: string;
  custo?: number;
  imagem?: string;
  lojas: {
    id: number;
    precoVenda: number;
  }[];
}
