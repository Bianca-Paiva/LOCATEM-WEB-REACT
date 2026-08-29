import { useEffect, useState } from 'react';
import type { ProdutoSelecionado } from '../../../context/ProdutoContext';
import ProdutoResumoCard from '../ProdutoResumoCard/ProdutoResumoCard';
import CampoData from '../CampoData/CampoData';
import HorarioDropdown from '../HorarioDropdown/HorarioDropdown';
import SeletorQuantidade from '../../Inputs/SeletorQuantidade/SeletorQuantidade';
import { useSolicitarLocacaoModal } from '../../../hooks/Locacoes/useSolicitarLocacaoModal';
import type { DadosLocacaoModal, ModoAberturaModal } from './SolicitarLocacaoModal.types';
import styles from './SolicitarLocacaoModal.module.css';

interface SolicitarLocacaoModalProps {
  aberto: boolean;
  produto: ProdutoSelecionado;
  /** Qual botão da página de detalhe abriu o modal — define o rótulo/ação do botão de confirmação */
  modo: ModoAberturaModal;
  /** Preenchimento inicial vindo da página de detalhe, se o usuário já tiver selecionado lá */
  quantidadeInicial?: number;
  /** Diárias já escolhidas na página do produto (ex: "3 unidades + 2 diárias" -> 2) */
  duracaoInicial?: number;
  dataEntregaInicial?: string;
  dataDevolucaoInicial?: string;
  /** Voltagem/alimentação escolhida na página do produto, exibida no resumo */
  tensaoSelecionada?: string | null;
  /** Dias sem disponibilidade para este produto. Se omitido, usa `produto.diasIndisponiveis` */
  diasIndisponiveis?: string[];
  onClose: () => void;
  /** modo === 'locar' */
  onContinuar: (dados: DadosLocacaoModal) => void;
  /** modo === 'carrinho' */
  onAdicionarCarrinho: (dados: DadosLocacaoModal) => void;
}

export default function SolicitarLocacaoModal({
  aberto,
  produto,
  modo,
  quantidadeInicial,
  duracaoInicial,
  dataEntregaInicial,
  dataDevolucaoInicial,
  tensaoSelecionada,
  diasIndisponiveis: diasIndisponiveisProp,
  onClose,
  onContinuar,
  onAdicionarCarrinho,
}: SolicitarLocacaoModalProps) {

  const {
    form,
    setCampo,
    selecionarDataEntrega,
    selecionarDataDevolucao,
    decrementarQuantidade,
    incrementarQuantidade,
    resumo,
    montarDadosLocacao,
    dataMinimaEntrega,
    dataMinimaDevolucao,
  } = useSolicitarLocacaoModal({
    produto,
    quantidadeInicial,
    duracaoInicial,
    dataEntregaInicial,
    dataDevolucaoInicial,
    aberto,
  });

  // Datas indisponíveis/locadas exibidas no calendário — usa a lista
  // explícita, se vier, senão cai para a do próprio produto.
  const diasIndisponiveis = diasIndisponiveisProp ?? produto.diasIndisponiveis ?? [];

  // Controla qual dos dois popovers de calendário (entrega/devolução) está
  // aberto — nunca os dois ao mesmo tempo.
  const [campoDataAberto, setCampoDataAberto] = useState<'entrega' | 'devolucao' | null>(null);

  // Fecha com a tecla Esc
  useEffect(() => {
    if (!aberto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (campoDataAberto) setCampoDataAberto(null);
        else onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [aberto, campoDataAberto, onClose]);

  if (!aberto) return null;

  const handleSelecionarEntrega = (dataIso: string) => {
    selecionarDataEntrega(dataIso);
    // Se já existe uma duração de diárias vinda da página do produto, a
    // devolução já foi preenchida automaticamente — só falta fechar. Senão,
    // avança o popover para a devolução para o usuário já escolher.
    setCampoDataAberto(duracaoInicial && duracaoInicial > 0 ? null : 'devolucao');
  };

  const handleSelecionarDevolucao = (dataIso: string) => {
    selecionarDataDevolucao(dataIso);
    setCampoDataAberto(null);
  };

  const handleConfirmar = () => {
    if (!resumo.formularioCompleto) return;
    const dados = montarDadosLocacao();
    if (modo === 'locar') onContinuar(dados);
    else onAdicionarCarrinho(dados);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Detalhes da Locação">
      <div className={styles.overlayFundo} onClick={onClose} />

      <div className={styles.painel}>
        <div className={styles.cabecalho}>
          <h2 className={styles.titulo}>Detalhes da Locação</h2>
          <button
            type="button"
            className={styles.botaoFechar}
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className={styles.conteudo}>
          <ProdutoResumoCard produto={produto} />

          {produto.tipoAprovacao === 'manual' && (
            <p className={styles.avisoAprovacao}>
              Este locador aprova manualmente as solicitações — ele tem até 24h para
              responder, por isso a primeira retirada disponível já considera esse prazo.
            </p>
          )}

          <section className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Entrega e devolução</h3>
            <div className={styles.gridCampos}>
              <CampoData
                id="modalDataEntrega"
                label="Data de entrega"
                value={form.dataEntrega}
                min={dataMinimaEntrega}
                diasIndisponiveis={diasIndisponiveis}
                dataEntrega={form.dataEntrega}
                dataDevolucao={form.dataDevolucao}
                onChange={handleSelecionarEntrega}
                aberto={campoDataAberto === 'entrega'}
                onAbrir={() => setCampoDataAberto('entrega')}
                onFechar={() => setCampoDataAberto((atual) => (atual === 'entrega' ? null : atual))}
                required
              />
              <HorarioDropdown
                id="modalHorarioEntrega"
                label="Horário de entrega"
                value={form.horarioEntrega}
                onChange={(valor) => setCampo('horarioEntrega', valor)}
                required
              />
              <CampoData
                id="modalDataDevolucao"
                label="Data de devolução"
                value={form.dataDevolucao}
                min={dataMinimaDevolucao}
                diasIndisponiveis={diasIndisponiveis}
                dataEntrega={form.dataEntrega}
                dataDevolucao={form.dataDevolucao}
                onChange={handleSelecionarDevolucao}
                aberto={campoDataAberto === 'devolucao'}
                onAbrir={() => setCampoDataAberto('devolucao')}
                onFechar={() => setCampoDataAberto((atual) => (atual === 'devolucao' ? null : atual))}
                alinharPopover="direita"
                required
              />
              <HorarioDropdown
                id="modalHorarioDevolucao"
                label="Horário de devolução"
                value={form.horarioDevolucao}
                onChange={(valor) => setCampo('horarioDevolucao', valor)}
                required
              />
            </div>

            {!resumo.periodoValido && form.dataEntrega && form.dataDevolucao && (
              <p className={styles.erroPeriodo}>
                A data de devolução deve ser posterior à data de retirada.
              </p>
            )}
          </section>

          <section className={styles.bloco}>
            <SeletorQuantidade
              quantidade={form.quantidade}
              estoqueDisponivel={produto.estoqueDisponivel}
              onDecrementar={decrementarQuantidade}
              onIncrementar={incrementarQuantidade}
            />
          </section>

          <section className={styles.resumo}>
            <h3 className={styles.blocoTitulo}>Resumo da locação</h3>
            <div className={styles.linhaResumo}>
              <span>Período</span>
              <span>
                {resumo.periodoValido
                  ? `${resumo.dataEntregaFormatada} - ${resumo.dataDevolucaoFormatada} (${resumo.diarias} ${resumo.diarias === 1 ? 'diária' : 'diárias'})`
                  : 'Selecione um período válido'}
              </span>
            </div>
            <div className={styles.linhaResumo}>
              <span>Quantidade</span>
              <span>{resumo.quantidadeFormatada}</span>
            </div>
            {tensaoSelecionada && (
              <div className={styles.linhaResumo}>
                <span>Voltagem/alimentação</span>
                <span>{tensaoSelecionada}</span>
              </div>
            )}
            <div className={styles.linhaResumo}>
              <span>Aluguel</span>
              <span>{resumo.aluguelFormatado}</span>
            </div>
            <div className={styles.linhaResumo}>
              <span>Frete estimado</span>
              <span>{resumo.freteFormatado}</span>
            </div>
            <div className={styles.linhaResumoDestaque}>
              <span>Valor estimado</span>
              <span>{resumo.valorFormatado}</span>
            </div>
          </section>
        </div>

        <div className={styles.acoes}>
          <button type="button" className={styles.botaoSecundario} onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className={styles.botaoPrimario}
            onClick={handleConfirmar}
            disabled={!resumo.formularioCompleto}
          >
            {modo === 'locar' ? 'Continuar' : 'Adicionar ao carrinho'}
          </button>
        </div>
      </div>
    </div>
  );
}
