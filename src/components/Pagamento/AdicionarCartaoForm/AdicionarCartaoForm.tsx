import type { ChangeEvent } from 'react';
import { CreditCard } from 'lucide-react';

import type { BandeiraCartao } from '../../../hooks/masks';
import type { CampoCartao } from '../../../hooks/Pagamento/useAdicionarCartao';
import { PARCELAS_PADRAO } from '../../../hooks/Pagamento/useAdicionarCartao';

import FormInput from '../../../components/Inputs/FormInput/FormInput';
import FormSelect from '../../../components/Inputs/FormSelect/FormSelect'; 

import cartaoIconGenerico from '../../../assets/Cartoesbandeiras/cartao.svg';
import visaIcon from '../../../assets/Cartoesbandeiras/visa.png';
import masterIcon from '../../../assets/Cartoesbandeiras/master.png';
import eloIcon from '../../../assets/Cartoesbandeiras/elo.png';
import amexIcon from '../../../assets/Cartoesbandeiras/amex.png';
import dinersIcon from '../../../assets/Cartoesbandeiras/diners.png';
import discoverIcon from '../../../assets/Cartoesbandeiras/discover.png';

import styles from './AdicionarCartaoForm.module.css';

const iconesBandeira: Record<Exclude<BandeiraCartao, ''>, string> = {
  VISA: visaIcon,
  MASTER: masterIcon,
  AMEX: amexIcon,
  ELO: eloIcon,
  DISCOVER: discoverIcon,
  DINERS: dinersIcon,
};

interface DadosFormularioCartao {
  numero: string;
  nomeTitular: string;
  validade: string;
  cvv: string;
  parcelamento: string;
  salvarCartao: boolean;
}

interface AdicionarCartaoFormProps {
  dados: DadosFormularioCartao;
  bandeira: BandeiraCartao;
  erros: Partial<Record<CampoCartao, string>>;
  mostrarParcelamento?: boolean;
  parcelamentoOpcoes?: string[];
  onNumeroChange: (valor: string) => void;
  onNomeTitularChange: (valor: string) => void;
  onValidadeChange: (valor: string) => void;
  onValidadeBlur: () => void;
  onCvvChange: (valor: string) => void;
  onParcelamentoChange?: (valor: string) => void;
  onSalvarCartaoChange: (valor: boolean) => void;
}

export function AdicionarCartaoForm({
  dados,
  bandeira,
  erros,
  mostrarParcelamento = false,
  parcelamentoOpcoes = PARCELAS_PADRAO,
  onNumeroChange,
  onNomeTitularChange,
  onValidadeChange,
  onValidadeBlur,
  onCvvChange,
  onParcelamentoChange,
  onSalvarCartaoChange,
}: AdicionarCartaoFormProps) {
  const iconeBandeiraSrc = bandeira ? iconesBandeira[bandeira] : cartaoIconGenerico;

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.titulo}>Dados do Cartão</h2>
        <CreditCard size={18} aria-hidden="true" />
      </div>

      <form className={styles.formulario} onSubmit={(e) => e.preventDefault()}>
        
        {/* Número do Cartão */}
        <div className={styles.inputCartao}>
          <FormInput
            id="numeroCartao"
            label="Número do Cartão"
            required
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={dados.numero}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onNumeroChange(e.target.value)}
            error={erros.numero}
            status={erros.numero ? 'erro' : ''}
          />
          <img
            className={`${styles.iconeBandeira} ${bandeira ? styles.ativo : ''}`}
            src={iconeBandeiraSrc}
            alt="Bandeira do cartão"
          />
        </div>

        {/* Nome do Titular */}
        <FormInput
          id="nomeTitular"
          label="Nome do Titular"
          required
          type="text"
          placeholder="NOME COMO ESTÁ NO CARTÃO"
          value={dados.nomeTitular}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onNomeTitularChange(e.target.value)}
          error={erros.nomeTitular}
          status={erros.nomeTitular ? 'erro' : ''}
        />

        {/* Validade e CVV */}
        <div className={styles.linhaCampos}>
          <FormInput
            id="validade"
            label="Validade"
            required
            type="text"
            inputMode="numeric"
            placeholder="MM/AA"
            value={dados.validade}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onValidadeChange(e.target.value)}
            onBlur={onValidadeBlur}
            error={erros.validade}
            status={erros.validade ? 'erro' : ''}
          />

          <FormInput
            id="cvv"
            label="CVV"
            required
            type="text"
            inputMode="numeric"
            placeholder="123"
            value={dados.cvv}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onCvvChange(e.target.value)}
            error={erros.cvv}
            status={erros.cvv ? 'erro' : ''}
          />
        </div>

        {/* Parcelamento */}
        {mostrarParcelamento && (
          <FormSelect
            id="parcelamento"
            className={styles.campo}
            label="Parcelamento"
            required={true}
            value={dados.parcelamento}
            options={parcelamentoOpcoes}
            onChange={(valor) => onParcelamentoChange?.(valor)}
            error={erros.parcelamento}
          />
        )}

        {/* Salvar Cartão */}
        <label className={styles.salvarCartao}>
          <input
            type="checkbox"
            checked={dados.salvarCartao}
            onChange={(e) => onSalvarCartaoChange(e.target.checked)}
          />
          <span>Salvar cartão para próximas compras</span>
        </label>
      </form>
    </section>
  );
}