import { useEffect, useMemo, useState } from 'react';
import type { Cartao, MetodoPagamento } from '../../types/cartao.types';
import type { Route } from '../../router/useRouter';

// ============================================================
//  DADOS PADRÃO
//  Simulam os cartões cadastrados pelo usuário.
//  Utilizados como fallback enquanto não existe cadastro real.
//  Substituir futuramente por chamada à API.
// ============================================================
const cartoesPadrao: Cartao[] = [
  { id: 1, metodoPagamento: 'credito', bandeira: 'Visa', final: '1234', titular: 'JOÃO SILVA' },
  { id: 2, metodoPagamento: 'credito', bandeira: 'Mastercard', final: '5678', titular: 'JOÃO SILVA' },
  { id: 3, metodoPagamento: 'debito', bandeira: 'Visa', final: '9012', titular: 'JOÃO SILVA' },
  { id: 4, metodoPagamento: 'debito', bandeira: 'Elo', final: '3456', titular: 'JOÃO SILVA' },
];

const METODOS_VALIDOS: MetodoPagamento[] = ['credito', 'debito'];

// Lê (ou semeia) a lista de cartões salvos no localStorage.
function lerCartoesSalvos(): Cartao[] {
  const brutos = localStorage.getItem('cartoes');

  if (brutos) {
    try {
      return JSON.parse(brutos) as Cartao[];
    } catch {
      // JSON corrompido: recai para os cartões padrão.
    }
  }

  localStorage.setItem('cartoes', JSON.stringify(cartoesPadrao));
  return cartoesPadrao;
}

function ehMetodoValido(valor: string | null): valor is MetodoPagamento {
  return METODOS_VALIDOS.includes(valor as MetodoPagamento);
}

interface UseSelecionarCartaoReturn {
  /** Método de pagamento ativo (lido do localStorage), ou null enquanto redireciona. */
  metodoPagamento: MetodoPagamento | null;
  /** Título da página, já ajustado conforme o método ("Crédito"/"Débito"). */
  titulo: string;
  /** Cartões salvos compatíveis com o método de pagamento ativo. */
  cartoesFiltrados: Cartao[];
  /** Id do cartão atualmente selecionado (radio marcado), ou null. */
  cartaoSelecionadoId: number | null;
  /** Marca visualmente/logicamente um cartão como selecionado. */
  selecionarCartao: (id: number) => void;
  /** Persiste o tipo do novo cartão e navega para o formulário de cadastro. */
  adicionarNovoCartao: () => void;
  /** Valida a seleção, persiste o cartão escolhido e avança o pagamento. */
  confirmarPagamento: () => void;
  /** Mensagem de erro (ex: nenhum cartão selecionado), ou null. */
  erro: string | null;
}

export function useSelecionarCartao(navigate: (route: Route) => void): UseSelecionarCartaoReturn {
  const [cartoesSalvos] = useState<Cartao[]>(() => lerCartoesSalvos());
  const [cartaoSelecionadoId, setCartaoSelecionadoId] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const metodoPagamentoBruto = useMemo(() => localStorage.getItem('metodoPagamento'), []);
  const metodoValido = ehMetodoValido(metodoPagamentoBruto);
  const metodoPagamento: MetodoPagamento | null = metodoValido ? metodoPagamentoBruto : null;

  // Redireciona caso o método seja ausente ou inválido. Não existe, nesta SPA, uma tela
  // dedicada de "escolher método de pagamento" — o Carrinho é o ponto de entrada mais
  // próximo do checkout, então é para lá que o usuário volta.
  useEffect(() => {
    if (!metodoValido) {
      navigate('carrinho');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metodoValido]);

  const cartoesFiltrados = useMemo(
    () => (metodoPagamento ? cartoesSalvos.filter((cartao) => cartao.metodoPagamento === metodoPagamento) : []),
    [cartoesSalvos, metodoPagamento],
  );

  const titulo =
    metodoPagamento === 'credito'
      ? 'Selecionar Cartão de Crédito'
      : metodoPagamento === 'debito'
        ? 'Selecionar Cartão de Débito'
        : 'Selecionar cartão';

  function selecionarCartao(id: number) {
    setCartaoSelecionadoId(id);
    setErro(null);
  }

  function adicionarNovoCartao() {
    if (!metodoPagamento) return;

    // Salva o tipo do novo cartão que será cadastrado, para a tela de cadastro usar.
    localStorage.setItem('tipoNovoCartao', metodoPagamento);

    // A SPA ainda não tem telas dedicadas de cadastro por bandeira/tipo
    // (equivalentes a adicionarCartaoCredito.html / adicionarCartaoDebito.html);
    // "pagamentoCartao" é o formulário de cartão mais próximo disponível hoje.
    navigate('pagamentoCartao');
  }

  function confirmarPagamento() {
    if (!cartaoSelecionadoId) {
      setErro('Selecione um cartão para continuar.');
      return;
    }

    localStorage.setItem('cartaoSelecionado', String(cartaoSelecionadoId));

    // Sem uma tela própria de "processando pagamento" na SPA, seguimos para o
    // fluxo de pagamento com cartão já existente.
    navigate('pagamentoCartao');
  }

  return {
    metodoPagamento,
    titulo,
    cartoesFiltrados,
    cartaoSelecionadoId,
    selecionarCartao,
    adicionarNovoCartao,
    confirmarPagamento,
    erro,
  };
}
