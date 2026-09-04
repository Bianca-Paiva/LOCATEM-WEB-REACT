import { useEffect, useMemo, useState } from 'react';
import type { Cartao, MetodoPagamento } from '../../types/cartao.types';
import type { Route } from '../../router/useRouter';
import { lerMetodoPagamento, salvarCartaoPagamento } from '../../utils/pagamentoStorage';

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

// Lê (ou semeia) a lista de cartões salvos no localStorage.
// Obs.: 'cartoes' é a carteira de cartões salvos do usuário (funcionalidade
// independente do fluxo de checkout) — não faz parte das 3 chaves
// 'locatem_pagamento_*' do fluxo de pagamento em si.
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
