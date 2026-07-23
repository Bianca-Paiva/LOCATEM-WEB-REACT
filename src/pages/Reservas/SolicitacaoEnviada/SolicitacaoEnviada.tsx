import { useEffect } from 'react';
import checkIcon from '../../../assets/checkIcon.png';
import ResumoSolicitacaoCard from '../../../components/SolicitacaoEnviada/ResumoSolicitacaoCard/ResumoSolicitacaoCard';
import { useReservaStore } from '../../../hooks/Reservas/useReservaStore';
import styles from './SolicitacaoEnviada.module.css';

import type { Route } from '../../../router/useRouter';

interface SolicitacaoEnviadaProps {
  navigate: (route: Route) => void;
}

export default function SolicitacaoEnviada({ navigate }: SolicitacaoEnviadaProps) {
  const { reservaSelecionada } = useReservaStore();

  // Sem reserva selecionada (ex: acesso direto à rota), volta para a busca.
  useEffect(() => {
    if (!reservaSelecionada) {
      navigate('home');
    }
  }, [reservaSelecionada, navigate]);

  const handleVerMinhasReservas = () => {
    navigate('minhasReservas');
  };

  const handleVoltarAoInicio = () => {
    navigate('home');
  };

  if (!reservaSelecionada) {
    return null;
  }

  return (
    <main className={styles.pagina}>
      <div className={styles.conteudo}>
        <div className={styles.iconeCirculo}>
          <img src={checkIcon} alt="" className={styles.icone} />
        </div>

        <h1 className={styles.titulo}>Solicitação enviada!</h1>
        <p className={styles.descricao}>
          O locador analisará sua solicitação e você será notificado assim que ela for aceita ou recusada.
        </p>

        <div className={styles.aviso}>
          <span className={styles.avisoIcone}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
            </svg>
          </span>
          <p>O locador tem até 24 horas para responder.</p>
        </div>

        <ResumoSolicitacaoCard reserva={reservaSelecionada} />

        <div className={styles.acoes}>
          <button type="button" className={styles.botaoPrimario} onClick={handleVerMinhasReservas}>
            Ir para Minhas Reservas
          </button>
          <button type="button" className={styles.botaoSecundario} onClick={handleVoltarAoInicio}>
            Voltar ao início
          </button>
        </div>
      </div>
    </main>
  );
}
