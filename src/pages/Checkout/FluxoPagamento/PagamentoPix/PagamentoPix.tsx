import Header from '../../../../components/Layout/Header/Header';
import CabecalhoPagina from '../../../../components/Layout/CabecalhoPagina/CabecalhoPagina';
import { CheckoutLayout } from '../../../../components/Checkout/Carrinho/Resumo/CheckoutLayout/CheckoutLayout';
import { ResumoPedido } from '../../../../components/Checkout/Carrinho/Resumo/ResumoPedido/ResumoPedido';
import { PagamentoPixCard } from '../../../../components/Checkout/Pagamento/PagamentoPixCard/PagamentoPixCard';

import { usePagamentoPix } from '../../../../hooks/Checkout/Pagamento/usePagamentoPix';
import type { Route } from '../../../../router/useRouter';

import styles from './PagamentoPix.module.css';

/* ============================================================
  Fluxo: Carrinho -> Método de Pagamento -> Pix
============================================================ */

interface PagamentoPixProps {
  navigate: (route: Route) => void;
}

export default function PagamentoPix({ navigate }: PagamentoPixProps) {
  const {
    total,
    metodoValido,
    copiado,
    copiarCodigo,
    prazoPagamento,
    tempoRestanteSegundos,
    gerarNovoCodigo,
    confirmarPagamento,
    codigoPix,
  } = usePagamentoPix(navigate);



  if (!metodoValido) return null;

  if (!codigoPix) {
    return (
      <>
        <Header navigate={navigate} currentRoute="carrinho" />
        <main className={styles.pagina}>
          <CabecalhoPagina
            titulo="Pagamento com Pix"
            subtitulo="A integração de pagamento via Pix ainda não está disponível."
          />
          <CheckoutLayout
            aside={
              <ResumoPedido
                variant="pagamento"
                total={total}
                prazoPagamento={prazoPagamento}
                tempoRestanteSegundos={tempoRestanteSegundos}
                mostrarSeguro
              />
            }
          >
            <p style={{ padding: '2rem', textAlign: 'center' }}>Pagamento via Pix indisponível: o LOCATEM não usa mais dados simulados nesta etapa.</p>
          </CheckoutLayout>
        </main>
      </>
    );
  }

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
              tempoRestanteSegundos={tempoRestanteSegundos}
              ctaLabel="Já efetuei o pagamento"
              onCtaClick={confirmarPagamento}
              ctaDisabled={prazoPagamento.expirado}
              mostrarSeguro
            />
          }
        >
          <PagamentoPixCard
            codigoPix={codigoPix}
            copiado={copiado}
            expirado={prazoPagamento.expirado}
            onGerarNovoQrCode={gerarNovoCodigo}
            onCopiarCodigo={copiarCodigo}
          />
        </CheckoutLayout>
      </main>
    </>
  );
}