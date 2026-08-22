import { useEffect, useMemo, useState } from 'react';
import type { ProdutoSelecionado } from '../../context/ProdutoContext';
import {
    PRAZO_APROVACAO_HORAS,
    PRAZO_PAGAMENTO_HORAS,
} from '../../components/SolicitarReserva/SolicitarReservaModal/SolicitarReservaModal.types';
import type {
    ReservaModalFormState,
    ResumoReservaModalCalculado,
    DadosReservaModal,
} from '../../components/SolicitarReserva/SolicitarReservaModal/SolicitarReservaModal.types';
import {
    adicionarDias,
    formatarDataBr,
    formatarIso,
    getHojeIso,
    parseDataIso,
} from '../../utils/dataReserva';

// ── Helpers de moeda/horário (equivalentes aos de useSolicitarReserva.ts) ──

function formatarMoeda(valor: number): string {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// Converte o valor inicial (ex: "08:00") no intervalo de 3 horas (ex: "08:00 às 11:00")
function formatarIntervaloHorario(horario: string): string {
    if (!horario) return '';
    const horaInicio = parseInt(horario.split(':')[0], 10);
    const horaFim = String(horaInicio + 3).padStart(2, '0');
    return `${horario} às ${horaFim}:00`;
}

// Valor fixo de frete (mock), igual ao usado em useSolicitarReserva.ts
const FRETE_PADRAO = 15;

interface UseSolicitarReservaModalParams {
    produto: ProdutoSelecionado;
    /** Preenchimento inicial vindo da página de detalhe, quando o usuário já selecionou lá */
    quantidadeInicial?: number;
    /** Diárias já escolhidas na página do produto (ex: "2 diárias"); usada para sugerir a devolução */
    duracaoInicial?: number;
    dataEntregaInicial?: string;
    dataDevolucaoInicial?: string;
    /** O modal só existe montado/aberto de fato quando `aberto` é true — usado para
     * ressincronizar o formulário com os valores iniciais toda vez que reabre. */
    aberto: boolean;
}

export function useSolicitarReservaModal({
    produto,
    quantidadeInicial,
    duracaoInicial,
    dataEntregaInicial,
    dataDevolucaoInicial,
    aberto,
}: UseSolicitarReservaModalParams) {
    // Se a página do produto já entregou uma entrega mas não uma devolução,
    // usa a duração de diárias escolhida lá (`duracaoInicial`) para sugerir a
    // devolução de cara, sem esperar o usuário abrir o calendário.
    const sugerirDevolucao = (dataEntrega: string, dataDevolucaoAtual: string) => {
        if (dataDevolucaoAtual) return dataDevolucaoAtual;
        if (!dataEntrega || !duracaoInicial || duracaoInicial <= 0) return dataDevolucaoAtual;
        return adicionarDias(dataEntrega, duracaoInicial);
    };

    const [form, setForm] = useState<ReservaModalFormState>({
        dataEntrega: dataEntregaInicial ?? '',
        horarioEntrega: '',
        dataDevolucao: sugerirDevolucao(dataEntregaInicial ?? '', dataDevolucaoInicial ?? ''),
        horarioDevolucao: '',
        quantidade: quantidadeInicial ?? 1,
    });

    // Toda vez que o modal é reaberto, ressincroniza com o que foi escolhido
    // na página do produto (quantidade e duração/período), evitando que uma
    // seleção antiga de uma abertura anterior fique presa no formulário.
    useEffect(() => {
        if (!aberto) return;
        setForm((atual) => {
            const dataEntrega = dataEntregaInicial ?? atual.dataEntrega;
            const dataDevolucao = sugerirDevolucao(dataEntrega, dataDevolucaoInicial ?? atual.dataDevolucao);
            return {
                ...atual,
                quantidade: quantidadeInicial ?? atual.quantidade ?? 1,
                dataEntrega,
                dataDevolucao,
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aberto]);

    const precoDiaria = useMemo(() => {
        const preco = Number(String(produto.price).replace(',', '.'));
        return Number.isFinite(preco) ? preco : 0;
    }, [produto.price]);

    // Primeira data de retirada permitida no calendário. Quando o locador
    // exige aprovação manual, soma o prazo que ele tem para responder ao
    // prazo de pagamento já usado no restante do projeto — o locatário não
    // pode escolher uma retirada mais cedo do que esse prazo permitiria.
    const dataMinimaEntrega = useMemo(() => {
        if (produto.tipoAprovacao !== 'manual') return getHojeIso();

        const prazoTotalHoras = PRAZO_APROVACAO_HORAS + PRAZO_PAGAMENTO_HORAS;
        const data = new Date(Date.now() + prazoTotalHoras * 60 * 60 * 1000);
        data.setHours(0, 0, 0, 0);
        return formatarIso(data);
    }, [produto.tipoAprovacao]);

    // Primeira data de devolução permitida: o dia seguinte à entrega já
    // escolhida (é preciso ao menos 1 diária) ou, se a entrega ainda não foi
    // escolhida, a própria data mínima de entrega.
    const dataMinimaDevolucao = useMemo(() => {
        return form.dataEntrega ? adicionarDias(form.dataEntrega, 1) : dataMinimaEntrega;
    }, [form.dataEntrega, dataMinimaEntrega]);

    const setCampo = <K extends keyof ReservaModalFormState>(
        campo: K,
        valor: ReservaModalFormState[K],
    ) => {
        setForm((atual) => ({ ...atual, [campo]: valor }));
    };

    // Ao escolher a data de entrega no calendário: preenche o campo e, se já
    // existe uma quantidade de diárias escolhida na página do produto, usa
    // essa duração para sugerir/preencher automaticamente a devolução. Caso
    // contrário, apenas limpa uma devolução que tenha ficado inválida com a
    // nova entrega (data anterior ou igual a ela).
    const selecionarDataEntrega = (dataIso: string) => {
        setForm((atual) => {
            let dataDevolucao = atual.dataDevolucao;

            if (duracaoInicial && duracaoInicial > 0) {
                dataDevolucao = adicionarDias(dataIso, duracaoInicial);
            } else if (dataDevolucao && dataDevolucao <= dataIso) {
                dataDevolucao = '';
            }

            return { ...atual, dataEntrega: dataIso, dataDevolucao };
        });
    };

    // Ao escolher a data de devolução no calendário: apenas preenche o campo
    // (a validação de "depois da entrega" já é garantida pelo próprio
    // calendário, que bloqueia datas anteriores à `dataMinimaDevolucao`).
    const selecionarDataDevolucao = (dataIso: string) => {
        setCampo('dataDevolucao', dataIso);
    };

    const decrementarQuantidade = () =>
        setForm((atual) => ({ ...atual, quantidade: Math.max(1, atual.quantidade - 1) }));

    const incrementarQuantidade = () =>
        setForm((atual) => ({
            ...atual,
            quantidade: Math.min(produto.estoqueDisponivel, atual.quantidade + 1),
        }));

    const resumo: ResumoReservaModalCalculado = useMemo(() => {
        const inicio = parseDataIso(form.dataEntrega);
        const fim = parseDataIso(form.dataDevolucao);

        const diffMs = inicio && fim ? fim.getTime() - inicio.getTime() : 0;
        const diasBrutos = Math.round(diffMs / (1000 * 60 * 60 * 24));
        const periodoValido = Boolean(inicio && fim && diasBrutos > 0);
        const diarias = periodoValido ? diasBrutos : 0;

        const frete = FRETE_PADRAO;
        const aluguel = diarias * precoDiaria * form.quantidade;
        const valor = aluguel + frete;

        const formularioCompleto = Boolean(
            form.dataEntrega &&
            form.horarioEntrega &&
            form.dataDevolucao &&
            form.horarioDevolucao &&
            form.quantidade > 0 &&
            periodoValido,
        );

        return {
            dataEntregaFormatada: formatarDataBr(form.dataEntrega),
            dataDevolucaoFormatada: formatarDataBr(form.dataDevolucao),
            entregaHorarioFormatado: form.horarioEntrega ? formatarIntervaloHorario(form.horarioEntrega) : '',
            devolucaoHorarioFormatado: form.horarioDevolucao ? formatarIntervaloHorario(form.horarioDevolucao) : '',
            diarias,
            periodoValido,
            quantidadeFormatada: `${form.quantidade} ${form.quantidade === 1 ? 'unidade' : 'unidades'}`,
            aluguel,
            aluguelFormatado: formatarMoeda(aluguel),
            frete,
            freteFormatado: formatarMoeda(frete),
            valor,
            valorFormatado: formatarMoeda(valor),
            formularioCompleto,
        };
    }, [form, precoDiaria]);

    const montarDadosReserva = (): DadosReservaModal => ({
        produtoId: produto.id,
        dataEntrega: form.dataEntrega,
        horarioEntrega: form.horarioEntrega,
        dataDevolucao: form.dataDevolucao,
        horarioDevolucao: form.horarioDevolucao,
        quantidade: form.quantidade,
        resumo,
    });

    return {
        form,
        setCampo,
        selecionarDataEntrega,
        selecionarDataDevolucao,
        decrementarQuantidade,
        incrementarQuantidade,
        resumo,
        montarDadosReserva,
        dataMinimaEntrega,
        dataMinimaDevolucao,
        duracaoSugerida: duracaoInicial,
    };
}