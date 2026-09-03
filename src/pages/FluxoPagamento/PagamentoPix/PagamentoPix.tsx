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
  const { total, metodoValido, copiado, copiarCodigo, prazoPagamento, tempoRestanteSegundos, gerarNovoCodigo } = usePagamentoPix(navigate);
  
  // Variável de mock estática para testar a leitura do QR Code
  const payloadPixMock = "00020101021126530014br.gov.bcb.pix0114+55119956921560213Teste LOCATEM52040000530398654040.015802BR5914BIANCA S PAIVA6009SAO PAULO62070503***63048BF9";

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
              tempoRestanteSegundos={tempoRestanteSegundos}
              mostrarSeguro
            />
          }
        >
          <PagamentoPixCard 
            codigoPix={payloadPixMock} // Substituímos a variável do hook pelo mock
            copiado={copiado} 
            expirado={prazoPagamento.expirado}
            onGerarNovoQrCode={gerarNovoCodigo}
            onCopiarCodigo={() => {
              // Forçamos a cópia do mock para a área de transferência
              navigator.clipboard.writeText(payloadPixMock);
              // Chamamos a função do hook apenas para acionar o efeito visual de "Copiado!" (verde)
              copiarCodigo();
            }} 
          />
        </CheckoutLayout>
      </main>
    </>
  );
}