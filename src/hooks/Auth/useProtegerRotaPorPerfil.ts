import { useEffect } from 'react';
import { useAuth } from './useAuth';
import type { Route } from '../../router/useRouter';
import type { TipoUsuario } from '../../types/Auth/usuario.types';

/**
 * Protege rotas EXCLUSIVAS de um tipo de usuário (ex: "Minhas Ferramentas",
 * "Gerenciar Locações", "HomeLocador" — só o locador pode acessar).
 *
 * Bloqueia tanto o visitante não autenticado quanto o usuário autenticado de
 * outro tipo, redirecionando (via hash routing, que sempre substitui a rota
 * atual — mesmo efeito de um `replace`) para `rotaFallback`.
 *
 * Mesma verificação que já existia duplicada em GerenciarLocacoes.tsx,
 * FerramentaDetalhe.tsx e HistoricoLocacoes.tsx — centralizada aqui para não
 * repetir a mesma lógica em cada página nova (ex: HomeLocador).
 *
 * Uso:
 *   const acessoPermitido = useExigirPerfil(navigate, 'locador', 'home');
 *   if (!acessoPermitido) return null;
 */
export function useExigirPerfil(
  navigate: (route: Route) => void,
  tipoExigido: TipoUsuario,
  rotaFallback: Route,
): boolean {
  const { usuario } = useAuth();
  const acessoPermitido = !!usuario && (usuario.tipo === 'administrador' || usuario.tipo === tipoExigido);

  useEffect(() => {
    if (!acessoPermitido) {
      navigate(rotaFallback);
    }
  }, [acessoPermitido, navigate, rotaFallback]);

  return acessoPermitido;
}

/**
 * Protege rotas que continuam abertas a visitantes não autenticados e a
 * qualquer usuário autenticado, EXCETO um tipo específico (ex: Home/Busca/
 * Carrinho — abertas ao locatário e a visitantes, mas não ao locador, que não
 * pode realizar locações).
 *
 * Ao contrário de `useExigirPerfil`, NÃO exige autenticação — só bloqueia o
 * tipo informado, preservando o fluxo de navegação/compra como visitante que
 * já existe hoje nessas páginas.
 *
 * Uso:
 *   const acessoPermitido = useBloquearPerfil(navigate, 'locador', 'homeLocador');
 *   if (!acessoPermitido) return null;
 */
export function useBloquearPerfil(
  navigate: (route: Route) => void,
  tipoBloqueado: TipoUsuario,
  rotaFallback: Route,
): boolean {
  const { usuario } = useAuth();
  const acessoPermitido = usuario?.tipo !== tipoBloqueado;

  useEffect(() => {
    if (!acessoPermitido) {
      navigate(rotaFallback);
    }
  }, [acessoPermitido, navigate, rotaFallback]);

  return acessoPermitido;
}
