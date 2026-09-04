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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className={styles.iconeConcluido}
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
          </svg>
        </div>

        <h1 className={styles.heroTitle}>Pagamento aprovado com sucesso</h1>
        <p className={styles.heroSubtitle}>Sua transação foi processada.</p>
        <p className={styles.heroPrice}>{formatarPreco(total)}</p>

        <div className={styles.heroDivider} />
      </section>

      <section className={styles.content}>
        <div className={styles.pickupAlert}>
          <div className={styles.alertIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 15H11V9H9V15ZM10 7C10.2833 7 10.5208 6.90417 10.7125 6.7125C10.9042 6.52083 11 6.28333 11 6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6C9 6.28333 9.09583 6.52083 9.2875 6.7125C9.47917 6.90417 9.71667 7 10 7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z"
                fill="#1B6D24"
              />
            </svg>
          </div>
          <p>Seu aluguel será entregue em até 2 horas.</p>
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
