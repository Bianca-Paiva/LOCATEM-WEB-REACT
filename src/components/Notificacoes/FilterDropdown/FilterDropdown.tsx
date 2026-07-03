import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '../icons/NotificationIcons';
import type { FilterOption } from '../../../pages/Notificacoes/Notificacoes.types';
import styles from './FilterDropdown.module.css';

const OPTIONS: FilterOption[] = ['Hoje', 'Ontem', 'Esta semana', 'Este mês'];

interface FilterDropdownProps {
  value: FilterOption;
  onChange: (value: FilterOption) => void;
}

export default function FilterDropdown({ value, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: FilterOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{value}</span>
        <ChevronDownIcon className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
      </button>

      {isOpen && (
        <ul className={styles.menu} role="listbox">
          {OPTIONS.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={option === value}
                className={`${styles.option} ${option === value ? styles.optionActive : ''}`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
