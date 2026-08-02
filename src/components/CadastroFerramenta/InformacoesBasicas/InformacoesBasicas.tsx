import FormInput from '../../Inputs/FormInput/FormInput';
import FormSelect from '../../Inputs/FormSelect/FormSelect';
import SeletorQuantidade from '../../Inputs/SeletorQuantidade/SeletorQuantidade';
import {
  CATEGORIAS_FERRAMENTA,
  ESTADOS_CONSERVACAO,
  OPCOES_FONTE_ALIMENTACAO,
} from '../../../pages/CadastroFerramenta/CadastroFerramenta.types';
import type { CadastroFerramentaFormState } from '../../../pages/CadastroFerramenta/CadastroFerramenta.types';
import styles from './InformacoesBasicas.module.css';

type CampoBasico =
  | 'nome'
  | 'marca'
  | 'modelo'
  | 'categoria'
  | 'estadoConservacao'
  | 'quantidadeDisponivel'
  | 'fonteAlimentacao';

interface ErrosBasico {
  nome?: string;
  marca?: string;
  modelo?: string;
  categoria?: string;
  estadoConservacao?: string;
  fonteAlimentacao?: string;
}

interface InformacoesBasicasProps {
  form: Pick<CadastroFerramentaFormState, CampoBasico>;
  onChangeCampo: <K extends CampoBasico>(campo: K, valor: CadastroFerramentaFormState[K]) => void;
  erros: ErrosBasico;
  shake: boolean;
}

export default function InformacoesBasicas({ form, onChangeCampo, erros, shake }: InformacoesBasicasProps) {
  const {
    nome, marca, modelo, categoria, estadoConservacao, quantidadeDisponivel, fonteAlimentacao,
  } = form;

  return (
    <div className={styles.wrapper}>
      <FormInput
        id="nome"
        label="Nome da Ferramenta"
        placeholder="Ex: Furadeira de Impacto 750W"
        value={nome}
        required
        error={erros.nome}
        status={erros.nome ? 'erro' : ''}
        shake={shake && Boolean(erros.nome)}
        onChange={(e) => onChangeCampo('nome', e.target.value)}
      />

      <div className={styles.linha2col}>
        <FormInput
          id="marca"
          label="Marca"
          placeholder="Ex: Bosch, Makita, DeWalt..."
          value={marca}
          required
          error={erros.marca}
          status={erros.marca ? 'erro' : ''}
          shake={shake && Boolean(erros.marca)}
          onChange={(e) => onChangeCampo('marca', e.target.value)}
        />

        <FormInput
          id="modelo"
          label="Modelo"
          placeholder="Ex: GSB 13 RE"
          value={modelo}
          required
          error={erros.modelo}
          status={erros.modelo ? 'erro' : ''}
          shake={shake && Boolean(erros.modelo)}
          onChange={(e) => onChangeCampo('modelo', e.target.value)}
        />
      </div>

      <div className={`${styles.linha2col} ${styles.linhaCategoria}`}>
        <FormSelect
          id="categoria"
          label="Categoria"
          required
          placeholder="Selecione uma categoria"
          options={CATEGORIAS_FERRAMENTA}
          value={categoria}
          error={erros.categoria}
          shake={shake && Boolean(erros.categoria)}
          onChange={(valor) => onChangeCampo('categoria', valor)}
        />

        <FormSelect
          id="estadoConservacao"
          label="Estado de Conservação"
          required
          placeholder="Selecione o estado"
          options={ESTADOS_CONSERVACAO}
          value={estadoConservacao}
          error={erros.estadoConservacao}
          shake={shake && Boolean(erros.estadoConservacao)}
          onChange={(valor) => onChangeCampo('estadoConservacao', valor)}
        />
      </div>

      <div className={styles.linha2col}>
        <div className={styles.campoQuantidade}>
          <SeletorQuantidade
            quantidade={quantidadeDisponivel}
            exibirEstoqueDisponivel={false}
            onDecrementar={() =>
              onChangeCampo(
                'quantidadeDisponivel',
                Math.max(1, quantidadeDisponivel - 1)
              )
            }
            onIncrementar={() =>
              onChangeCampo(
                'quantidadeDisponivel',
                Math.min(999, quantidadeDisponivel + 1)
              )
            }
          />
        </div>

        <div className={`${styles.campoFonte} ${shake && erros.fonteAlimentacao ? styles.shake : ''}`}>
          <label className={styles.label}>
            Fonte de Alimentação / Voltagem<span className={styles.obrigatorio}> *</span>
          </label>
          <div className={styles.chips}>
            {OPCOES_FONTE_ALIMENTACAO.map((opcao) => (
              <button
                key={opcao}
                type="button"
                className={`${styles.chip} ${fonteAlimentacao === opcao ? styles.chipAtivo : ''}`}
                onClick={() => onChangeCampo('fonteAlimentacao', opcao)}
              >
                {opcao}
              </button>
            ))}
          </div>
          {erros.fonteAlimentacao && <small className={styles.error}>{erros.fonteAlimentacao}</small>}
        </div>
      </div>
    </div>
  );
}