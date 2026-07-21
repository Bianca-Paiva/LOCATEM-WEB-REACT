import checkIcon from '../../../assets/checkIcon.png';
import styles from './SolicitacaoEnviada.module.css';

import type { Route } from '../../../router/useRouter';

interface SolicitacaoEnviadaProps {
  navigate: (route: Route) => void;
}

export default function SolicitacaoEnviada({ navigate }: SolicitacaoEnviadaProps) {
  const handleVerMinhasReservas = () => {
    navigate('minhasReservas');
  };

  const handleVoltarAoInicio = () => {
    navigate('home');
  };

  return (
    <main className={styles.pagina}>
      <div className={styles.conteudo}>
        <div className={styles.iconeCirculo}>
          <img src={checkIcon} alt="" className={styles.icone} />
        </div>

        <h1 className={styles.titulo}>Solicitação enviada!</h1>
        <p className={styles.descricao}>
          Sua solicitação de reserva foi enviada ao locador. Agora basta aguardar a análise.
        </p>

        <div className={styles.aviso}>
          <span className={styles.avisoIcone}>i</span>
          <p>Você será notificado quando houver uma resposta.</p>
        </div>

        <div className={styles.acoes}>
          <button type="button" className={styles.botaoPrimario} onClick={handleVerMinhasReservas}>
            Ver minhas reservas
          </button>
          <button type="button" className={styles.botaoSecundario} onClick={handleVoltarAoInicio}>
            Voltar ao início
          </button>
        </div>
      </div>
    </main>
  );
}
