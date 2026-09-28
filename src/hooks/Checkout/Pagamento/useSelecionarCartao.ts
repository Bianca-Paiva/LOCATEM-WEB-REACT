import { useEffect, useMemo, useState } from 'react';
import type { Cartao, MetodoPagamento } from '../../../types/Checkout/Pagamento/cartao.types';
import type { Route } from '../../../router/useRouter';
import { lerMetodoPagamento, salvarCartaoPagamento } from '../../../utils/Checkout/Pagamento/pagamentoStorage';

function lerCartoesSalvos(): Cartao[] {
  const brutos = localStorage.getItem('cartoes');

  if (!brutos) return [];

  try {
    const cartoes = JSON.parse(brutos) as unknown;
    return Array.isArray(cartoes) ? (cartoes as Cartao[]) : [];
  } catch {
    localStorage.removeItem('cartoes');
    return [];
  }
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

  // A tela de Selecionar Cartão só é válida para crédito/débito — PIX não passa por aqui.
  const metodoBruto = useMemo(() => lerMetodoPagamento(), []);
  const metodoValido = metodoBruto === 'credito' || metodoBruto === 'debito';
  const metodoPagamento: MetodoPagamento | null = metodoValido ? metodoBruto : null;

  // Redireciona caso o método seja ausente ou inválido. Não existe, nesta SPA, uma tela
  // dedicada de "escolher método de pagamento" — o Carrinho é o ponto de entrada mais
  // próximo do checkout, então é para lá que o usuário volta.
  useEffect(() => {
    if (!metodoValido) {
      navigate('carrinho');
    }
  }, [metodoValido, navigate]);

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

    // O tipo do novo cartão (crédito/débito) já está em 'locatem_pagamento_metodo';
    // as telas de cadastro (AdicionarCartaoCredito/AdicionarCartaoDebito) são
    // dedicadas por tipo e não precisam de nenhuma chave adicional para isso.
    navigate(metodoPagamento === 'credito' ? 'adicionarCartaoCredito' : 'adicionarCartaoDebito');
  }

  function confirmarPagamento() {
    if (!cartaoSelecionadoId) {
      setErro('Selecione um cartão para continuar.');
      return;
    }

    const cartaoEscolhido = cartoesFiltrados.find((cartao) => cartao.id === cartaoSelecionadoId);

    if (cartaoEscolhido) {
      // Persiste apenas dados não sensíveis do cartão escolhido para o pagamento atual.
      salvarCartaoPagamento({
        id: String(cartaoEscolhido.id),
        bandeira: cartaoEscolhido.bandeira,
        ultimosDigitos: cartaoEscolhido.final,
      });
    }

    navigate('processandoPagamento');
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
