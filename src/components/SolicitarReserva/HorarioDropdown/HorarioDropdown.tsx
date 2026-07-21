import { useEffect, useRef, useState } from 'react';
import IconSeta from '../../../assets/IconSeta.png';
import styles from './HorarioDropdown.module.css';

// Horários disponíveis como faixas de 3 horas (ex: 06:00 - 09:00), incrementando de 1h em 1h, das 06:00 às 22:00
const HORA_INICIO = 6;
const HORA_FIM = 22;
const DURACAO_FAIXA = 3;

const HORARIO_OPTIONS = [
  {
    label: 'Selecione um horário',
    value: '',
  },
  ...Array.from(
    { length: HORA_FIM - HORA_INICIO - DURACAO_FAIXA + 1 },
    (_, i) => {
      const horaInicio = String(HORA_INICIO + i).padStart(2, '0');
      const horaFim = String(HORA_INICIO + i + DURACAO_FAIXA).padStart(2, '0');

      return {
        label: `${horaInicio}:00 - ${horaFim}:00`,
        value: `${horaInicio}:00`,
      };
    },
  ),
];

interface HorarioDropdownProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function HorarioDropdown({ id, label, value, onChange }: HorarioDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora do dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.container} ref={containerRef}>
        <button
          id={id}
          type="button"
          className={styles.trigger}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>
            {HORARIO_OPTIONS.find((option) => option.value === value)?.label}
          </span>
          <img
            src={IconSeta}
            alt=""
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          />
        </button>

        {isOpen && (
          <ul className={styles.menu} role="listbox">
            {HORARIO_OPTIONS.map((option) => (
              <li key={option.value || 'placeholder'}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={`${styles.option} ${option.value === value ? styles.optionActive : ''
                    }`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
