import { useEffect } from 'react';
import Header from '../../../components/Header/Header';
import EtiquetaStatus from '../../../components/MinhasReservas/EtiquetaStatus/EtiquetaStatus';
import ReservaResumoCard from '../../../components/DetalhesReserva/ReservaResumoCard/ReservaResumoCard';
import PainelStatusReserva from '../../../components/DetalhesReserva/PainelStatusReserva/PainelStatusReserva';
import AcoesReserva from '../../../components/DetalhesReserva/AcoesReserva/AcoesReserva';
import { useReservaStore } from '../../../hooks/Reservas/useReservaStore';
import styles from './DetalhesReserva.module.css';

import type { Route } from '../../../router/useRouter';

interface DetalhesReservaProps {
  navigate: (route: Route) => void;
}

export default function DetalhesReserva({ navigate }: DetalhesReservaProps) {
  const { reservaSelecionada } = useReservaStore();

  // Sem reserva selecionada (ex: acesso direto à rota), volta para a listagem.
  useEffect(() => {
    if (!reservaSelecionada) {
      navigate('minhasReservas');
    }
  }, [reservaSelecionada, navigate]);

  if (!reservaSelecionada) {
    return null;
  }

  const { status, motivoRecusa } = reservaSelecionada;

  const handleCancelarSolicitacao = () => {
    // Integre aqui com a chamada de cancelamento da solicitação.
    navigate('minhasReservas');
  };

  const handleVerLocacoes = () => {
    // Integre aqui com a tela de locações do usuário.
    navigate('minhasReservas');
  };

  const handleProsseguirAluguel = () => {
    // Integre aqui com o fluxo de pagamento/retirada.
  };

  const handleVoltarReservas = () => {
    navigate('minhasReservas');
  };

  const handleSolicitarNovaReserva = () => {
    // Integre aqui com a tela de busca/produto para uma nova solicitação.
    navigate('busca');
  };

  return (
    <>
      <Header navigate={navigate} currentRoute="minhasReservas" />

      <main className={styles.pagina}>
        <div className={styles.cabecalho}>
          <h1 className={styles.titulo}>Detalhes da Reserva</h1>
          <EtiquetaStatus status={status} />
        </div>

        <ReservaResumoCard reserva={reservaSelecionada} />

        <PainelStatusReserva status={status} motivoRecusa={motivoRecusa} />

        <AcoesReserva
          status={status}
          onCancelarSolicitacao={handleCancelarSolicitacao}
          onVerLocacoes={handleVerLocacoes}
          onProsseguirAluguel={handleProsseguirAluguel}
          onVoltarReservas={handleVoltarReservas}
          onSolicitarNovaReserva={handleSolicitarNovaReserva}
        />
      </main>
    </>
  );
}
