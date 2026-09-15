import type { ReputacaoUsuario } from '../types/Auth/usuario.types';

const API_BASE = 'http://localhost:5033/api';

export interface CadastroPayload {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  telefone: string;
  documento: string;
  tipoUsuario: 1 | 2;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RespostaLogin {
  token?: string;
}

export interface UsuarioDaApi {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  endereco?: string;
  tipoUsuario: string;
  fotoUrl?: string;
  desde?: number;
  reputacao?: ReputacaoUsuario;
}

export interface RespostaUploadFoto {
  urlFoto: string;
}

export async function criarUsuario(payload: CadastroPayload): Promise<void> {
  const response = await fetch(`${API_BASE}/Cadastro/CriarUsuario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

export async function loginUsuario(payload: LoginPayload): Promise<RespostaLogin> {
  const response = await fetch(`${API_BASE}/Login/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(text);
  }

  const data: RespostaLogin = text ? (JSON.parse(text) as RespostaLogin) : {};
  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
}

export async function buscarUsuarioLogado(): Promise<UsuarioDaApi> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/Usuarios/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text);
  }

  return JSON.parse(text) as UsuarioDaApi;
}

export async function atualizarPerfilUsuario(dados: {
  nome: string;
  telefone: string;
  documento: string;
  endereco: string;
}): Promise<void> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/Usuarios/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error('Não foi possível atualizar o perfil.');
  }
}

export async function uploadFotoPerfil(
  usuarioId: number,
  arquivo: File,
): Promise<RespostaUploadFoto> {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('UsuarioId', usuarioId.toString());
  formData.append('Foto', arquivo);

  const response = await fetch(`${API_BASE}/Upload/foto-perfil`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(text);
  }

  return (text ? JSON.parse(text) : {}) as RespostaUploadFoto;
}
