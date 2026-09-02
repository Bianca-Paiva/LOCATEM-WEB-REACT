import type { ReactNode } from 'react';
import { CreditCard, Landmark, QrCode } from 'lucide-react';

import type { FormaPagamento } from '../../../types/cartao.types';

import styles from './SeletorFormaPagamento.module.css';

interface Opcao {
  id: FormaPagamento;
  label: string;
  icone: ReactNode;
}

const OPCOES: Opcao[] = [
  { id: 'credito', label: 'Cartão de Crédito', icone: <CreditCard size={18} aria-hidden="true" /> },
  { id: 'debito', label: 'Cartão de Débito', icone: <Landmark size={18} aria-hidden="true" /> },
  { id: 'pix', label: 'PIX', icone: <QrCode size={18} aria-hidden="true" /> },
];

interface SeletorFormaPagamentoProps {
  /** Forma de pagamento atualmente marcada, ou null se nenhuma foi escolhida ainda. */
  selecionado: FormaPagamento | null;
  /** Disparado ao clicar em uma das opções (crédito, débito ou PIX). */
  onSelecionar: (forma: FormaPagamento) => void;
}

// Card "Forma de Pagamento" da tela Método de Pagamento — origem: WEB-CRU/metodoPagamento.html.
export function SeletorFormaPagamento({ selecionado, onSelecionar }: SeletorFormaPagamentoProps) {
  return (
    <section className={styles.card} aria-labelledby="forma-pagamento-titulo">
      <h2 className={styles.titulo} id="forma-pagamento-titulo">
        Forma de Pagamento
      </h2>

      <div className={styles.grupo} role="radiogroup" aria-label="Forma de pagamento">
        {OPCOES.map((opcao) => (
          <button
            key={opcao.id}
            type="button"
            role="radio"
            aria-checked={selecionado === opcao.id}
            className={`${styles.botao} ${selecionado === opcao.id ? styles.ativo : ''}`}
            onClick={() => onSelecionar(opcao.id)}
          >
            {opcao.icone}
            <span>{opcao.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
