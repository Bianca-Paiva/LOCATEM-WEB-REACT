import type { Usuario } from '../types/Auth/usuario.types';

/** Contas de desenvolvimento. Senha de ambas: Teste@123. */
export const USUARIOS_MOCK: Usuario[] = [
  {
    id: -1,
    nome: 'João da Silva',
    email: 'joao.silva@exemplo.com',
    // Senha de ambas: Teste@123
    telefone: '(11) 98765-4321',
    documento: '12.345.678/0001-90',
    endereco: 'Rua das Acácias, 247 – Apto 32, São Paulo, SP · 01310-100',
    tipo: 'locador',
    locadorId: 'loc-jb',
    emailVerificado: false,
    desde: 2026,
    reputacao: {
      rating: 4.5,
      totalAvaliacoes: 145,
      locacoesConcluidas: 212,
      entregasNoPrazoPercentual: 98,
    },
  },
  {
    id: -2,
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@exemplo.com',
    // Senha de ambas: Teste@123
    telefone: '(11) 91234-5678',
    documento: '987.654.321-00',
    endereco: 'Av. Sapopemba, 1500, São Paulo, SP · 03988-000',
    tipo: 'locatario',
    fotoUrl: 'https://i.pravatar.cc/150?u=maria.oliveira',
    emailVerificado: true,
    desde: 2026,
    reputacao: {
      rating: 4.8,
      totalAvaliacoes: 38,
      locacoesConcluidas: 20,
    },
  },
];

const SENHA_TESTE = 'Teste@123';
const PREFIXO_TOKEN = 'locatem-dev:';

/** Somente as duas contas deste catálogo podem iniciar uma sessão offline. */
export function autenticarUsuarioMock(email: string, senha: string): string | undefined {
  const usuario = USUARIOS_MOCK.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
  );
  return usuario && senha === SENHA_TESTE ? PREFIXO_TOKEN + usuario.id : undefined;
}

/** Reconstrói a sessão pelo catálogo, sem armazenar senhas no navegador. */
export function buscarUsuarioMockPorToken(token: string | null): Usuario | undefined {
  return USUARIOS_MOCK.find((usuario) => token === PREFIXO_TOKEN + usuario.id);
}
