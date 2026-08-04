import { useState } from 'react';
import styles from './PagamentoCartaoForm.module.css';
import { CreditCard } from 'lucide-react';

export interface DadosCartao {
  numero: string;
  nomeTitular: string;
  validade: string;
  cvv: string;
  parcelamento: string;
  salvarCartao: boolean;
}

interface PagamentoCartaoFormProps {
  parcelamentoOpcoes?: string[];
  onChange?: (dados: DadosCartao) => void;
}

const PARCELAS_PADRAO = [
  '1x sem juros',
  '2x sem juros',
  '3x sem juros',
  '6x sem juros',
  '12x com juros',
];

export function PagamentoCartaoForm({
  parcelamentoOpcoes = PARCELAS_PADRAO,
  onChange,
}: PagamentoCartaoFormProps) {
  const [dados, setDados] = useState<DadosCartao>({
    numero: '',
    nomeTitular: '',
    validade: '',
    cvv: '',
    parcelamento: parcelamentoOpcoes[0],
    salvarCartao: false,
  });

  function atualizar<K extends keyof DadosCartao>(campo: K, valor: DadosCartao[K]) {
    const novo = { ...dados, [campo]: valor };
    setDados(novo);
    onChange?.(novo);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <CreditCard size={20} />
        <p className={styles.titulo}>Dados do Cartão</p>
      </div>

      <div className={styles.campo}>
        <label className={styles.label}>Número do Cartão *</label>
        <input
          className={styles.input}
          type="text"
          inputMode="numeric"
          placeholder="0000 0000 0000 0000"
          value={dados.numero}
          onChange={e => atualizar('numero', e.target.value)}
        />
      </div>

      <div className={styles.campo}>
        <label className={styles.label}>Nome do Titular *</label>
        <input
          className={styles.input}
          type="text"
          placeholder="NOME COMO ESTÁ NO CARTÃO"
          value={dados.nomeTitular}
          onChange={e => atualizar('nomeTitular', e.target.value.toUpperCase())}
        />
      </div>

      <div className={styles.linhaDupla}>
        <div className={styles.campo}>
          <label className={styles.label}>Validade *</label>
          <input
            className={styles.input}
            type="text"
            placeholder="MM/AA"
            value={dados.validade}
            onChange={e => atualizar('validade', e.target.value)}
          />
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>CVV *</label>
          <input
            className={styles.input}
            type="text"
            inputMode="numeric"
            placeholder="123"
            value={dados.cvv}
            onChange={e => atualizar('cvv', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.campo}>
        <label className={styles.label}>Parcelamento *</label>
        <select
          className={styles.select}
          value={dados.parcelamento}
          onChange={e => atualizar('parcelamento', e.target.value)}
        >
          {parcelamentoOpcoes.map(opcao => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>
      </div>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={dados.salvarCartao}
          onChange={e => atualizar('salvarCartao', e.target.checked)}
        />
        Salvar cartão para próximas compras
      </label>
    </div>
  );
}
