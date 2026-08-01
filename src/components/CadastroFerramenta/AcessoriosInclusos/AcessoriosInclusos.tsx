import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { X } from 'lucide-react';

import FormInput from '../../Inputs/FormInput/FormInput';
import styles from './AcessoriosInclusos.module.css';

interface AcessoriosInclusosProps {
  acessorios: string[];
  onChange: (acessorios: string[]) => void;
}

export default function AcessoriosInclusos({ acessorios, onChange }: AcessoriosInclusosProps) {
  const [texto, setTexto] = useState('');

  const adicionar = () => {
    const valor = texto.trim();
    if (!valor || acessorios.includes(valor)) {
      setTexto('');
      return;
    }
    onChange([...acessorios, valor]);
    setTexto('');
  };

  const remover = (item: string) => {
    onChange(acessorios.filter((a) => a !== item));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      adicionar();
    } else if (e.key === 'Backspace' && !texto && acessorios.length > 0) {
      remover(acessorios[acessorios.length - 1]);
    }
  };

  return (
    <div className={styles.wrapper}>
      {acessorios.length > 0 && (
        <div className={styles.chips}>
          {acessorios.map((item) => (
            <span key={item} className={styles.chip}>
              {item}
              <button type="button" onClick={() => remover(item)} aria-label={`Remover ${item}`}>
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}

      <FormInput
        id="acessorio-incluso"
        type="text"
        label=""
        placeholder="Adicione"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={adicionar}
        aria-label="Adicionar acessório incluso"
      />

      <small className={styles.dica}>Pressione Enter para adicionar cada acessório.</small>
    </div>
  );
}
