import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import FormInput from '../../Inputs/FormInput/FormInput';
import type { EspecificacaoForm } from '../../../pages/CadastroFerramenta/CadastroFerramenta.types';
import styles from './EspecificacoesTecnicasForm.module.css';

interface EspecificacoesTecnicasFormProps {
  especificacoes: EspecificacaoForm[];
  onChange: (especificacoes: EspecificacaoForm[]) => void;
  // Erro vindo da validação global do formulário (ao clicar em "Publicar Ferramenta").
  // Quando presente, tem prioridade sobre a mensagem de erro local.
  erroPublicacao?: string;
}

export default function EspecificacoesTecnicasForm({
  especificacoes,
  onChange,
  erroPublicacao,
}: EspecificacoesTecnicasFormProps) {
  const [erro, setErro] = useState('');
  const mensagemErro = erroPublicacao ?? erro;

  // Atualiza uma especificação técnica existente.
  // O parâmetro "campo" define se o texto digitado vai alterar "label" ou "valor".
  // ou seja, quando o usuário digitar no campo ESPECIFICAÇÃO ou no campo VALOR, atualize aquela linha específica dentro do array especificacoes.
  // Essa função é chamada toda vez que o usuário digita em um dos inputs.
  // Esses dados ainda não vão para o banco aqui; eles só são preparados no formulário.
  const atualizarLinha = (id: string, campo: 'label' | 'valor', texto: string) => {
    const especificacoesAtualizadas = especificacoes.map((esp) =>
      esp.id === id ? { ...esp, [campo]: texto } : esp
    );

    onChange(especificacoesAtualizadas);

    const todasPreenchidas = especificacoesAtualizadas.every(
      (esp) => esp.label.trim() !== '' && esp.valor.trim() !== ''
    );

    if (todasPreenchidas) {
      setErro('');
    }
  };

  const removerLinha = (id: string) => {
    const especificacoesAtualizadas = especificacoes.filter((esp) => esp.id !== id);

    onChange(especificacoesAtualizadas);

    const todasPreenchidas = especificacoesAtualizadas.every(
      (esp) => esp.label.trim() !== '' && esp.valor.trim() !== ''
    );

    if (todasPreenchidas) {
      setErro('');
    }
  };

  const adicionarLinha = () => {
    const existeEspecificacaoIncompleta = especificacoes.some(
      (esp) => esp.label.trim() === '' || esp.valor.trim() === ''
    );

    if (existeEspecificacaoIncompleta) {
      setErro('Preencha a especificação anterior antes de adicionar uma nova.');
      return;
    }

    setErro('');
    onChange([...especificacoes, { id: `esp-${Date.now()}`, label: '', valor: '' }]);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.cabecalhoColunas}>
        <span>ESPECIFICAÇÃO</span>
        <span>VALOR</span>
      </div>

      {especificacoes.map((esp) => (
        <div key={esp.id} className={styles.linha}>
          <FormInput
            id={`especificacao-${esp.id}`}
            type="text"
            placeholder="Torque máximo"
            value={esp.label}
            onChange={(e) => atualizarLinha(esp.id, 'label', e.target.value)}
            aria-label="Especificação"
            status={mensagemErro && esp.label.trim() === '' ? 'erro' : ''}
          />

          <FormInput
            id={`valor-${esp.id}`}
            type="text"
            placeholder="65 Nm"
            value={esp.valor}
            onChange={(e) => atualizarLinha(esp.id, 'valor', e.target.value)}
            aria-label="Valor da especificação"
            status={mensagemErro && esp.valor.trim() === '' ? 'erro' : ''}
          />

          <button
            type="button"
            className={styles.botaoRemover}
            onClick={() => removerLinha(esp.id)}
            aria-label="Remover especificação"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {mensagemErro && <p className={styles.error}>{mensagemErro}</p>}

      <button type="button" className={styles.botaoAdicionar} onClick={adicionarLinha}>
        <Plus size={16} />
        Adicionar Especificação
      </button>
    </div>
  );
}