import { useEffect, useMemo, useRef } from 'react';
import type { Route } from '../../router/useRouter';
import { lerMetodoPagamento, marcarPagamentoProcessado } from '../../utils/pagamentoStorage';


const TEMPO_PROCESSAMENTO_MS = 8000;

interface UseProcessandoPagamentoReturn {
  /** false enquanto a tela redireciona por método ausente/inválido (mesma regra usada em Selecionar Cartão/Pix). */
  metodoValido: boolean;
}

export function useProcessandoPagamento(navigate: (route: Route) => void): UseProcessandoPagamentoReturn {
  // Método de pagamento já deve ter sido escolhido (Carrinho -> Método de Pagamento) antes de chegar aqui — sem ele, não há o que processar.
  const metodo = useMemo(() => lerMetodoPagamento(), []);
  const metodoValido = metodo !== null;

  // Redireciona caso o método seja ausente/inválido — mesma regra usada em Selecionar Cartão/Pix.
  useEffect(() => {
    if (!metodoValido) {
      navigate('carrinho');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metodoValido]);

  // Evita que o timer seja agendado mais de uma vez (ex.: dupla invocação de efeitos em StrictMode) — garante que o pagamento seja "processado" e o redirecionamento para "Pagamento Aprovado" aconteça uma única vez.
  const jaAgendado = useRef(false);

  useEffect(() => {
    if (!metodoValido || jaAgendado.current) return;
    jaAgendado.current = true;

    const timer = window.setTimeout(() => {
      marcarPagamentoProcessado();
      navigate('pagamentoAprovado');
    }, TEMPO_PROCESSAMENTO_MS);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metodoValido]);

  return { metodoValido };
}
