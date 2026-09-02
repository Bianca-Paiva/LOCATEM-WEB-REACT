import Header from '../../../components/Header/Header';
import CabecalhoPagina from '../../../components/CabecalhoPagina/CabecalhoPagina';
import { CheckoutLayout } from '../../../components/Carrinho/Resumo/CheckoutLayout/CheckoutLayout';
import { ResumoPedido } from '../../../components/Carrinho/Resumo/ResumoPedido/ResumoPedido';
import { PagamentoPixCard } from '../../../components/Pagamento/PagamentoPixCard/PagamentoPixCard';

import { usePagamentoPix } from '../../../hooks/Pagamento/usePagamentoPix';
import type { Route } from '../../../router/useRouter';

import styles from './PagamentoPix.module.css';

/* ============================================================
   Tela "Pagamento via Pix"
   Fluxo: Carrinho -> Método de Pagamento -> Pix
============================================================ */

interface PagamentoPixProps {
  navigate: (route: Route) => void;
}

export default function PagamentoPix({ navigate }: PagamentoPixProps) {
  const { total, metodoValido, codigoPix, copiado, copiarCodigo, prazoPagamento } = usePagamentoPix(navigate);

  // Método ausente/inválido: o hook já disparou o redirecionamento para o Carrinho, então não há nada útil para renderizar aqui.
  if (!metodoValido) return null;

  return (
    <>
      <Header navigate={navigate} currentRoute="carrinho" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo="Pagamento com Pix"
          subtitulo="Escaneie o QR Code ou copie o código para pagar."
        />

        <CheckoutLayout
          aside={
            <ResumoPedido
              variant="pagamento"
              total={total}
              prazoPagamento={prazoPagamento}
              mostrarSeguro
            />
          }
        >
          <PagamentoPixCard codigoPix={codigoPix} copiado={copiado} onCopiarCodigo={copiarCodigo} />
        </CheckoutLayout>
      </main>
    </>
  );
}
