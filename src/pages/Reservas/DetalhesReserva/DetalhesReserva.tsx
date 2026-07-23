import { useEffect } from 'react';
import Header from '../../../components/Header/Header';
import CabecalhoPagina from '../../../components/CabecalhoPagina/CabecalhoPagina';
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
  const { reservaSelecionada, atualizarReserva } = useReservaStore();

  // Sem reserva selecionada (ex: acesso direto à rota), volta para a listagem.
  useEffect(() => {
    if (!reservaSelecionada) {
      navigate('minhasReservas');
    }
  }, [reservaSelecionada, navigate]);

  if (!reservaSelecionada) {
    return null;
  }

  const { status, motivoRecusa, motivoCancelamento, horaInicio, horaFim } = reservaSelecionada;

  const handleCancelarSolicitacao = () => {
    const mensagem = 'Esta reserva foi cancelada por você.';
    atualizarReserva(reservaSelecionada.id, {
      status: 'cancelada',
      mensagemStatus: mensagem,
      motivoCancelamento: mensagem,
    });
  }

  const handleVerLocacoes = () => {
    // Integrar aqui com a tela de locações do usuário.
    navigate('minhasReservas');
  };

  const handleProsseguirAluguel = () => {
    // Integrar aqui com o fluxo de pagamento/retirada.
  };

  const handleVoltarReservas = () => {
    navigate('minhasReservas');
  };

  const handleAvaliacao = () => {
    // A reserva finalizada já está em `reservaSelecionada` (contexto), então a
    // página de Avaliação consegue montar a ferramenta de avaliação com os
    // dados dela assim que a rota mudar.
    navigate('avaliacao');
  };

  const handleSolicitarNovaReserva = () => {
    // Integrar aqui com a tela de busca/produto para uma nova solicitação.
    navigate('busca');
  };

  return (
    <>
      <Header navigate={navigate} currentRoute="minhasReservas" />

      <main className={styles.pagina}>
        <CabecalhoPagina titulo="Detalhes da Reserva" acao={<EtiquetaStatus status={status} />} />

        <ReservaResumoCard reserva={reservaSelecionada} />

        <PainelStatusReserva
          status={status}
          motivoRecusa={motivoRecusa}
          motivoCancelamento={motivoCancelamento}
          horaInicio={horaInicio}
          horaFim={horaFim}
        />

        <AcoesReserva
          status={status}
          onCancelarSolicitacao={handleCancelarSolicitacao}
          onVerLocacoes={handleVerLocacoes}
          onAvaliacao={handleAvaliacao}
          onProsseguirAluguel={handleProsseguirAluguel}
          onVoltarReservas={handleVoltarReservas}
          onSolicitarNovaReserva={handleSolicitarNovaReserva}
        />
      </main>
    </>
  );
}