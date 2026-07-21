import { useMemo, useState } from 'react';
import type { ProdutoSelecionado } from '../../context/ProdutoContext';
import type {
    ResumoReservaCalculado,
    SolicitarReservaFormState,
} from '../../pages/Reservas/SolicitarReserva/SolicitarReserva.types';

const MESES_ABREVIADOS = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

// Converte "yyyy-mm-dd" (valor do input date) em Date "pura", sem fuso horário
function parseDataIso(dataIso: string): Date | null {
    if (!dataIso) return null;
    const [ano, mes, dia] = dataIso.split('-').map(Number);
    if (!ano || !mes || !dia) return null;
    return new Date(ano, mes - 1, dia);
}

// Converte "yyyy-mm-dd" em "dd/mm/yyyy"
function formatarDataBr(dataIso: string): string {
    const data = parseDataIso(dataIso);
    if (!data) return '';
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${data.getFullYear()}`;
}

// Converte "yyyy-mm-dd" em "dd Mmm" (ex: "10 Ago"), usado no resumo curto (periodo)
function formatarDataCurta(dataIso: string): string {
    const data = parseDataIso(dataIso);
    if (!data) return '';
    return `${String(data.getDate()).padStart(2, '0')} ${MESES_ABREVIADOS[data.getMonth()]}`;
}

function formatarMoeda(valor: number): string {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// Data de hoje em ISO ("yyyy-mm-dd"), usada como limite mínimo para o campo de entrega
function getHojeIso(): string {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

// Converte o valor inicial (ex: "08:00") no intervalo de 3 horas (ex: "08:00 - 11:00")
function formatarIntervaloHorario(horario: string): string {
    if (!horario) return '';
    const horaInicio = parseInt(horario.split(':')[0], 10);
    const horaFim = String(horaInicio + 3).padStart(2, '0');
    return `${horario} - ${horaFim}:00`;
}

interface UseSolicitarReservaParams {
    produto: ProdutoSelecionado;
}

export function useSolicitarReserva({ produto }: UseSolicitarReservaParams) {
    const [form, setForm] = useState<SolicitarReservaFormState>({
        dataEntrega: '',
        horarioEntrega: '',
        dataDevolucao: '',
        horarioDevolucao: '',
        quantidade: 1,
    });

    const precoDiaria = useMemo(() => {
        const preco = Number(String(produto.price).replace(',', '.'));
        return Number.isFinite(preco) ? preco : 0;
    }, [produto.price]);

    const setCampo = <K extends keyof SolicitarReservaFormState>(
        campo: K,
        valor: SolicitarReservaFormState[K],
    ) => {
        setForm((atual) => ({ ...atual, [campo]: valor }));
    };

    // Limite mínimo é 1 unidade
    const decrementarQuantidade = () =>
        setForm((atual) => ({ ...atual, quantidade: Math.max(1, atual.quantidade - 1) }));

    // O limite máximo de unidades é igual ao estoque disponível do locador
    const incrementarQuantidade = () =>
        setForm((atual) => ({
            ...atual,
            quantidade: Math.min(produto.estoqueDisponivel, atual.quantidade + 1),
        }));

    const resumo: ResumoReservaCalculado = useMemo(() => {
        const inicio = parseDataIso(form.dataEntrega);
        const fim = parseDataIso(form.dataDevolucao);

        const diffMs = inicio && fim ? fim.getTime() - inicio.getTime() : 0;
        const diasBrutos = Math.round(diffMs / (1000 * 60 * 60 * 24));
        const periodoValido = Boolean(inicio && fim && diasBrutos > 0);
        const diarias = periodoValido ? diasBrutos : 0;

        const valorEstimado = diarias * precoDiaria * form.quantidade;

        // Só libera o envio quando todos os campos obrigatórios foram preenchidos
        // e o período (data + horário de entrega/devolução) é válido
        const formularioCompleto = Boolean(
            form.dataEntrega &&
            form.horarioEntrega &&
            form.dataDevolucao &&
            form.horarioDevolucao &&
            form.quantidade > 0 &&
            periodoValido,
        );

        return {
            periodoFormatado: periodoValido
                ? `${formatarDataBr(form.dataEntrega)} até ${formatarDataBr(form.dataDevolucao)} (${diarias} ${diarias === 1 ? 'diária' : 'diárias'})`
                : 'Selecione um período válido',
            entregaFormatada: form.dataEntrega
                ? `${formatarDataBr(form.dataEntrega)}${form.horarioEntrega ? ` das ${formatarIntervaloHorario(form.horarioEntrega)}` : ''}`
                : '—',
            devolucaoFormatada: form.dataDevolucao
                ? `${formatarDataBr(form.dataDevolucao)}${form.horarioDevolucao ? ` das ${formatarIntervaloHorario(form.horarioDevolucao)}` : ''}`
                : '—',
            quantidadeFormatada: `${form.quantidade} ${form.quantidade === 1 ? 'unidade' : 'unidades'}`,
            diarias,
            valorEstimado,
            valorEstimadoFormatado: formatarMoeda(valorEstimado),
            periodoValido,
            formularioCompleto,
        };
    }, [form, precoDiaria]);

    // Monta os dados prontos para virar uma ReservaData no contexto global de reservas
    const montarDadosReserva = () => ({
        produto: produto.title,
        imagem: produto.images?.[0] ?? '',
        periodo: `${formatarDataCurta(form.dataEntrega)} – ${formatarDataCurta(form.dataDevolucao)} ${parseDataIso(form.dataDevolucao)?.getFullYear() ?? ''}`,
        locador: produto.locador,
        status: 'pendente' as const,
        mensagemStatus: 'Aguardando aprovação do locador',
        categoria: produto.categoria,
        avaliacaoLocador: produto.rating,
        numeroAvaliacoes: produto.reviewCount,
        localizacao: produto.localizacao,
        dataInicio: formatarDataBr(form.dataEntrega),
        horaInicio: form.horarioEntrega,
        dataFim: formatarDataBr(form.dataDevolucao),
        horaFim: form.horarioDevolucao,
        quantidade: form.quantidade,
        valorEstimado: resumo.valorEstimadoFormatado,
    });

    return {
        form,
        setCampo,
        decrementarQuantidade,
        incrementarQuantidade,
        resumo,
        montarDadosReserva,
        dataMinimaEntrega: getHojeIso(),
    };
}
