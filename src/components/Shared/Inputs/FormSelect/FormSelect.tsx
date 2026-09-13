import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FormSelect.module.css';

export interface FormSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface FormSelectProps {
    options: FormSelectOption[] | string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    error?: string;
    shake?: boolean;
    disabled?: boolean;
    id?: string;
    className?: string;
}

function normalizarOpcoes(options: FormSelectOption[] | string[]): FormSelectOption[] {
    return options.map((opcao) =>
        typeof opcao === 'string' ? { value: opcao, label: opcao } : opcao
    );
}

export default function FormSelect({
    options,
    value,
    onChange,
    placeholder = 'Selecione',
    label,
    required = false,
    error,
    shake = false,
    disabled = false,
    id,
    className = '',
}: FormSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const opcoes = normalizarOpcoes(options);
    const opcaoSelecionada = opcoes.find((opcao) => opcao.value === value);

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

    const handleSelect = (opcao: FormSelectOption) => {
        if (opcao.disabled) return;
        onChange(opcao.value);
        setIsOpen(false); // seleciona e já fecha o menu
    };

    return (
        <div className={`${styles.wrapper} ${shake ? styles.shake : ''} ${className}`}>
            {label && (
                <label htmlFor={id} className={styles.label}>
                    {label}
                    {required && <span className={styles.required}> *</span>}
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
                    <span className={opcaoSelecionada ? styles.value : styles.placeholder}>
                        {opcaoSelecionada ? opcaoSelecionada.label : placeholder}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                    />
                </button>

                {isOpen && (
                    <ul className={styles.menu} role="listbox">
                        {opcoes.map((opcao) => (
                            <li key={opcao.value}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={opcao.value === value}
                                    disabled={opcao.disabled}
                                    className={`${styles.option} ${opcao.value === value ? styles.optionActive : ''} ${opcao.disabled ? styles.optionDisabled : ''}`}
                                    onClick={() => handleSelect(opcao)}
                                >
                                    {opcao.label}
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