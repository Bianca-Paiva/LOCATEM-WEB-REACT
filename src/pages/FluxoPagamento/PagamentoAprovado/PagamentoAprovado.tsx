import { Icon } from '@iconify/react';

import BtnPrincipal from '../../../components/BtnPrincipal/BtnPrincipal';

import { usePagamentoAprovado } from '../../../hooks/Pagamento/usePagamentoAprovado';
import type { Route } from '../../../router/useRouter';

import styles from './PagamentoAprovado.module.css';

/* ============================================================
  Fluxo: Processando Pagamento -> Pagamento Aprovado
============================================================ */

interface PagamentoAprovadoProps {
  navigate: (route: Route) => void;
}

const formatarPreco = (valor: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

export default function PagamentoAprovado({ navigate }: PagamentoAprovadoProps) {
  const {
    acessoValido,
    total,
    metodoFormatado,
    dataHora,
    nomeUsuario,
    produtos,
    verDetalhesDoAluguel,
    voltarParaInicio,
  } = usePagamentoAprovado(navigate);

  // Acesso direto/indevido (sem passar por "Processando Pagamento"): o hook já disparou o redirecionamento para o Carrinho, então não há nada útil para renderizar aqui.
  if (!acessoValido) return null;

  return (
    <main className={styles.paymentSuccess}>
      <section className={styles.hero}>
        <div className={styles.successIcon}>
          <Icon
            icon="fa6-solid:circle-check"
            className={styles.iconeConcluido}
            aria-hidden="true"
          />
        </div>

        <h1 className={styles.heroTitle}>Pagamento aprovado com sucesso</h1>
        <p className={styles.heroSubtitle}>Sua transação foi processada.</p>
        <p className={styles.heroPrice}>{formatarPreco(total)}</p>

        <div className={styles.heroDivider} />
      </section>

      <section className={styles.content}>
        <div className={styles.pickupAlert}>
          <div className={styles.alertIcon}>
            <Icon
              icon="fa6-solid:circle-info"
              width="20"
              height="20"
              style={{ color: '#1B6D24' }}
              aria-hidden="true"
            />
          </div>
          <p>Seu aluguel será entregue em até 3 horas.</p>
        </div>

        <div className={styles.detailsList}>
          {nomeUsuario && (
            <div className={styles.detailRow}>
              <span className={styles.label}>Usuário</span>
              <span className={styles.value}>{nomeUsuario}</span>
            </div>
          )}

          <div className={styles.detailRow}>
            <span className={styles.label}>Método de pagamento</span>
            <span className={styles.value}>{metodoFormatado}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Data e Hora</span>
            <span className={styles.value}>{dataHora}</span>
          </div>
        </div>

        {produtos.length > 0 && (
          <div className={styles.listaProdutos}>
            {produtos.map((produto) => {
              const labelUnid = produto.unidades === 1 ? 'unidade' : 'unidades';
              const labelDia = produto.dias === 1 ? 'dia' : 'dias';

              return (
                <article key={produto.id} className={styles.productCard}>
                  <img src={produto.imagem} alt={produto.nome} />
                  <div className={styles.productInfo}>
                    <h2>{produto.nome}</h2>
                    <p>
                      Quantidade: {produto.unidades} {labelUnid} • Locação: {produto.dias} {labelDia}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className={styles.actions}>
          <BtnPrincipal text="Ver detalhes do aluguel" onClick={verDetalhesDoAluguel} />

          <button type="button" className={styles.btnLink} onClick={voltarParaInicio}>
            Voltar para a página inicial
          </button>
        </div>
      </section>
    </main>
  );
}
