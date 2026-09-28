import { useEffect, useState } from 'react';
import FormInput from '../../../Shared/Inputs/FormInput/FormInput';
import FormTextarea from '../../../Shared/Inputs/FormTextarea/FormTextarea';
import { maskCEP } from '../../../../utils/Formatacao/masks';
import { buscarEnderecoPorCEP } from '../../../../services/cepService';
import type { CadastroFerramentaFormState } from '../../../../pages/Ferramentas/CadastroFerramenta/CadastroFerramenta.types';
import styles from './EnderecoRetirada.module.css';

type CampoEndereco =
  | 'cep'
  | 'ruaAvenida'
  | 'numero'
  | 'complemento'
  | 'bairro'
  | 'cidade'
  | 'estado';

interface ErrosEndereco {
  cep?: string;
  ruaAvenida?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

interface EnderecoRetiradaProps {
  form: Pick<CadastroFerramentaFormState, CampoEndereco>;
  onChangeCampo: (campo: CampoEndereco, valor: string) => void;
  erros: ErrosEndereco;
  shake: boolean;
}

export default function EnderecoRetirada({ form, onChangeCampo, erros, shake }: EnderecoRetiradaProps) {
  const { cep, ruaAvenida, numero, complemento, bairro, cidade, estado } = form;
  const cepLimpo = cep.replace(/\D/g, '');
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCepBusca, setErroCepBusca] = useState<string>();

  useEffect(() => {
    if (cepLimpo.length !== 8) return;

    let cancelado = false;

    const preencherEndereco = async () => {
      setBuscandoCep(true);
      setErroCepBusca(undefined);

      try {
        const endereco = await buscarEnderecoPorCEP(cepLimpo);

        if (cancelado) return;

        onChangeCampo('ruaAvenida', endereco.logradouro ?? '');
        onChangeCampo('bairro', endereco.bairro ?? '');
        onChangeCampo('cidade', endereco.localidade ?? '');
        onChangeCampo('estado', endereco.uf ?? '');
      } catch (error) {
        if (cancelado) return;
        setErroCepBusca(error instanceof Error ? error.message : 'Não foi possível consultar o CEP.');
      } finally {
        if (!cancelado) setBuscandoCep(false);
      }
    };

    preencherEndereco();

    return () => {
      cancelado = true;
    };
  }, [cepLimpo, onChangeCampo]);

  const erroCepVisivel = cepLimpo.length === 8 ? erroCepBusca : undefined;
  const buscandoCepVisivel = cepLimpo.length === 8 && buscandoCep;

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
            error={erroCepVisivel ?? erros.cep}
            status={erroCepVisivel || erros.cep ? 'erro' : ''}
            shake={shake && Boolean(erros.cep)}
            onChange={(e) => onChangeCampo('cep', maskCEP(e.target.value))}
          />
          {buscandoCepVisivel && <small className={styles.statusCep}>Buscando endereço...</small>}
        </div>

        <button
          type="button"
          className={styles.linkCepDesconhecido}
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

      <div className={styles.linhaLocalizacao}>
        <FormInput
          id="bairro"
          label="Bairro"
          placeholder="Preenchido pelo CEP"
          value={bairro}
          required
          error={erros.bairro}
          status={erros.bairro ? 'erro' : ''}
          shake={shake && Boolean(erros.bairro)}
          onChange={(e) => onChangeCampo('bairro', e.target.value)}
        />

        <FormInput
          id="cidade"
          label="Cidade"
          placeholder="Preenchido pelo CEP"
          value={cidade}
          required
          error={erros.cidade}
          status={erros.cidade ? 'erro' : ''}
          shake={shake && Boolean(erros.cidade)}
          onChange={(e) => onChangeCampo('cidade', e.target.value)}
        />

        <FormInput
          id="estado"
          label="Estado"
          placeholder="UF"
          value={estado}
          required
          error={erros.estado}
          status={erros.estado ? 'erro' : ''}
          shake={shake && Boolean(erros.estado)}
          onChange={(e) => onChangeCampo('estado', e.target.value)}
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
