import { useMemo } from 'react';
import { useAuth } from '../Auth/useAuth';
import { useCatalogoStore } from '../Ferramentas/useCatalogoStore';
import { useLocacaoStore } from '../Locacoes/useLocacaoStore';
import { paraDataBr } from '../../utils/Formatacao/formatoDataBr';
import { paraNumero } from '../../utils/Formatacao/valorMonetario';
import type { LocacaoData } from '../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import type {
  AgendaSemanaLocadorItem,
  ResumoHomeLocador,
  SolicitacaoRecenteLocador,
} from '../../pages/Home/HomeLocador.types';

/** Quantas ferramentas/solicitações/eventos a Home mostra em cada seção antes do "Ver Mais". */
const LIMITE_MINHAS_FERRAMENTAS = 5;
const LIMITE_SOLICITACOES_RECENTES = 4;
const LIMITE_AGENDA_SEMANA = 4;

// Locação paga, mas a ferramenta ainda está a caminho do locatário: a transportadora está de posse dela, indo buscar com o locador para entregar.
const STATUS_COLETA_PARA_ENTREGA: LocacaoData['status'][] = ['confirmada', 'preparandoEntrega', 'emTransporte'];
// Locação já usada pelo locatário: a transportadora já recolheu a ferramenta e está trazendo de volta ao locador.
const STATUS_RETORNO_AO_LOCADOR: LocacaoData['status'][] = ['aguardandoDevolucao', 'devolucaoEmTransporte'];

/**
 * Ordena da solicitação mais recente para a mais antiga. Os ids do mock são numéricos
 * sequenciais (criação = ordem crescente) e os criados em runtime usam o padrão
 * "r-<timestamp>" (ver useLocacaoStore/adicionarLocacao) — sempre maiores que qualquer
 * id do mock, então acabam corretamente à frente na ordenação sem precisar de um campo
 * de data de criação novo.
 */
function chaveRecencia(id: string): number {
  const numerico = Number(id);
  if (!Number.isNaN(numerico)) return numerico;
  const digitos = Number(id.replace(/\D/g, ''));
  return Number.isNaN(digitos) ? 0 : digitos;
}

/** Mesma checagem usada em FerramentaDetalhe.tsx para extrair o número de "R$ 45,00" -> 45. */
function valorLocacaoParaNumero(valor: string): number {
  return paraNumero(valor.replace('R$', '').trim());
}

function estaNoMes(dataBr: string | undefined, mes: number, ano: number): boolean {
  if (!dataBr) return false;
  const data = paraDataBr(dataBr);
  return !!data && data.getMonth() === mes && data.getFullYear() === ano;
}

/**
 * Reúne, calcula e formata todos os dados exibidos na Home do Locador — sempre a partir
 * das fontes já existentes no projeto (CatalogoStore, LocacaoStore, usuário autenticado),
 * nunca de mocks ou valores fixos próprios desta tela.
 */
export function useHomeLocador() {
  const { usuario } = useAuth();
  const { produtos } = useCatalogoStore();
  const { locacoes } = useLocacaoStore();

  // Mesmo filtro usado em MinhasFerramentas/GerenciarLocacoes: sempre pelo identificador único do locador, nunca pelo nome exibido em tela.
  const minhasFerramentas = useMemo(
    () => produtos.filter((p) => p.locadorId && p.locadorId === usuario?.locadorId),
    [produtos, usuario],
  );

  const minhasLocacoes = useMemo(
    () => locacoes.filter((l) => l.locadorId === usuario?.locadorId),
    [locacoes, usuario],
  );

  const resumo: ResumoHomeLocador = useMemo(() => {
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();
    const dataMesAnterior = new Date(anoAtual, mesAtual - 1, 1);
    const mesAnterior = dataMesAnterior.getMonth();
    const anoDoMesAnterior = dataMesAnterior.getFullYear();

    // Mesma definição de "receita" já usada em FerramentaDetalhe.tsx (soma do valor das locações finalizadas) — aqui restrita ao mês de referência.
    const faturamentoDoMes = (mes: number, ano: number) =>
      minhasLocacoes
        .filter((l) => l.status === 'finalizada' && estaNoMes(l.dataInicio, mes, ano))
        .reduce((total, l) => total + valorLocacaoParaNumero(l.valor), 0);

    return {
      ferramentasAtivas: minhasFerramentas.filter((p) => p.status !== 'indisponivel').length,
      ferramentasCadastradasEsteMes: minhasFerramentas.filter((p) =>
        estaNoMes(p.cadastradoEm, mesAtual, anoAtual),
      ).length,
      locacoesEmAndamento: minhasLocacoes.filter((l) => l.status === 'emAndamento').length,
      solicitacoesPendentes: minhasLocacoes.filter((l) => l.status === 'pendente').length,
      faturamentoMesAtual: faturamentoDoMes(mesAtual, anoAtual),
      faturamentoMesAnterior: faturamentoDoMes(mesAnterior, anoDoMesAnterior),
    };
  }, [minhasFerramentas, minhasLocacoes]);

  const solicitacoesRecentes: SolicitacaoRecenteLocador[] = useMemo(
    () => [...minhasLocacoes].sort((a, b) => chaveRecencia(b.id) - chaveRecencia(a.id)).slice(0, LIMITE_SOLICITACOES_RECENTES),
    [minhasLocacoes],
  );

  const agendaSemana: AgendaSemanaLocadorItem[] = useMemo(() => {
    const eventos: AgendaSemanaLocadorItem[] = [];

    minhasLocacoes.forEach((l) => {
      if (STATUS_COLETA_PARA_ENTREGA.includes(l.status)) {
        eventos.push({
          id: `${l.id}-coleta`,
          locacaoId: l.id,
          data: l.dataInicio,
          hora: l.horaInicio,
          ferramenta: l.produto,
          imagem: l.imagem,
          locatario: l.locatario,
          tipoMovimento: 'coletaParaEntrega',
        });
      }

      if (STATUS_RETORNO_AO_LOCADOR.includes(l.status)) {
        eventos.push({
          id: `${l.id}-retorno`,
          locacaoId: l.id,
          data: l.dataFim,
          hora: l.horaFim,
          ferramenta: l.produto,
          imagem: l.imagem,
          locatario: l.locatario,
          tipoMovimento: 'retornoAoLocador',
        });
      }
    });

    return eventos
      .sort((a, b) => (paraDataBr(a.data)?.getTime() ?? 0) - (paraDataBr(b.data)?.getTime() ?? 0))
      .slice(0, LIMITE_AGENDA_SEMANA);
  }, [minhasLocacoes]);

  const minhasFerramentasHome = useMemo(
    () => minhasFerramentas.slice(0, LIMITE_MINHAS_FERRAMENTAS),
    [minhasFerramentas],
  );

  return {
    usuario,
    resumo,
    solicitacoesRecentes,
    agendaSemana,
    minhasFerramentas: minhasFerramentasHome,
  };
}
