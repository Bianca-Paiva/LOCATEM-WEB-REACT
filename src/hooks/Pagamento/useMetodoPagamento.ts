import { useMemo, useState } from 'react';
import type { Route } from '../../router/useRouter';
import type { FormaPagamento } from '../../types/cartao.types';
import { lerValorPagamento, salvarMetodoPagamento } from '../../utils/pagamentoStorage';

// Formas de pagamento que utilizam um cartão salvo e, por isso, seguem para a
// tela "Selecionar Cartão".
const FORMAS_COM_CARTAO: FormaPagamento[] = ['credito', 'debito'];

interface UseMetodoPagamentoReturn {
  /** Total da compra, persistido pelo Carrinho ao clicar em "Continuar para Pagamento". */
  total: number;
  /** Forma de pagamento marcada no momento, ou null se nenhuma foi escolhida. */
  formaSelecionada: FormaPagamento | null;
  /** Marca a forma de pagamento e, para cartão (crédito/débito), já avança para "Selecionar Cartão". */
  selecionarForma: (forma: FormaPagamento) => void;
  /** Usado pelo botão "Continuar Pagamento" do resumo (relevante sobretudo para PIX). */
  continuarPagamento: () => void;
}

export function useMetodoPagamento(navigate: (route: Route) => void): UseMetodoPagamentoReturn {
  const [formaSelecionada, setFormaSelecionada] = useState<FormaPagamento | null>(null);

  // Valor total calculado e persistido pelo Carrinho — nunca recalculado aqui.
  const total = useMemo(() => lerValorPagamento(), []);

  function irParaProximaTela(forma: FormaPagamento) {
    // Persiste a forma escolhida para a próxima tela (Selecionar Cartão/Pix já leem esta chave).
    salvarMetodoPagamento(forma);

    if (FORMAS_COM_CARTAO.includes(forma)) {
      navigate('selecionarCartao');
      return;
    }

    navigate('pagamentoPix');
  }

  function selecionarForma(forma: FormaPagamento) {
    setFormaSelecionada(forma);

    // Cartão de crédito/débito: ao selecionar a opção, já avança para a
    // tela de Selecionar Cartão (não é preciso clicar em "Continuar Pagamento").
    if (FORMAS_COM_CARTAO.includes(forma)) {
      irParaProximaTela(forma);
    }
  }

  function continuarPagamento() {
    if (!formaSelecionada) return;

    irParaProximaTela(formaSelecionada);
  }

  return {
    total,
    formaSelecionada,
    selecionarForma,
    continuarPagamento,
  };
}
