import { useMemo, useState } from 'react';
import type { Route } from '../../router/useRouter';
import type { Cartao, MetodoPagamento } from '../../types/cartao.types';
import {
  detectarBandeiraCartao,
  maskCVV,
  maskNumeroCartao,
  maskValidadeCartao,
  nomeBandeiraCartao,
  validateValidadeCartao,
  type BandeiraCartao,
} from '../masks';
import { lerValorPagamento } from '../../utils/pagamentoStorage';

// ============================================================
//  MENSAGENS DE ERRO
//  Centraliza as mensagens de validação (mesmo texto da tela original).
// ============================================================
const mensagensErro = {
  numeroCartaoIncompleto: 'Confira o número do cartão.',
  nomeTitularInvalido: 'Digite o nome como aparece no cartão.',
  validadeFormato: 'Informe a validade no formato MM/AA.',
  cvvIncompleto: 'Informe o código de segurança.',
} as const;

export type CampoCartao = 'numero' | 'nomeTitular' | 'validade' | 'cvv' | 'parcelamento';

// Gera de 1x a 12x com regra de juros
export const PARCELAS_PADRAO = Array.from({ length: 12 }, (_, index) => {
  const parcela = index + 1;
  // Se for até 6 parcelas é sem juros, se for mais, é com juros

  return `${parcela}x sem juros`;
  
  // const juros = parcela <= 6 ? 'sem juros' : 'com juros'; 
  
  // return `${parcela}x ${juros}`;
});

interface DadosNovoCartao {
  numero: string;
  nomeTitular: string;
  validade: string;
  cvv: string;
  parcelamento: string;
  salvarCartao: boolean;
}

const dadosIniciais: DadosNovoCartao = {
  numero: '',
  nomeTitular: '',
  validade: '',
  cvv: '',
  parcelamento: PARCELAS_PADRAO[0],
  salvarCartao: true,
};

// Lê a lista de cartões salvos (mesma chave usada por useSelecionarCartao).
function lerCartoesSalvos(): Cartao[] {
  const brutos = localStorage.getItem('cartoes');

  if (!brutos) return [];

  try {
    return JSON.parse(brutos) as Cartao[];
  } catch {
    return [];
  }
}

export function useAdicionarCartao(metodoPagamento: MetodoPagamento, navigate: (route: Route) => void) {
  // Valor total já calculado no Carrinho e persistido em 'locatem_pagamento_valor' — nunca recalculado ou mockado aqui.
  const valor = useMemo(() => lerValorPagamento(), []);
  const [dados, setDados] = useState<DadosNovoCartao>(dadosIniciais);
  const [bandeira, setBandeira] = useState<BandeiraCartao>('');
  const [erros, setErros] = useState<Partial<Record<CampoCartao, string>>>({});
  const [processando, setProcessando] = useState(false);

  function limparErro(campo: CampoCartao) {
    setErros((atuais) => {
      if (!atuais[campo]) return atuais;
      const resto = { ...atuais };
      delete resto[campo];
      return resto;
    });
  }

  function onNumeroChange(valor: string) {
    limparErro('numero');
    const formatado = maskNumeroCartao(valor);
    setDados((atuais) => ({ ...atuais, numero: formatado }));
    setBandeira(detectarBandeiraCartao(formatado));
  }

  function onNomeTitularChange(valor: string) {
    limparErro('nomeTitular');
    // Permite apenas letras e espaços, limita a 40 caracteres e converte para maiúsculo.
    const somenteLetras = valor.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').substring(0, 40);
    setDados((atuais) => ({ ...atuais, nomeTitular: somenteLetras.toUpperCase() }));
  }

  function onValidadeChange(valor: string) {
    limparErro('validade');
    setDados((atuais) => ({ ...atuais, validade: maskValidadeCartao(valor) }));
  }

  function onValidadeBlur() {
    if (dados.validade.length !== 5) return;

    if (!validateValidadeCartao(dados.validade)) {
      setErros((atuais) => ({ ...atuais, validade: mensagensErro.validadeFormato }));
      setDados((atuais) => ({ ...atuais, validade: '' }));
    }
  }

  function onCvvChange(valor: string) {
    limparErro('cvv');
    setDados((atuais) => ({ ...atuais, cvv: maskCVV(valor) }));
  }

  function onParcelamentoChange(valor: string) {
    setDados((atuais) => ({ ...atuais, parcelamento: valor }));
  }

  function onSalvarCartaoChange(valor: boolean) {
    setDados((atuais) => ({ ...atuais, salvarCartao: valor }));
  }

  function validarTudo(): boolean {
    const novosErros: Partial<Record<CampoCartao, string>> = {};

    if (dados.numero.replace(/\D/g, '').length !== 16) {
      novosErros.numero = mensagensErro.numeroCartaoIncompleto;
    }

    if (dados.nomeTitular.trim().length < 3) {
      novosErros.nomeTitular = mensagensErro.nomeTitularInvalido;
    }

    if (!validateValidadeCartao(dados.validade)) {
      novosErros.validade = mensagensErro.validadeFormato;
    }

    if (dados.cvv.length !== 3) {
      novosErros.cvv = mensagensErro.cvvIncompleto;
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function salvarNaLista() {
    const cartoesExistentes = lerCartoesSalvos();

    const novoCartao: Cartao = {
      id: Date.now(),
      metodoPagamento,
      bandeira: nomeBandeiraCartao(bandeira),
      final: dados.numero.replace(/\s/g, '').slice(-4),
      titular: dados.nomeTitular,
    };

    localStorage.setItem('cartoes', JSON.stringify([...cartoesExistentes, novoCartao]));
  }

  function confirmar() {
    if (processando) return;

    if (!validarTudo()) return;

    setProcessando(true);

    // Salva o cartão apenas se o usuário optou por isso (mesmo comportamento da tela original).
    if (dados.salvarCartao) {
      salvarNaLista();
    }

    // Não há tela de "pagamento aprovado" na SPA — volta para a seleção de
    // cartão, de onde este fluxo de cadastro é acionado.
    window.setTimeout(() => {
      navigate('selecionarCartao');
    }, 1500);
  }

  return {
    valor,
    dados,
    bandeira,
    erros,
    processando,
    onNumeroChange,
    onNomeTitularChange,
    onValidadeChange,
    onValidadeBlur,
    onCvvChange,
    onParcelamentoChange,
    onSalvarCartaoChange,
    confirmar,
  };
}
