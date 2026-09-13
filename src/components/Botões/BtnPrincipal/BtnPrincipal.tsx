import type { ReactNode } from 'react'
import styles from './BtnPrincipal.module.css'

interface ButtonProps {
    text: string                // Texto que vai aparecer no botão (Ex: "Enviar")
    onClick?: () => void        // Função de clique (opcional)
    type?: 'button' | 'submit'  
    disabled?: boolean          // Se o botão está desativado ou não
    icon?: ReactNode            // Ícone opcional exibido antes do texto (mantém a aparência padrão do botão)
}

export default function Button({
    text,
    onClick = () => {},         // Se não for passado, não faz nada por padrão
    type = 'submit',
    disabled,
    icon
}: ButtonProps) {
    return (
        <button
            type={type}
            className={styles.customButton}
            onClick={onClick}
            disabled={disabled}
        >
            {icon ? <span className={styles.icone} aria-hidden="true">{icon}</span> : null}
            {text}
        </button>
    )
}