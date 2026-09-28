/**
 * Cliente HTTP das ferramentas.
 * Concentra consultas, cadastro, edição, exclusão de fotos e upload de imagens na API.
 */
const API_BASE = 'http://localhost:5033/api';

export interface EspecificacaoTecnicaDTO {
  label: string;
  valor: string;
}

export interface EnderecoRetiradaDTO {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  tipoEndereco: number;
  ehPrioritario: boolean;
}

export interface FotoFerramentaDTO {
  id: number;
  urlImagem: string;
}

export interface FerramentaDisponivel {
  ferramentaId: number;
  nome: string;
  marca: string;
  modelo: string;
  descricao: string;
  acessorios: string[];
  diaria: number;
  caucao: number;
  dataCadastro: string;
  categoriaId: number;
  categoriaNome: string;
  usuarioId: number;
  usuarioNome: string;
  usuarioFotoUrl?: string | null;
  status: number;
  disponibilidade: number;
  quantidadeDisponivel: number;
  estadoConservacao: string;
  fonteAlimentacao: string;
  especificacoesTecnicas: EspecificacaoTecnicaDTO[];
  diasIndisponiveis: string[];
  tipoAprovacao: 'manual' | 'automatica';
  enderecoId?: number | null;
  enderecoRetirada?: {
    id: number;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
  localizacao: string;
  fotos: FotoFerramentaDTO[];
  avaliacaoMedia: number;
  totalAvaliacoes: number;
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
  quantidadeDisponivel: number;
  estadoConservacao: string;
  fonteAlimentacao: string;
  especificacoesTecnicas: EspecificacaoTecnicaDTO[];
  diasIndisponiveis: string[];
  tipoAprovacao: 'manual' | 'automatica';
  enderecoRetirada: EnderecoRetiradaDTO;
}

export function normalizarUrlImagem(url: string): string {
  // O backend pode retornar caminho relativo; a UI sempre trabalha com URL pronta para <img>.
  if (/^https?:\/\//i.test(url)) return url;

  const origem = API_BASE.replace(/\/api\/?$/, '');
  return `${origem}/${url.replace(/^\/+/, '')}`;
}

async function obterToken(): Promise<string> {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  return token;
}

export async function buscarFerramentasDisponiveis(): Promise<FerramentaDisponivel[]> {
  const token = await obterToken();

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

export async function buscarMinhasFerramentas(): Promise<FerramentaDisponivel[]> {
  const token = await obterToken();

  const response = await fetch(`${API_BASE}/Ferramenta/Minhas`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || 'Erro ao buscar minhas ferramentas');
  }

  return (text ? JSON.parse(text) : []) as FerramentaDisponivel[];
}

export async function buscarFerramentaPorId(id: number): Promise<FerramentaDisponivel> {
  const token = await obterToken();

  const response = await fetch(`${API_BASE}/Ferramenta/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || 'Erro ao buscar ferramenta');
  }

  if (!text) {
    throw new Error('O backend não retornou os dados da ferramenta.');
  }

  return JSON.parse(text) as FerramentaDisponivel;
}

export interface PerfilPublicoLocador {
  id: number;
  nome: string;
  urlFoto?: string | null;
  desde: number;
  localizacao: string;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  ferramentasAnunciadas: number;
  locacoesConcluidas: number;
}

export async function buscarPerfilPublicoLocador(usuarioId: number): Promise<PerfilPublicoLocador> {
  const response = await fetch(`${API_BASE}/Usuarios/locador/${usuarioId}/perfil`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || 'Erro ao buscar o perfil da loja');
  }

  if (!text) {
    throw new Error('O backend não retornou o perfil da loja.');
  }

  return JSON.parse(text) as PerfilPublicoLocador;
}

export async function buscarFerramentasDoLocador(usuarioId: number): Promise<FerramentaDisponivel[]> {
  const response = await fetch(`${API_BASE}/Ferramenta/Locador/${usuarioId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || 'Erro ao buscar as ferramentas do locador');
  }

  return (text ? JSON.parse(text) : []) as FerramentaDisponivel[];
}

export async function cadastrarFerramenta(
  dados: CadastrarFerramentaDTO
): Promise<FerramentaDisponivel> {
  const token = await obterToken();

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

  if (!text) {
    throw new Error('O backend não retornou a ferramenta cadastrada.');
  }

  return JSON.parse(text) as FerramentaDisponivel;
}


export async function editarFerramenta(
  id: number,
  dados: CadastrarFerramentaDTO,
): Promise<void> {
  const token = await obterToken();

  const response = await fetch(`${API_BASE}/Ferramenta/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || 'Erro ao atualizar ferramenta');
  }
}

export async function deletarFotoFerramenta(fotoId: number): Promise<void> {
  const token = await obterToken();

  const response = await fetch(`${API_BASE}/Upload/fotoferramentaexcluir/${fotoId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || 'Erro ao remover foto da ferramenta');
  }
}

export async function uploadFotosFerramenta(
  ferramentaId: number,
  fotos: string[]
) {
  const token = await obterToken();
  const formData = new FormData();

  formData.append('FerramentaId', String(ferramentaId));

  for (let i = 0; i < fotos.length; i++) {
    const resposta = await fetch(fotos[i]);
    const blob = await resposta.blob();
    const extensao = blob.type.split('/')[1] || 'jpg';

    formData.append('Fotos', blob, `foto-${i}.${extensao}`);
  }

  const response = await fetch(`${API_BASE}/Upload/foto-ferramenta`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || 'Erro ao enviar fotos da ferramenta');
  }

  return text ? JSON.parse(text) : null;
}
