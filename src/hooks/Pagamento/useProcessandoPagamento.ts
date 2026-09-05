import { useEffect, useMemo } from 'react';
import type { Route } from '../../router/useRouter';
import { lerMetodoPagamento, marcarPagamentoProcessado } from '../../utils/Pagamento/pagamentoStorage';


const TEMPO_PROCESSAMENTO_MS = 2000;

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

  // Agenda o redirecionamento para "Pagamento Aprovado" após o tempo de processamento.
  //
  // Importante: NÃO usar um useRef como guarda de "já agendado" aqui. Em desenvolvimento, o StrictMode (main.tsx) invoca cada efeito duas vezes de propósito — monta, limpa e monta de novo — para detectar efeitos não-idempotentes. Um guard por ref sobreviveria a essa limpeza simulada (o ref não é resetado) e bloquearia o reagendamento do timer na segunda montagem real, deixando a tela travada em "Processando pagamento..." para sempre. Sem o guard, cada montagem agenda e limpa o seu próprio timer: no StrictMode, o primeiro timer é cancelado no cleanup simulado e o segundo (da montagem real) é o único que efetivamente dispara — exatamente uma vez, como esperado tanto em desenvolvimento quanto em produção (onde o efeito roda uma única vez de qualquer forma).
  useEffect(() => {
    if (!metodoValido) return;

    const timer = window.setTimeout(() => {
      marcarPagamentoProcessado();
      navigate('pagamentoAprovado');
    }, TEMPO_PROCESSAMENTO_MS);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metodoValido]);

  return { metodoValido };
}
