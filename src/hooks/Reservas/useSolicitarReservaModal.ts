import { useMemo, useState } from 'react';
import type { ProdutoSelecionado } from '../../context/ProdutoContext';
import type {
    ReservaModalFormState,
    ResumoReservaModalCalculado,
    DadosReservaModal,
} from '../../components/SolicitarReserva/SolicitarReservaModal/SolicitarReservaModal.types';

// ── Helpers de data/moeda (equivalentes aos de useSolicitarReserva.ts) ──────

// Converte "yyyy-mm-dd" (valor do input date) em Date "pura", sem fuso horário
function parseDataIso(dataIso: string): Date | null {
    if (!dataIso) return null;
    const [ano, mes, dia] = dataIso.split('-').map(Number);
    if (!ano || !mes || !dia) return null;
    return new Date(ano, mes - 1, dia);
}

function formatarDataBr(dataIso: string): string {
    const data = parseDataIso(dataIso);
    if (!data) return '';
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${data.getFullYear()}`;
}

function formatarMoeda(valor: number): string {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function getHojeIso(): string {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
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
    dataEntregaInicial?: string;
    dataDevolucaoInicial?: string;
}

export function useSolicitarReservaModal({
    produto,
    quantidadeInicial,
    dataEntregaInicial,
    dataDevolucaoInicial,
}: UseSolicitarReservaModalParams) {
    const [form, setForm] = useState<ReservaModalFormState>({
        dataEntrega: dataEntregaInicial ?? '',
        horarioEntrega: '',
        dataDevolucao: dataDevolucaoInicial ?? '',
        horarioDevolucao: '',
        quantidade: quantidadeInicial ?? 1,
    });

    const precoDiaria = useMemo(() => {
        const preco = Number(String(produto.price).replace(',', '.'));
        return Number.isFinite(preco) ? preco : 0;
    }, [produto.price]);

    const setCampo = <K extends keyof ReservaModalFormState>(
        campo: K,
        valor: ReservaModalFormState[K],
    ) => {
        setForm((atual) => ({ ...atual, [campo]: valor }));
    };

    // Clique num dia do calendário: primeiro clique define a entrega, o segundo
    // (posterior à entrega) define a devolução; um novo clique reinicia o ciclo.
    const selecionarDataCalendario = (dataIso: string) => {
        setForm((atual) => {
            const semSelecaoOuCicloCompleto = !atual.dataEntrega || (atual.dataEntrega && atual.dataDevolucao);
            if (semSelecaoOuCicloCompleto) {
                return { ...atual, dataEntrega: dataIso, dataDevolucao: '' };
            }
            if (dataIso <= atual.dataEntrega) {
                return { ...atual, dataEntrega: dataIso, dataDevolucao: '' };
            }
            return { ...atual, dataDevolucao: dataIso };
        });
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
        selecionarDataCalendario,
        decrementarQuantidade,
        incrementarQuantidade,
        resumo,
        montarDadosReserva,
        dataMinimaEntrega: getHojeIso(),
    };
}