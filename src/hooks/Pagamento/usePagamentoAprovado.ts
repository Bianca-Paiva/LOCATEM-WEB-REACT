import { useContext, useEffect, useMemo, useState } from 'react';
import { CarrinhoContext } from '../../context/Carrinho/CarrinhoContext';
import { useAuth } from '../Auth/useAuth';
import type { Route } from '../../router/useRouter';
import type { FormaPagamento } from '../../types/Pagamento/cartao.types';
import {
  lerCartaoPagamento,
  lerItemPagamentoAvulso,
  lerMetodoPagamento,
  lerPagamentoProcessado,
  lerValorPagamento,
  limparDadosPagamento,
} from '../../utils/Pagamento/pagamentoStorage';

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
  /** Dia/horário de entrega deste item específico, vindos do modal "Detalhes da Locação". */
  entrega: EntregaConfirmada;
}

/** Dia e horário de entrega vindos do modal "Detalhes da Locação". */
export interface EntregaConfirmada {
  data: string;
  horario: string;
}

/** Entrega exibida no Resumo do pedido — só existe quando todos os itens compartilham a mesma data/horário. */
export interface EntregaResumo extends EntregaConfirmada {
  /** true quando há mais de um item e todos compartilham a mesma entrega — controla o sufixo "— todos os itens". */
  todosOsItens: boolean;
}

interface UsePagamentoAprovadoReturn {
  /** false enquanto a tela redireciona por acesso direto/indevido (sem passar por "Processando Pagamento"). */
  acessoValido: boolean;
  total: number;
  /** Forma de pagamento "crua", para quem precisa decidir algo por tipo (ex.: qual ícone exibir) em vez do rótulo já formatado. */
  metodo: FormaPagamento | null;
  metodoFormatado: string;
  dataHora: string;
  /** Nome do usuário autenticado, ou null se por algum motivo não houver sessão (tela some a linha "Usuário" nesse caso). */
  nomeUsuario: string | null;
  produtos: ProdutoConfirmado[];
  /**
   * Entrega exibida no Resumo do pedido — só preenchida quando todos os itens têm a mesma data/horário
   * (entrega unificada). Quando os itens têm entregas diferentes, vem null e cada card em "Itens alugados"
   * exibe a sua própria entrega (ver `ProdutoConfirmado.entrega`), evitando duplicar a informação.
   */
  entrega: EntregaResumo | null;
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
  // Quando a locação é iniciada direto por "Locar Agora" (sem passar pelo carrinho), não há itens selecionados no CarrinhoContext — nesse caso, cai no item avulso persistido pela página do produto.
  // Cada item carrega a própria entrega (dia/horário), lida diretamente do modal "Detalhes da Locação".
  const [produtos] = useState<ProdutoConfirmado[]>(() => {
    const itensSelecionadosCarrinho = carrinho
      ? carrinho.itens.filter((item) => item.selecionado)
      : [];

    if (itensSelecionadosCarrinho.length > 0) {
      return itensSelecionadosCarrinho.map((item) => ({
        id: item.id,
        nome: item.produto.title,
        imagem: item.produto.images[0] ?? '',
        dias: item.dados.resumo.diarias,
        unidades: item.dados.quantidade,
        entrega: {
          data: item.dados.resumo.dataEntregaFormatada,
          horario: item.dados.resumo.entregaHorarioFormatado,
        },
      }));
    }

    const itemAvulso = lerItemPagamentoAvulso();
    if (!itemAvulso) return [];

    return [
      {
        id: itemAvulso.id,
        nome: itemAvulso.nome,
        imagem: itemAvulso.imagem,
        dias: itemAvulso.dias,
        unidades: itemAvulso.unidades,
        entrega: { data: itemAvulso.dataEntregaFormatada, horario: itemAvulso.horarioEntregaFormatado },
      },
    ];
  });

  // Entrega do Resumo do pedido: só existe quando todos os itens compartilham a mesma data/horário — com
  // um único item, isso já é sempre verdade. Com itens em datas/horários diferentes, não há uma "janela"
  // única a mostrar aqui; cada card em "Itens alugados" mostra a sua própria entrega (ver `produtos` acima).
  const entrega = useMemo<EntregaResumo | null>(() => {
    if (produtos.length === 0) return null;

    const [primeira, ...restantes] = produtos.map((produto) => produto.entrega);
    const todasIguais = restantes.every(
      (item) => item.data === primeira.data && item.horario === primeira.horario,
    );
    if (!todasIguais) return null;

    return { ...primeira, todosOsItens: produtos.length > 1 };
  }, [produtos]);

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
    metodo,
    metodoFormatado,
    dataHora,
    nomeUsuario: usuario?.nome ?? null,
    produtos,
    entrega,
    verDetalhesDoAluguel,
    voltarParaInicio,
  };
}