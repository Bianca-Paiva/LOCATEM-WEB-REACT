import { useMemo, useState } from 'react';
import type { ProdutoSelecionado } from '../../context/ProdutoContext';
import type {
    ResumoReservaCalculado,
    SolicitarReservaFormState,
} from '../../pages/Reservas/SolicitarReserva/SolicitarReserva.types';
import { validateCEP, validatePhone, validateFullName } from '../masks';

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

// Converte o valor inicial (ex: "08:00") no intervalo de 3 horas (ex: "08:00 às 11:00")
function formatarIntervaloHorario(horario: string): string {
    if (!horario) return '';
    const horaInicio = parseInt(horario.split(':')[0], 10);
    const horaFim = String(horaInicio + 3).padStart(2, '0');
    return `${horario} às ${horaFim}:00`;
}

// Valor fixo de frete (mock). Futuramente deve vir de um cálculo real
// (distância entre locador/locatário, transportadora, etc.) via API.
const FRETE_PADRAO = 15;

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
        cep: '',
        cepDesconhecido: false,
        ruaAvenida: '',
        numero: '',
        complemento: '',
        nomeCompleto: '',
        telefoneContato: '',
    });

    const precoDiaria = useMemo(() => {
        const preco = Number(String(produto.price).replace(',', '.'));
        return Number.isFinite(preco) ? preco : 0;
    }, [produto.price]);

    const setCampo = <K extends keyof SolicitarReservaFormState>(
        campo: K,
        valor: SolicitarReservaFormState[K],
    ) => {
        setForm((atual) => ({
            ...atual, [campo]: valor
        }));
    };

    // Limite mínimo é 1 unidade
    const decrementarQuantidade = () =>
        setForm((atual) => ({
            ...atual, quantidade: Math.max(1, atual.quantidade - 1)
        }));

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

        const frete = FRETE_PADRAO;
        const aluguel = diarias * precoDiaria * form.quantidade;
        const valor = diarias * precoDiaria * form.quantidade + frete;

        // Endereço só é considerado válido quando rua e número estão preenchidos
        // e, caso o CEP não tenha sido marcado como "desconhecido", ele também é obrigatório
        const enderecoValido = Boolean(
            form.ruaAvenida &&
            form.numero &&
            (form.cepDesconhecido || validateCEP(form.cep)),
        );

        const contatoValido = Boolean(
            validateFullName(form.nomeCompleto) && validatePhone(form.telefoneContato),
        );

        // Só libera o envio quando todos os campos obrigatórios foram preenchidos,
        // o período (data + horário de entrega/devolução) é válido, e o endereço/contato também
        const formularioCompleto = Boolean(
            form.dataEntrega &&
            form.horarioEntrega &&
            form.dataDevolucao &&
            form.horarioDevolucao &&
            form.quantidade > 0 &&
            periodoValido &&
            enderecoValido &&
            contatoValido,
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
            frete,
            freteFormatado: formatarMoeda(frete),
            valor,
            valorFormatado: formatarMoeda(valor),
            periodoValido,
            formularioCompleto,
            dataEntregaFormatada: formatarDataBr(form.dataEntrega),
            dataDevolucaoFormatada: formatarDataBr(form.dataDevolucao),
            entregaHorarioFormatado: form.horarioEntrega ? formatarIntervaloHorario(form.horarioEntrega) : '',
            devolucaoHorarioFormatado: form.horarioDevolucao ? formatarIntervaloHorario(form.horarioDevolucao) : '',
            aluguel,
            aluguelFormatado: formatarMoeda(aluguel),
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
        valor: resumo.valorFormatado,
        frete: resumo.freteFormatado,
        endereco: {
            cep: form.cepDesconhecido ? '' : form.cep,
            ruaAvenida: form.ruaAvenida,
            numero: form.numero,
            complemento: form.complemento,
        },
        nomeContato: form.nomeCompleto,
        telefoneContato: form.telefoneContato,
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