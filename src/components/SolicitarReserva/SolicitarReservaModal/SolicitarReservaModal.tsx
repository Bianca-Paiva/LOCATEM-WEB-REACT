import { useEffect } from 'react';
import type { ProdutoSelecionado } from '../../../context/ProdutoContext';
import CalendarioDisponibilidade from '../../CadastroFerramenta/CalendarioDisponibilidade/CalendarioDisponibilidade';
import ProdutoResumoCard from '../ProdutoResumoCard/ProdutoResumoCard';
import CampoData from '../CampoData/CampoData';
import HorarioDropdown from '../HorarioDropdown/HorarioDropdown';
import SeletorQuantidade from '../../Inputs/SeletorQuantidade/SeletorQuantidade';
import { useSolicitarReservaModal } from '../../../hooks/Reservas/useSolicitarReservaModal';
import type { DadosReservaModal, ModoAberturaModal } from './SolicitarReservaModal.types';
import styles from './SolicitarReservaModal.module.css';

interface SolicitarReservaModalProps {
  aberto: boolean;
  produto: ProdutoSelecionado;
  /** Qual botão da página de detalhe abriu o modal — define o rótulo/ação do botão de confirmação */
  modo: ModoAberturaModal;
  /** Preenchimento inicial vindo da página de detalhe, se o usuário já tiver selecionado lá */
  quantidadeInicial?: number;
  dataEntregaInicial?: string;
  dataDevolucaoInicial?: string;
  /** Dias sem disponibilidade para este produto (vem do backend/mocks de agenda do locador) */
  diasIndisponiveis?: string[];
  onClose: () => void;
  /** modo === 'locar' */
  onContinuar: (dados: DadosReservaModal) => void;
  /** modo === 'carrinho' */
  onAdicionarCarrinho: (dados: DadosReservaModal) => void;
}

export default function SolicitarReservaModal({
  aberto,
  produto,
  modo,
  quantidadeInicial,
  dataEntregaInicial,
  dataDevolucaoInicial,
  diasIndisponiveis = [],
  onClose,
  onContinuar,
  onAdicionarCarrinho,
}: SolicitarReservaModalProps) {
  const {
    form,
    setCampo,
    selecionarDataCalendario,
    decrementarQuantidade,
    incrementarQuantidade,
    resumo,
    montarDadosReserva,
    dataMinimaEntrega,
  } = useSolicitarReservaModal({
    produto,
    quantidadeInicial,
    dataEntregaInicial,
    dataDevolucaoInicial,
  });

  // Fecha com a tecla Esc
  useEffect(() => {
    if (!aberto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [aberto, onClose]);

  if (!aberto) return null;

  // O calendário existente foi feito para o locador marcar dias indisponíveis
  // (onToggleDia dispara para qualquer dia clicável). Aqui reaproveitamos o
  // mesmo componente sem alterá-lo: ignoramos cliques em dias já indisponíveis
  // e usamos o callback para selecionar o período de entrega/devolução.
  const handleCliqueDia = (dataIso: string) => {
    if (diasIndisponiveis.includes(dataIso)) return;
    selecionarDataCalendario(dataIso);
  };

  const handleConfirmar = () => {
    if (!resumo.formularioCompleto) return;
    const dados = montarDadosReserva();
    if (modo === 'locar') onContinuar(dados);
    else onAdicionarCarrinho(dados);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Solicitar reserva">
      <div className={styles.overlayFundo} onClick={onClose} />

      <div className={styles.painel}>
        <div className={styles.cabecalho}>
          <h2 className={styles.titulo}>Solicitar Reserva</h2>
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

          <section className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Disponibilidade</h3>
            <CalendarioDisponibilidade
              diasIndisponiveis={diasIndisponiveis}
              onToggleDia={handleCliqueDia}
            />
          </section>

          <section className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Retirada e devolução</h3>
            <div className={styles.gridCampos}>
              <CampoData
                id="modalDataEntrega"
                label="Data de retirada"
                value={form.dataEntrega}
                min={dataMinimaEntrega}
                onChange={(valor) => setCampo('dataEntrega', valor)}
                required
              />
              <HorarioDropdown
                id="modalHorarioEntrega"
                label="Horário de retirada"
                value={form.horarioEntrega}
                onChange={(valor) => setCampo('horarioEntrega', valor)}
                required
              />
              <CampoData
                id="modalDataDevolucao"
                label="Data prevista de devolução"
                value={form.dataDevolucao}
                min={form.dataEntrega || dataMinimaEntrega}
                onChange={(valor) => setCampo('dataDevolucao', valor)}
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