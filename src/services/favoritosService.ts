/**
 * Cliente HTTP de favoritos do locatário.
 * Mantém a tela de Favoritos sincronizada com a API protegida por token.
 */
import type { FerramentaDisponivel } from './ferramentaservice';

const API_BASE = 'http://localhost:5033/api';

export interface FavoritoReferencia {
  id: number;
  ferramentaId: number;
  dataFavorito: string;
}

export interface FavoritoCompleto extends FavoritoReferencia {
  ferramenta: FerramentaDisponivel;
}

async function obterToken(): Promise<string> {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  return token;
}

async function lerResposta<T>(response: Response, mensagemFallback: string): Promise<T> {
  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || mensagemFallback);
  }

  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export async function buscarFavoritos(): Promise<FavoritoReferencia[]> {
  const token = await obterToken();

  const response = await fetch(`${API_BASE}/Favoritos`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return lerResposta<FavoritoReferencia[]>(response, 'Erro ao buscar favoritos');
}

export async function adicionarFavorito(
  ferramentaId: number,
): Promise<FavoritoReferencia> {
  const token = await obterToken();

  const response = await fetch(`${API_BASE}/Favoritos/${ferramentaId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return lerResposta<FavoritoReferencia>(
    response,
    'Não foi possível adicionar a ferramenta aos favoritos',
  );
}

export async function removerFavorito(ferramentaId: number): Promise<void> {
  const token = await obterToken();

  const response = await fetch(`${API_BASE}/Favoritos/${ferramentaId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Não foi possível remover a ferramenta dos favoritos');
  }
}
