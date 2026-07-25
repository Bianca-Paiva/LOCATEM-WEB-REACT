import { ChevronDown, Minus, Plus } from 'lucide-react';
import FormInput from '../../Inputs/FormInput/FormInput';
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

      <div className={styles.linha2col}>
        <div className={`${styles.campoSelect} ${shake && erros.categoria ? styles.shake : ''}`}>
          <label htmlFor="categoria" className={styles.label}>
            Categoria<span className={styles.obrigatorio}> *</span>
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="categoria"
              className={`${styles.select} ${!categoria ? styles.placeholder : ''} ${erros.categoria ? styles.erro : ''}`}
              value={categoria}
              onChange={(e) => onChangeCampo('categoria', e.target.value)}
            >
              <option value="" disabled>Selecione uma categoria</option>
              {CATEGORIAS_FERRAMENTA.map((opcao) => (
                <option key={opcao} value={opcao}>{opcao}</option>
              ))}
            </select>
            <ChevronDown size={16} className={styles.chevron} />
          </div>
          {erros.categoria && <small className={styles.error}>{erros.categoria}</small>}
        </div>

        <div className={`${styles.campoSelect} ${shake && erros.estadoConservacao ? styles.shake : ''}`}>
          <label htmlFor="estadoConservacao" className={styles.label}>
            Estado de Conservação<span className={styles.obrigatorio}> *</span>
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="estadoConservacao"
              className={`${styles.select} ${!estadoConservacao ? styles.placeholder : ''} ${erros.estadoConservacao ? styles.erro : ''}`}
              value={estadoConservacao}
              onChange={(e) => onChangeCampo('estadoConservacao', e.target.value)}
            >
              <option value="" disabled>Selecione o estado</option>
              {ESTADOS_CONSERVACAO.map((opcao) => (
                <option key={opcao} value={opcao}>{opcao}</option>
              ))}
            </select>
            <ChevronDown size={16} className={styles.chevron} />
          </div>
          {erros.estadoConservacao && <small className={styles.error}>{erros.estadoConservacao}</small>}
        </div>
      </div>

      <div className={styles.linha2col}>
        <div className={styles.campoQuantidade}>
          <label className={styles.label}>
            Quantidade Disponível<span className={styles.obrigatorio}> *</span>
          </label>
          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.stepperBotao}
              onClick={() => onChangeCampo('quantidadeDisponivel', Math.max(1, quantidadeDisponivel - 1))}
              disabled={quantidadeDisponivel <= 1}
              aria-label="Diminuir quantidade"
            >
              <Minus size={15} />
            </button>
            <span className={styles.stepperValor}>{quantidadeDisponivel}</span>
            <button
              type="button"
              className={styles.stepperBotao}
              onClick={() => onChangeCampo('quantidadeDisponivel', Math.min(999, quantidadeDisponivel + 1))}
              aria-label="Aumentar quantidade"
            >
              <Plus size={15} />
            </button>
          </div>
        </div>

        <div className={styles.campoFonte}>
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
        </div>
      </div>
    </div>
  );
}
