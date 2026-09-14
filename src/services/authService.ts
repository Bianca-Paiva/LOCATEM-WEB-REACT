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
    const data = await response.json()
    if (!response.ok) throw new Error(JSON.stringify(data))
        localStorage.setItem('token', data.token)
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