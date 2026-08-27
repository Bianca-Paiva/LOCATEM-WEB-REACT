import type { Usuario } from '../types/usuario.types';

/**
 * Catálogo mockado de usuários, no mesmo espírito de mocks/locadores.mock.ts:
 * fonte única de verdade enquanto não existe uma API de autenticação real
 * (services/authService.ts já está pronto para receber essa integração, mas
 * os endpoints estão comentados nas telas de Login/Cadastro).
 *
 * Cobre os cenários pedidos para teste manual da tela de Perfil:
 * - Locador sem foto, com dados quase completos (perfil incompleto)
 * - Locatário com foto e e-mail verificado (perfil 100% completo)
 * - Qualquer outro e-mail cai no fallback (usuário novo, perfil bem incompleto)
 */
export const USUARIOS_MOCK: Usuario[] = [
  {
    id: 'u-locador-1',
    nome: 'João da Silva',
    email: 'joao.silva@exemplo.com',
    telefone: '(11) 98765-4321',
    documento: '12.345.678/0001-90',
    endereco: 'Rua das Acácias, 247 – Apto 32, São Paulo, SP · 01310-100',
    tipo: 'locador',
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
    id: 'u-locataria-1',
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@exemplo.com',
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

/** Busca um usuário mockado pelo e-mail digitado no login. */
export function buscarUsuarioPorEmail(email: string): Usuario | undefined {
  return USUARIOS_MOCK.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

/**
 * Fallback para e-mails que não estão no catálogo mockado: simula um usuário
 * recém-cadastrado, com poucos dados preenchidos (perfil bem incompleto),
 * usando a parte antes do "@" como nome provisório.
 */
export function criarUsuarioFallback(email: string): Usuario {
  const nomeBase = email.split('@')[0]?.replace(/[._]/g, ' ').trim() || 'Usuário';
  const nomeFormatado = nomeBase.replace(/\b\w/g, (letra) => letra.toUpperCase());

  return {
    id: `u-${Date.now()}`,
    nome: nomeFormatado,
    email,
    telefone: '',
    documento: '',
    endereco: '',
    tipo: 'locatario',
    emailVerificado: false,
    desde: new Date().getFullYear(),
    reputacao: {
      rating: 0,
      totalAvaliacoes: 0,
      locacoesConcluidas: 0,
    },
  };
}
