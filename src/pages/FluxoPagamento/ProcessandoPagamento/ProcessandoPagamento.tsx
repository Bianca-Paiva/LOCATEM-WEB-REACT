import { useProcessandoPagamento } from '../../../hooks/Pagamento/useProcessandoPagamento';
import type { Route } from '../../../router/useRouter';

import styles from './ProcessandoPagamento.module.css';

/* ============================================================
  Fluxo: Selecionar Cartão / Pix -> Processando Pagamento -> Pagamento Aprovado
============================================================ */

interface ProcessandoPagamentoProps {
  navigate: (route: Route) => void;
}

export default function ProcessandoPagamento({ navigate }: ProcessandoPagamentoProps) {
  const { metodoValido } = useProcessandoPagamento(navigate);

  // Método de pagamento ausente/inválido: o hook já disparou o redirecionamento para o Carrinho, então não há nada útil para renderizar aqui.
  if (!metodoValido) return null;

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <div className={styles.loadingSpinner} role="status" aria-label="Processando pagamento" />

        <div className={styles.processandoPagamento}>
          <h1>Processando pagamento...</h1>
          <p>Estamos finalizando sua transação. Por favor, aguarde um momento.</p>
        </div>
      </main>
    </div>
  );
}
