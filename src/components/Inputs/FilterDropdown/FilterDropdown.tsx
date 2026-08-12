import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FilterDropdown.module.css';

export interface SelectOption<T extends string = string> {
    value: T;
    label: string;
    disabled?: boolean;
}

interface FilterDropdownProps<T extends string = string> {
    options: SelectOption<T>[];
    value: T | null;
    onChange: (value: T) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
}

export default function FilterDropdown<T extends string = string>({
    options,
    value,
    onChange,
    placeholder = 'Selecione',
    label,
    error,
    disabled = false,
    id,
    className = '',
}: FilterDropdownProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((option) => option.value === value);

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

    const handleToggle = () => {
        if (disabled) return;
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (option: SelectOption<T>) => {
        if (option.disabled) return;
        onChange(option.value);
        setIsOpen(false); // seleciona e já fecha o menu
    };

    return (
        <div className={`${styles.wrapper} ${className}`}>
            {label && (
                <label htmlFor={id} className={styles.label}>
                    {label}
                </label>
            )}

            <div className={styles.container} ref={containerRef}>
                <button
                    type="button"
                    id={id}
                    className={`${styles.trigger} ${error ? styles.erro : ''} ${disabled ? styles.disabled : ''}`}
                    onClick={handleToggle}
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className={selectedOption ? styles.value : styles.placeholder}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        size={14}
                        className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                    />
                </button>

                {isOpen && (
                    <ul className={styles.menu} role="listbox">
                        {options.map((option) => (
                            <li key={option.value}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={option.value === value}
                                    disabled={option.disabled}
                                    className={`${styles.option} ${option.value === value ? styles.optionActive : ''} ${option.disabled ? styles.optionDisabled : ''}`}
                                    onClick={() => handleSelect(option)}
                                >
                                    {option.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {error && <small className={styles.error}>{error}</small>}
        </div>
    );
}