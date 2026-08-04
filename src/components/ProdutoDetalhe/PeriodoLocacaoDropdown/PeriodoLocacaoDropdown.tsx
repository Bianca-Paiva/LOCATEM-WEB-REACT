import { useEffect, useRef, useState } from 'react';
import styles from './PeriodoLocacaoDropdown.module.css';
import IconSeta from '../../../assets/IconSeta.png'; 

const PERIODOLOCACAO_OPTIONS = [
    'Selecione',
    ...Array.from({ length: 30 }, (_, i) => {
        const dia = i + 1;
        return dia === 1 ? '1 dia' : `${dia} dias`;
    })
];

interface PeriodoLocacaoDropdownProps {
    value: string;
    onChange: (value: string) => void;
}

export default function PeriodoLocacaoDropdown({ value, onChange }: PeriodoLocacaoDropdownProps) {
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
        setIsOpen(false); // Seleciona e fecha
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
                {/* Imagem substituindo o SVG antigo */}
                <img 
                    src={IconSeta} 
                    alt="Seta de seleção" 
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} 
                />
            </button>

            {isOpen && (
                <ul className={styles.menu} role="listbox">
                    {PERIODOLOCACAO_OPTIONS.map((option) => (
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