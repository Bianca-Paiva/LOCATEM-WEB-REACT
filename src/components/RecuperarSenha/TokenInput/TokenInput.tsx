import { useRef } from 'react'
import styles from './TokenInput.module.css'

interface TokenInputProps {
    length?: number;         // Quantidade de caixinhas (padrão é 5)
    value: string;
    onChange: (value: string) => void; 
    hasError?: boolean;
}

export default function TokenInput({ length = 5, value, onChange, hasError = false }: TokenInputProps) {
    // Array de referências para conseguir controlar o foco de cada caixinha individualmente
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    // Transforma a string do valor em um array de tamanho fixo (Ex: ["1", "2", "", "", ""])
    const tokenArray = Array(length)
        .fill('')
        .map((_, index) => value[index] || '');

    const handleChange = (text: string, index: number) => {
        // Pega apenas o último caractere digitado (caso o usuário tente digitar 2 números na mesma caixa)
        const char = text.slice(-1);

        const newValue = [...tokenArray];
        newValue[index] = char;

        const updatedValue = newValue.join('');
        onChange(updatedValue);

        // Se digitou algo e não é a última caixinha, pula o foco para a próxima
        if (char && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Se apertar Backspace (Apagar) e a caixinha atual já estiver vazia, volta para a anterior
        if (e.key === 'Backspace' && !tokenArray[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    return (
        /* Se houver erro, adiciona a classe de animação 'shake' no container */
        <div className={`${styles.tokenContainer} ${hasError ? styles.shake : ''}`}>
            {tokenArray.map((char, index) => (
                <input
                    key={index}
                    ref={(el) => { inputsRef.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={char}
                    /* Se houver erro, adiciona a classe 'erro' na caixinha */
                    className={`${styles.tokenBox} ${hasError ? styles.erro : ''}`}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                />
            ))}
        </div>
    );
}