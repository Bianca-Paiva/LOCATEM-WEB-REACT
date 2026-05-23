const API_BASE = 'https://localhost:7127/api'

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

export async function loginUsuario(payload: LoginPayload): Promise<unknown> {
    const response = await fetch(`${API_BASE}/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(JSON.stringify(data))
    return data
}
