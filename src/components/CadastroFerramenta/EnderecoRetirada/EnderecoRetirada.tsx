import FormInput from '../../Inputs/FormInput/FormInput';
import FormTextarea from '../../Inputs/FormTextarea/FormTextarea';
import { maskCEP } from '../../../hooks/masks';
import type { CadastroFerramentaFormState } from '../../../pages/CadastroFerramenta/CadastroFerramenta.types';
import styles from './EnderecoRetirada.module.css';

type CampoEndereco = 'cep' | 'ruaAvenida' | 'numero' | 'complemento' | 'usarMesmoEnderecoDevolucao';

interface ErrosEndereco {
  cep?: string;
  ruaAvenida?: string;
  numero?: string;
}

interface EnderecoRetiradaProps {
  form: Pick<CadastroFerramentaFormState, CampoEndereco>;
  onChangeCampo: <K extends CampoEndereco>(campo: K, valor: CadastroFerramentaFormState[K]) => void;
  erros: ErrosEndereco;
  shake: boolean;
}

export default function EnderecoRetirada({ form, onChangeCampo, erros, shake }: EnderecoRetiradaProps) {
  const { cep, ruaAvenida, numero, complemento } = form;

  return (
    <div className={styles.wrapper}>
      <div className={styles.linhaCep}>
        <div className={styles.campoCep}>
          <FormInput
            id="cep"
            label="CEP"
            placeholder="00000-000"
            inputMode="numeric"
            value={cep}
            required
            error={erros.cep}
            status={erros.cep ? 'erro' : ''}
            shake={shake && Boolean(erros.cep)}
            onChange={(e) => onChangeCampo('cep', maskCEP(e.target.value))}
          />
        </div>

        <button
          type="button"
          className={styles.linkCepDesconhecido}

          // API do Correio para buscar um cep
          onClick={() => window.open('https://buscacepinter.correios.com.br/app/endereco/index.php', '_blank')}
        >
          Não sei meu CEP
        </button>
      </div>

      <div className={styles.linhaRuaNumero}>
        <FormInput
          id="ruaAvenida"
          label="Rua / Avenida"
          placeholder="Ex: Av. Paulista"
          value={ruaAvenida}
          required
          error={erros.ruaAvenida}
          status={erros.ruaAvenida ? 'erro' : ''}
          shake={shake && Boolean(erros.ruaAvenida)}
          onChange={(e) => onChangeCampo('ruaAvenida', e.target.value)}
        />

        <FormInput
          id="numero"
          label="Número"
          placeholder="Ex: 1234"
          value={numero}
          required
          error={erros.numero}
          status={erros.numero ? 'erro' : ''}
          shake={shake && Boolean(erros.numero)}
          onChange={(e) => onChangeCampo('numero', e.target.value)}
        />
      </div>

      <FormTextarea
        id="complemento"
        label="Complemento (opcional)"
        placeholder="Apartamento, bloco, referência..."
        value={complemento}
        onChange={(e) => onChangeCampo('complemento', e.target.value)}
      />

      {/* <label className={styles.checkboxLinha}>
        <input
          type="checkbox"
          checked={usarMesmoEnderecoDevolucao}
          onChange={(e) => onChangeCampo('usarMesmoEnderecoDevolucao', e.target.checked)}
        />
        Usar o mesmo endereço para devolução
      </label> */}
    </div>
  );
}
