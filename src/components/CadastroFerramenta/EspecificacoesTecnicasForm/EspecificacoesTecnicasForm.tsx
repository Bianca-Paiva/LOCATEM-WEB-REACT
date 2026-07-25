import { Plus, Trash2 } from 'lucide-react';
import type { EspecificacaoForm } from '../../../pages/CadastroFerramenta/CadastroFerramenta.types';
import styles from './EspecificacoesTecnicasForm.module.css';

interface EspecificacoesTecnicasFormProps {
  especificacoes: EspecificacaoForm[];
  onChange: (especificacoes: EspecificacaoForm[]) => void;
}

export default function EspecificacoesTecnicasForm({ especificacoes, onChange }: EspecificacoesTecnicasFormProps) {
  const atualizarLinha = (id: string, campo: 'label' | 'valor', texto: string) => {
    onChange(especificacoes.map((esp) => (esp.id === id ? { ...esp, [campo]: texto } : esp)));
  };

  const removerLinha = (id: string) => {
    onChange(especificacoes.filter((esp) => esp.id !== id));
  };

  const adicionarLinha = () => {
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
          <input
            type="text"
            className={styles.input}
            placeholder="Voltagem"
            value={esp.label}
            onChange={(e) => atualizarLinha(esp.id, 'label', e.target.value)}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="220V"
            value={esp.valor}
            onChange={(e) => atualizarLinha(esp.id, 'valor', e.target.value)}
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

      <button type="button" className={styles.botaoAdicionar} onClick={adicionarLinha}>
        <Plus size={16} />
        Adicionar Especificação
      </button>
    </div>
  );
}
