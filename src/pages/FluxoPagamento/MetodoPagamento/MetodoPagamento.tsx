import Header from '../../../components/Header/Header';
import CabecalhoPagina from '../../../components/CabecalhoPagina/CabecalhoPagina';
import { ResumoPedido } from '../../../components/Carrinho/Resumo/ResumoPedido/ResumoPedido';
import { SeletorFormaPagamento } from '../../../components/Pagamento/SeletorFormaPagamento/SeletorFormaPagamento';

import { useMetodoPagamento } from '../../../hooks/Pagamento/useMetodoPagamento';
import type { Route } from '../../../router/useRouter';

import styles from './MetodoPagamento.module.css';

/* ============================================================
   Tela "Método de Pagamento"
   Fluxo: Carrinho -> Método de Pagamento -> Selecionar Cartão (crédito/débito) ou Pix
============================================================ */

interface MetodoPagamentoProps {
  navigate: (route: Route) => void;
}

export default function MetodoPagamento({ navigate }: MetodoPagamentoProps) {
  const {
    total,
    formaSelecionada,
    selecionarForma,
    continuarPagamento,
  } = useMetodoPagamento(navigate);

  return (
    <>
      <Header navigate={navigate} currentRoute="carrinho" />

      <main className={styles.pagina}>
        <CabecalhoPagina titulo="Escolha como Pagar" />

        <div className={styles.container}>
          <SeletorFormaPagamento
            selecionado={formaSelecionada}
            onSelecionar={selecionarForma}
          />

          <ResumoPedido
            variant="metodoPagamento"
            total={total}
            ctaLabel="Continuar Pagamento"
            onCtaClick={continuarPagamento}
            ctaDisabled={!formaSelecionada}
            mostrarSeguro
          />
        </div>

      </main>
    </>
  );
}
