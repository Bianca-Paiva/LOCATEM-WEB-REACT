import { createContext } from 'react';
import type { FavoritoCompleto } from '../../../services/favoritosService';

export interface FavoritosContextType {
  favoritos: FavoritoCompleto[];
  carregando: boolean;
  erro: string;
  isFavoritado: (ferramentaId: number) => boolean;
  isProcessando: (ferramentaId: number) => boolean;
  toggleFavorito: (ferramentaId: number) => Promise<void>;
  recarregarFavoritos: () => Promise<void>;
}

export const FavoritosContext = createContext<FavoritosContextType | null>(null);
