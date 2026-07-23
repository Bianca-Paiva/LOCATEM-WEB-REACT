import { useMemo, useState } from 'react';
import type { ChaveSubAvaliacao, ProdutoAvaliacao } from '../../pages/Avaliacao/Avaliacao.types';
import { produtosAvaliacaoMock } from '../../pages/Avaliacao/Avaliacao.mock';
import { obterLogoLocador } from '../../pages/Avaliacao/logoLocador';
import type { ReservaData } from '../../pages/Reservas/MinhasReservas/MinhasReservas.types';

const DURACAO_TOAST_MS = 3000;

/** Converte a reserva finalizada (vinda de "Detalhes da Reserva") no formato
 *  usado pela tela de avaliação, já pronta para ser avaliada. */
function criarProdutoAvaliacaoAPartirDaReserva(reserva: ReservaData): ProdutoAvaliacao {
    return {
        id: reserva.id,
        nome: reserva.produto,
        dataLocacao: `Locado em ${reserva.periodo}`,
        imagem: reserva.imagem,
        status: 'pendente',
        notaGlobal: 0,
        subAvaliacoes: { locador: 0, entrega: 0, produto: 0 },
        observacao: '',
        loja: { nome: reserva.locador, logo: obterLogoLocador(reserva.locador) },
    };
}

/**
 * Hook que concentra todo o estado e as regras do fluxo de avaliação:
 * - lista de produtos (pendentes / realizadas)
 * - produto aberto no modal
 * - notas (global e das 3 sub-avaliações)
 * - validação obrigatória das sub-avaliações
 * - rascunho da observação
 * - toast de confirmação
 *
 * Assim a página (Avaliacao.tsx) fica só com JSX e os componentes
 * recebem tudo via props, sem precisar conhecer as regras de negócio.
 */
export function useAvaliacoes() {
    const [produtos, setProdutos] = useState<ProdutoAvaliacao[]>(produtosAvaliacaoMock);
    const [idAtual, setIdAtual] = useState<string | null>(null);
    const [observacaoRascunho, setObservacaoRascunho] = useState('');
    const [camposComErro, setCamposComErro] = useState<ChaveSubAvaliacao[]>([]);
    const [erroVisivel, setErroVisivel] = useState(false);
    const [toastVisivel, setToastVisivel] = useState(false);

    const produtosPendentes = useMemo(
        () => produtos.filter((p) => p.status === 'pendente'),
        [produtos],
    );

    const produtosRealizados = useMemo(
        () => produtos.filter((p) => p.status === 'realizada'),
        [produtos],
    );

    const produtoAtual = useMemo(
        () => produtos.find((p) => p.id === idAtual) ?? null,
        [produtos, idAtual],
    );

    const itensCarrossel = useMemo(
        () => produtos.filter((p) => p.status === 'pendente' && p.id !== idAtual),
        [produtos, idAtual],
    );

    /** Abre o modal para o produto informado, carregando a observação já salva. */
    function abrirModal(id: string) {
        const produto = produtos.find((p) => p.id === id);
        setIdAtual(id);
        setObservacaoRascunho(produto?.observacao ?? '');
        setCamposComErro([]);
        setErroVisivel(false);
    }

    /**
     * Chamada ao chegar na página de avaliação vindo do botão "Avaliar Locação"
     * (tela de Detalhes da Reserva, status "finalizada"). Garante que exista um
     * item na lista para aquela reserva — criando-o a partir dos dados dela caso
     * ainda não exista — e já abre o modal de avaliação direto nele.
     */
    function iniciarAvaliacaoDaReserva(reserva: ReservaData) {
        setProdutos((atual) => {
            const jaExiste = atual.some((p) => p.id === reserva.id);
            return jaExiste ? atual : [criarProdutoAvaliacaoAPartirDaReserva(reserva), ...atual];
        });

        abrirModal(reserva.id);
    }

    function fecharModal() {
        setIdAtual(null);
        setObservacaoRascunho('');
        setCamposComErro([]);
        setErroVisivel(false);
    }

    /**
     * Clique direto na estrela do card da lista: salva a nota global
     * e já abre o modal, replicando o comportamento original.
     */
    function selecionarNotaGlobalEAbrir(id: string, valor: number) {
        setProdutos((atual) =>
            atual.map((p) => (p.id === id ? { ...p, notaGlobal: valor } : p)),
        );
        abrirModal(id);
    }

    /** Define a nota de uma sub-avaliação (locador / entrega / produto) do produto aberto no modal. */
    function selecionarSubNota(chave: ChaveSubAvaliacao, valor: number) {
        if (idAtual === null) return;

        setProdutos((atual) =>
            atual.map((p) =>
                p.id === idAtual
                    ? { ...p, subAvaliacoes: { ...p.subAvaliacoes, [chave]: valor } }
                    : p,
            ),
        );

        setCamposComErro((atual) => atual.filter((c) => c !== chave));
    }

    /** Valida se as 3 sub-notas foram preenchidas antes de liberar o envio. */
    function validarSubNotas(produto: ProdutoAvaliacao): ChaveSubAvaliacao[] {
        return (Object.keys(produto.subAvaliacoes) as ChaveSubAvaliacao[]).filter(
            (chave) => produto.subAvaliacoes[chave] === 0,
        );
    }

    /** Envia a avaliação: valida, calcula a média e move o produto para "realizada". */
    function enviarAvaliacao() {
        if (!produtoAtual) return;

        const faltando = validarSubNotas(produtoAtual);

        if (faltando.length > 0) {
            setCamposComErro(faltando);
            setErroVisivel(true);
            return;
        }

        const notas = Object.values(produtoAtual.subAvaliacoes);
        const media = Math.round(notas.reduce((a, b) => a + b, 0) / notas.length);

        setProdutos((atual) =>
            atual.map((p) =>
                p.id === produtoAtual.id
                    ? { ...p, notaGlobal: media, observacao: observacaoRascunho, status: 'realizada' }
                    : p,
            ),
        );

        fecharModal();
        exibirToast();
    }

    function exibirToast() {
        setToastVisivel(true);
        setTimeout(() => setToastVisivel(false), DURACAO_TOAST_MS);
    }

    return {
        produtosPendentes,
        produtosRealizados,
        produtoAtual,
        itensCarrossel,
        observacaoRascunho,
        camposComErro,
        erroVisivel,
        toastVisivel,
        setObservacaoRascunho,
        abrirModal,
        iniciarAvaliacaoDaReserva,
        fecharModal,
        selecionarNotaGlobalEAbrir,
        selecionarSubNota,
        enviarAvaliacao,
    };
}