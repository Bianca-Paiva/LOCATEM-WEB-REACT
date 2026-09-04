import { useContext, useEffect, useMemo, useState } from 'react';
import { CarrinhoContext } from '../../context/CarrinhoContext';
import { useAuth } from '../useAuth';
import type { Route } from '../../router/useRouter';
import type { FormaPagamento } from '../../types/cartao.types';
import {
  lerCartaoPagamento,
  lerMetodoPagamento,
  lerPagamentoProcessado,
  lerValorPagamento,
  limparDadosPagamento,
} from '../../utils/pagamentoStorage';

// Mesmos rótulos usados em SeletorFormaPagamento — mantém o texto consistente em toda a tela de checkout.
const ROTULOS_METODO: Record<FormaPagamento, string> = {
  credito: 'Cartão de Crédito',
  debito: 'Cartão de Débito',
  pix: 'PIX',
};

function formatarDataHoraAtual(): string {
  const agora = new Date();
  const data = agora.toLocaleDateString('pt-BR');
  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${data} - ${hora}`;
}

export interface ProdutoConfirmado {
  id: string;
  nome: string;
  imagem: string;
  dias: number;
  unidades: number;
}

interface UsePagamentoAprovadoReturn {
  /** false enquanto a tela redireciona por acesso direto/indevido (sem passar por "Processando Pagamento"). */
  acessoValido: boolean;
  total: number;
  metodoFormatado: string;
  dataHora: string;
  /** Nome do usuário autenticado, ou null se por algum motivo não houver sessão (tela some a linha "Usuário" nesse caso). */
  nomeUsuario: string | null;
  produtos: ProdutoConfirmado[];
  verDetalhesDoAluguel: () => void;
  voltarParaInicio: () => void;
}

export function usePagamentoAprovado(navigate: (route: Route) => void): UsePagamentoAprovadoReturn {
  const carrinho = useContext(CarrinhoContext);
  const { usuario } = useAuth();

  const metodo = useMemo(() => lerMetodoPagamento(), []);
  const processado = useMemo(() => lerPagamentoProcessado(), []);
  // Só é um acesso válido se o método estiver salvo E a etapa de processamento já tiver concluído — bloqueia digitar o hash diretamente.
  const acessoValido = !!metodo && processado;

  useEffect(() => {
    if (!acessoValido) {
      navigate('carrinho');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acessoValido]);

  // Dados do pagamento já concluído — lidos uma única vez, antes da limpeza abaixo.
  const total = useMemo(() => lerValorPagamento(), []);
  const cartao = useMemo(() => lerCartaoPagamento(), []);
  const dataHora = useMemo(() => formatarDataHoraAtual(), []);

  const metodoFormatado = useMemo(() => {
    if (!metodo) return 'Não informado';
    const rotulo = ROTULOS_METODO[metodo];
    return cartao ? `${rotulo} •••• ${cartao.ultimosDigitos}` : rotulo;
  }, [metodo, cartao]);

  // Itens pagos = os que estavam selecionados no carrinho ao continuar para o pagamento. Capturado em estado (não useMemo com deps do carrinho) para não sumir da tela quando a limpeza abaixo remover os itens do contexto.
  const [produtos] = useState<ProdutoConfirmado[]>(() => {
    if (!carrinho) return [];

    return carrinho.itens
      .filter((item) => item.selecionado)
      .map((item) => ({
        id: item.id,
        nome: item.produto.title,
        imagem: item.produto.images[0] ?? '',
        dias: item.dados.resumo.diarias,
        unidades: item.dados.quantidade,
      }));
  });

  // Limpeza pós-confirmação: remove as chaves do funil de pagamento e os itens pagos do carrinho — evita que reapareçam numa compra futura ou que a tela quebre se o usuário voltar para o Carrinho depois. Roda uma única vez, só quando o acesso é válido.
  useEffect(() => {
    if (!acessoValido || !carrinho) return;

    limparDadosPagamento();

    carrinho.itens
      .filter((item) => item.selecionado)
      .forEach((item) => carrinho.removerItem(item.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acessoValido]);

  function verDetalhesDoAluguel() {
    navigate('minhasLocacoes');
  }

  function voltarParaInicio() {
    navigate('home');
  }

  return {
    acessoValido,
    total,
    metodoFormatado,
    dataHora,
    nomeUsuario: usuario?.nome ?? null,
    produtos,
    verDetalhesDoAluguel,
    voltarParaInicio,
  };
}
