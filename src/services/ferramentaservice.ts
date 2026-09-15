const API_BASE = 'http://localhost:5033/api';

export async function buscarFerramentasDisponiveis(): Promise<any[]> {
    const token = localStorage.getItem('token');
    
    // Se não tiver token, nem tenta buscar (ou você pode tratar isso se a Home for pública depois)
    if (!token) {
        throw new Error('Usuário não autenticado');
    }

    const response = await fetch(`${API_BASE}/Ferramenta/Disponiveis`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Erro ao buscar ferramentas');
    }

    return await response.json();
}