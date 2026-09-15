const API_BASE = 'http://localhost:5033/api';

export interface FerramentaDisponivel {
  ferramentaId: number;
  nome: string;
  marca?: string;
  diaria?: number;
  categoriaId?: number;
  categoria?: {
    nome?: string;
  };
  usuario?: {
    nome?: string;
  };
}

export async function buscarFerramentasDisponiveis(): Promise<FerramentaDisponivel[]> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_BASE}/Ferramenta/Disponiveis`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || 'Erro ao buscar ferramentas');
  }

  return (text ? JSON.parse(text) : []) as FerramentaDisponivel[];
}
