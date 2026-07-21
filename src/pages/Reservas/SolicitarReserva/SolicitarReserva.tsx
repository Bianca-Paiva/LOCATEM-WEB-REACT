import { useEffect } from 'react';
import Header from '../../../components/Header/Header';
import ProdutoResumoCard from '../../../components/SolicitarReserva/ProdutoResumoCard/ProdutoResumoCard';
import CampoData from '../../../components/SolicitarReserva/CampoData/CampoData';
import HorarioDropdown from '../../../components/SolicitarReserva/HorarioDropdown/HorarioDropdown';
import SeletorQuantidade from '../../../components/SolicitarReserva/SeletorQuantidade/SeletorQuantidade';
import ResumoReserva from '../../../components/SolicitarReserva/ResumoReserva/ResumoReserva';
import { useProdutoStore } from '../../../hooks/useProdutoStore';
import { useReservaStore } from '../../../hooks/Reservas/useReservaStore';
import { useSolicitarReserva } from '../../../hooks/Reservas/useSolicitarReserva';
import styles from './SolicitarReserva.module.css';

import type { Route } from '../../../router/useRouter';
import type { ProdutoSelecionado } from '../../../context/ProdutoContext';

interface SolicitarReservaProps {
  navigate: (route: Route) => void;
}

// Produto vazio usado apenas para satisfazer o hook enquanto o redirect (useEffect) não dispara
const PRODUTO_VAZIO: ProdutoSelecionado = {
  title: '',
  brand: '',
  price: '0',
  images: [],
  imageVerificado: '',
  imageNota: '',
  rating: 0,
  reviewCount: 0,
  locador: '',
  localizacao: '',
  categoria: '',
  estoqueDisponivel: 1,
};

export default function SolicitarReserva({ navigate }: SolicitarReservaProps) {
  const { produtoSelecionado } = useProdutoStore();
  const { adicionarReserva } = useReservaStore();

  // Sem produto selecionado (ex: acesso direto à rota), volta para a busca.
  useEffect(() => {
    if (!produtoSelecionado) {
      navigate('busca');
    }
  }, [produtoSelecionado, navigate]);

  const produto = produtoSelecionado ?? PRODUTO_VAZIO;

  const {
    form,
    setCampo,
    decrementarQuantidade,
    incrementarQuantidade,
    resumo,
    montarDadosReserva,
  } = useSolicitarReserva({ produto });

  if (!produtoSelecionado) {
    return null;
  }

  const handleCancelar = () => {
    navigate('produtoDetalhe');
  };

  const handleEnviarSolicitacao = () => {
    if (!resumo.periodoValido) return;

    adicionarReserva(montarDadosReserva());
    navigate('solicitacaoEnviada');
  };

  return (
    <>
      <Header navigate={navigate} currentRoute="home" />

      <main className={styles.pagina}>
        <div className={styles.cabecalho}>
          <h1 className={styles.titulo}>Solicitar Reserva</h1>
          <p className={styles.subtitulo}>
            Preencha as informações abaixo para solicitar a reserva desta ferramenta.
          </p>
        </div>

        <ProdutoResumoCard produto={produto} />

        <div className={styles.gridCampos}>
          <CampoData
            id="dataEntrega"
            label="Data de entrega"
            value={form.dataEntrega}
            onChange={(valor) => setCampo('dataEntrega', valor)}
          />
          <HorarioDropdown
            id="horarioEntrega"
            label="Horário da entrega"
            value={form.horarioEntrega}
            onChange={(valor) => setCampo('horarioEntrega', valor)}
          />
          <CampoData
            id="dataDevolucao"
            label="Data prevista da devolução"
            value={form.dataDevolucao}
            min={form.dataEntrega}
            onChange={(valor) => setCampo('dataDevolucao', valor)}
          />
          <HorarioDropdown
            id="horarioDevolucao"
            label="Horário da devolução"
            value={form.horarioDevolucao}
            onChange={(valor) => setCampo('horarioDevolucao', valor)}
          />

          <SeletorQuantidade
            quantidade={form.quantidade}
            estoqueDisponivel={produto.estoqueDisponivel}
            onDecrementar={decrementarQuantidade}
            onIncrementar={incrementarQuantidade}
          />

          {!resumo.periodoValido && (
            <p className={styles.erroPeriodo}>
              A data de devolução deve ser posterior à data de entrega.
            </p>
          )}
        </div>

        <ResumoReserva resumo={resumo} />

        <div className={styles.acoes}>
          <button type="button" className={styles.botaoSecundario} onClick={handleCancelar}>
            Cancelar
          </button>
          <button
            type="button"
            className={styles.botaoPrimario}
            onClick={handleEnviarSolicitacao}
            disabled={!resumo.periodoValido}
          >
            Enviar solicitação
          </button>
        </div>
      </main>
    </>
  );
}
