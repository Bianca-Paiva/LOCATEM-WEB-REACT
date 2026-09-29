/**
 * Configuração central da API da LOCATEM.
 *
 * Em produção, VITE_API_URL aponta para a API hospedada no Azure.
 * Caso a variável não exista, utiliza a API local para desenvolvimento.
 */

const API_ORIGIN = (
    import.meta.env.VITE_API_URL || 'http://localhost:5033'
).replace(/\/+$/, '');

export const API_BASE = `${API_ORIGIN}/api`;