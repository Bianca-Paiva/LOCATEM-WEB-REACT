import Header from '../../components/Header/Header';
import ReservaAbas from '../../components/MinhasReservas/ReservaAbas/ReservaAbas';
import ReservaCard from '../../components/MinhasReservas/ReservaCard/ReservaCard';
import EstadoVazio from '../../components/MinhasReservas/EstadoVazio/EstadoVazio';
import { useMinhasReservas } from '../../hooks/MinhasReservas/useMinhasReservas';
import styles from './MinhasReservas.module.css';

import type { Route } from '../../router/useRouter';
import type { FiltroReserva } from './MinhasReservas.types';

interface MinhasReservasProps {
  navigate: (route: Route) => void;
}

// Texto exibido no estado vazio de cada aba
const ESTADO_VAZIO_TEXTO: Record<FiltroReserva, { titulo: string; descricao: string }> = {
  todas: {
    titulo: 'Nenhuma reserva por aqui',
    descricao: 'Assim que você solicitar uma locação, ela aparecerá nesta tela.',
  },
  pendente: {
    titulo: 'Nenhuma reserva pendente',
    descricao: 'Você não possui solicitações aguardando aprovação do locador.',
  },
  aprovada: {
    titulo: 'Nenhuma reserva aprovada',
    descricao: 'Assim que uma reserva for aprovada, ela aparecerá aqui.',
  },
  recusada: {
    titulo: 'Nenhuma reserva recusada',
    descricao: 'Você não possui solicitações recusadas pelo locador.',
  },
  cancelada: {
    titulo: 'Nenhuma reserva cancelada',
    descricao: 'Reservas canceladas por você ou pelo locador aparecerão aqui.',
  },
};

export default function MinhasReservas({ navigate }: MinhasReservasProps) {
  const { reservasFiltradas, filtro, setFiltro, contagem } = useMinhasReservas();

  const handleVerDetalhes = (id: string) => {
    // Integre aqui com a tela de detalhes da reserva.
    console.log('Ver detalhes da reserva', id);
  };

  const estadoVazio = ESTADO_VAZIO_TEXTO[filtro];

  return (
    <>
      <Header navigate={navigate} currentRoute="minhasReservas" />

      <main className={styles.pagina}>
        <div className={styles.cabecalho}>
          <h1 className={styles.titulo}>Minhas Reservas</h1>
          <p className={styles.subtitulo}>Acompanhe todas as suas solicitações de reserva.</p>
        </div>

        <ReservaAbas filtro={filtro} onChange={setFiltro} contagem={contagem} />

        {reservasFiltradas.length === 0 ? (
          <EstadoVazio titulo={estadoVazio.titulo} descricao={estadoVazio.descricao} />
        ) : (
          <div className={styles.lista}>
            {reservasFiltradas.map((reserva) => (
              <ReservaCard key={reserva.id} reserva={reserva} onVerDetalhes={handleVerDetalhes} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
