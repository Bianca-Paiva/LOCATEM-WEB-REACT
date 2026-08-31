import { useMemo, useState } from 'react';
import type {
    ChaveSubAvaliacao,
    PerspectivaAvaliacao,
    ProdutoAvaliacao,
    RegistroAvaliacao,
    SubAvaliacoes,
} from '../../pages/Avaliacao/Avaliacao.types';
import { CHAVES_SUB_AVALIACAO } from '../../pages/Avaliacao/Avaliacao.types';
import { obterLogoLocador } from '../../pages/Avaliacao/logoLocador';
import type { LocacaoData } from '../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import { useLocacaoStore } from '../Locacoes/useLocacaoStore';
import { useAuth } from '../useAuth';
import { useCatalogoStore } from '../useCatalogoStore';

const DURACAO_TOAST_MS = 3000;

/** Sub-notas zeradas (ainda não avaliadas) para os aspectos da perspectiva informada. */
function criarSubAvaliacoesVazias(perspectiva: PerspectivaAvaliacao): SubAvaliacoes {
    return Object.fromEntries(CHAVES_SUB_AVALIACAO[perspectiva].map((chave) => [chave, 0]));
}

/**
 * Converte uma locação "finalizada" no formato usado pela tela de Avaliação, de acordo com a perspectiva de quem está avaliando. Se já existe um registro de avaliação salvo na própria locação (`avaliacaoDoLocatario`/`avaliacaoDoLocador`), o item nasce como "realizada" com as notas salvas; senão nasce "pendente" com as sub-notas zeradas.
 */
function criarProdutoAvaliacao(locacao: LocacaoData, perspectiva: PerspectivaAvaliacao): ProdutoAvaliacao {
    const registro = perspectiva === 'locatario' ? locacao.avaliacaoDoLocatario : locacao.avaliacaoDoLocador;

    return {
        id: locacao.id,
        nome: locacao.produto,
        dataLocacao: `Locado em ${locacao.periodo}`,
        imagem: locacao.imagem,
        status: registro ? 'realizada' : 'pendente',
        notaGlobal: registro?.notaGlobal ?? 0,
        subAvaliacoes: registro?.subAvaliacoes ?? criarSubAvaliacoesVazias(perspectiva),
        observacao: registro?.observacao ?? '',
        loja: { nome: locacao.locador, logo: obterLogoLocador(locacao.locador) },
        locacaoId: locacao.id,
        perspectiva,
    };
}

/**
 * Hook que concentra todo o estado e as regras do fluxo de avaliação:
 * - lista de locações avaliáveis (pendentes / realizadas), derivada das locações reais — nunca de uma lista de avaliações mockada e desconectada;
 * - qual aspecto avaliar depende de quem está avaliando (locatário avalia locador + entrega + produto + plataforma; locador avalia locatário + entrega + plataforma — ver Avaliacao.types.ts);
 * - avaliação só fica disponível quando a locação chega a status "finalizada" (mesmo pipeline de status já usado em Minhas Locações); 
 * - envio grava o registro na própria locação, o que também impede reavaliação duplicada.
 *
 * Assim a página (Avaliacao.tsx) fica só com JSX e os componentes recebem tudo via props, sem
 * precisar conhecer as regras de negócio.
 */
export function useAvaliacoes() {
    const { locacoes, atualizarLocacao } = useLocacaoStore();
    const { usuario } = useAuth();
    const { adicionarAvaliacaoProduto } = useCatalogoStore();

    // Locador avalia locações das ferramentas que ele mesmo anuncia — mesma correspondência por nome já usada para ligar usuário e loja (ver mocks/locadores.mock.ts / getLocadorByNome).
    const perspectiva: PerspectivaAvaliacao = usuario?.tipo === 'locador' ? 'locador' : 'locatario';

    const locacoesAvaliaveis = useMemo(() => {
        // A avaliação só é liberada depois que a ferramenta foi devolvida/recebida de volta — no fluxo atual da locação isso corresponde ao status "finalizada".
        const finalizadas = locacoes.filter((locacao) => locacao.status === 'finalizada');

        return perspectiva === 'locador'
            ? finalizadas.filter((locacao) => locacao.locador === usuario?.nome)
            : finalizadas;
    }, [locacoes, perspectiva, usuario?.nome]);

    const produtosBase = useMemo(
        () => locacoesAvaliaveis.map((locacao) => criarProdutoAvaliacao(locacao, perspectiva)),
        [locacoesAvaliaveis, perspectiva],
    );

    // Nota global "de rascunho": permite o clique direto na estrela do card (antes de abrir o modal) refletir na tela imediatamente, sem já persistir nada na locação.
    const [notasGlobaisRascunho, setNotasGlobaisRascunho] = useState<Record<string, number>>({});

    const produtos = useMemo(
        () =>
            produtosBase.map((produto) =>
                produto.id in notasGlobaisRascunho
                    ? { ...produto, notaGlobal: notasGlobaisRascunho[produto.id] }
                    : produto,
            ),
        [produtosBase, notasGlobaisRascunho],
    );

    const [idAtual, setIdAtual] = useState<string | null>(null);
    const [subNotasRascunho, setSubNotasRascunho] = useState<SubAvaliacoes>({});
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

    // Reflete as sub-notas/observação em edição por cima do item base, para o modal mostrar em tempo real o que o usuário está clicando antes de enviar.
    const produtoAtual = useMemo(() => {
        const base = produtos.find((p) => p.id === idAtual);
        if (!base) return null;
        return { ...base, subAvaliacoes: subNotasRascunho, observacao: observacaoRascunho };
    }, [produtos, idAtual, subNotasRascunho, observacaoRascunho]);

    const itensCarrossel = useMemo(
        () => produtos.filter((p) => p.status === 'pendente' && p.id !== idAtual),
        [produtos, idAtual],
    );

    /** Abre o modal para o produto informado, carregando as notas e a observação já salvas. */
    function abrirModal(id: string) {
        const produto = produtos.find((p) => p.id === id);
        setIdAtual(id);
        setSubNotasRascunho(produto?.subAvaliacoes ?? criarSubAvaliacoesVazias(perspectiva));
        setObservacaoRascunho(produto?.observacao ?? '');
        setCamposComErro([]);
        setErroVisivel(false);
    }

    /**
     * Chamada ao chegar na página de avaliação vindo do botão "Avaliar Locação" (tela de Detalhes da Locação, status "finalizada"). A locação já está entre `locacoesAvaliaveis` nesse ponto, então só falta abrir o modal direto nela.
     */
    function iniciarAvaliacaoDaLocacao(locacao: LocacaoData) {
        abrirModal(locacao.id);
    }

    function fecharModal() {
        setIdAtual(null);
        setSubNotasRascunho({});
        setObservacaoRascunho('');
        setCamposComErro([]);
        setErroVisivel(false);
    }

    /**
     * Clique direto na estrela do card da lista: salva a nota global (em rascunho, ainda não persistida) e já abre o modal, replicando o comportamento original.
     */
    function selecionarNotaGlobalEAbrir(id: string, valor: number) {
        setNotasGlobaisRascunho((atual) => ({ ...atual, [id]: valor }));
        abrirModal(id);
    }

    /** Define a nota de um aspecto (varia por perspectiva — ver CHAVES_SUB_AVALIACAO) do produto aberto no modal. */
    function selecionarSubNota(chave: ChaveSubAvaliacao, valor: number) {
        if (idAtual === null) return;

        setSubNotasRascunho((atual) => ({ ...atual, [chave]: valor }));
        setCamposComErro((atual) => atual.filter((c) => c !== chave));
    }

    /** Valida se todos os aspectos exigidos pela perspectiva atual foram preenchidos antes de liberar o envio. */
    function validarSubNotas(subAvaliacoes: SubAvaliacoes): ChaveSubAvaliacao[] {
        return CHAVES_SUB_AVALIACAO[perspectiva].filter((chave) => !subAvaliacoes[chave]);
    }

    /**
     * Envia a avaliação: valida, calcula a média, grava o registro na própria locação (o que já impede reavaliação duplicada) e, quando é o locatário avaliando o produto, alimenta a avaliação real da ferramenta no catálogo — sem misturar esse dado com as demais notas (locador/entrega/plataforma), que não são avaliação de produto.
     */
    function enviarAvaliacao() {
        if (!produtoAtual) return;

        const faltando = validarSubNotas(subNotasRascunho);

        if (faltando.length > 0) {
            setCamposComErro(faltando);
            setErroVisivel(true);
            return;
        }

        const notas = Object.values(subNotasRascunho) as number[];
        const media = Math.round(notas.reduce((a, b) => a + b, 0) / notas.length);

        const registro: RegistroAvaliacao = {
            subAvaliacoes: subNotasRascunho,
            notaGlobal: media,
            observacao: observacaoRascunho,
        };

        atualizarLocacao(
            produtoAtual.locacaoId,
            perspectiva === 'locatario' ? { avaliacaoDoLocatario: registro } : { avaliacaoDoLocador: registro },
        );

        // Só a perspectiva do locatário tem o aspecto "produto" — é o único que deve alimentar as avaliações da ferramenta em si (as demais notas são sobre pessoas/logística/plataforma).
        const notaProduto = subNotasRascunho.produto;
        if (perspectiva === 'locatario' && typeof notaProduto === 'number') {
            adicionarAvaliacaoProduto(produtoAtual.nome, {
                nome: usuario?.nome ?? 'Locatário',
                rating: notaProduto,
                tempo: 'Agora',
                texto: observacaoRascunho,
                fotos: [],
                utilCount: 0,
            });
        }

        // Limpa o rascunho de nota global desse item — a partir daqui o valor exibido já vem do registro recém-salvo na locação, então um rascunho antigo não deve mais sobrepô-lo.
        setNotasGlobaisRascunho((atual) => {
            const resto = { ...atual };
            delete resto[produtoAtual.id];
            return resto;
        });

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
        iniciarAvaliacaoDaLocacao,
        fecharModal,
        selecionarNotaGlobalEAbrir,
        selecionarSubNota,
        enviarAvaliacao,
    };
}