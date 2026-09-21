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

export interface CadastrarFerramentaDTO {
  nome: string;
  marca: string;
  modelo: string;
  descricao: string;
  acessorios?: string[];
  diaria: number;
  caucao: number;
  categoriaId: number;
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

export async function cadastrarFerramenta(
  dados: CadastrarFerramentaDTO
) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_BASE}/Ferramenta`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || 'Erro ao cadastrar ferramenta');
  }

  return text ? JSON.parse(text) : null;
}

export async function uploadFotosFerramenta(
  ferramentaId: number,
  fotos: string[]
) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const formData = new FormData();

  formData.append('FerramentaId', String(ferramentaId));

  for (let i = 0; i < fotos.length; i++) {
    const resposta = await fetch(fotos[i]);
    const blob = await resposta.blob();

    const extensao = blob.type.split('/')[1] || 'jpg';

    formData.append(
      'Fotos',
      blob,
      `foto-${i}.${extensao}`
    );
  }

  const response = await fetch(
    `${API_BASE}/Upload/foto-ferramenta`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      text || 'Erro ao enviar fotos da ferramenta'
    );
  }

  return text ? JSON.parse(text) : null;
}