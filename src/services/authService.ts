const API_BASE = 'http://localhost:5033/api'

export interface CadastroPayload {
    nome: string
    email: string
    senha: string
    confirmarSenha: string
    telefone: string
    documento: string
    tipoUsuario: 1 | 2
}

export interface LoginPayload {
    email: string
    senha: string
}

export async function criarUsuario(payload: CadastroPayload): Promise<void> {
    const response = await fetch(`${API_BASE}/Cadastro/CriarUsuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(JSON.stringify(data))
}

export async function loginUsuario(payload: LoginPayload): Promise<any> {
    const response = await fetch(`${API_BASE}/Login/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    // Pega o texto bruto da resposta para a gente inspecionar
    const text = await response.text()
    console.log("👀 O que o backend mandou no login:", text);

    if (!response.ok) {
        throw new Error(text)
    }

    const data = text ? JSON.parse(text) : {}
    
    if (data.token) {
        localStorage.setItem('token', data.token)
    }
    
    return data
}
export async function buscarUsuarioLogado(): Promise<any> {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_BASE}/Usuarios/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(JSON.stringify(data))
    }

    return data
}

export const atualizarPerfilUsuario = async (dados: {
  nome: string;
  telefone: string;
  documento: string;
  endereco: string;
}) => {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:5033/api/Usuarios/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(dados)
  });

  if (!response.ok) {
    throw new Error('Não foi possível atualizar o perfil.');
  }

  return await response.json();
};