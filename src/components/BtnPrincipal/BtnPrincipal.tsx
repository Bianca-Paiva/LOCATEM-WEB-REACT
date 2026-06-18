import styles from './Button.module.css'

interface ButtonProps {
    text: string                // Texto que vai aparecer no botão (Ex: "Enviar")
    onClick?: () => void        // Função de clique (opcional)
    type?: 'button' | 'submit'  // Tipo do botão (padrão é 'button')
    disabled?: boolean          // Se o botão está desativado ou não
}

export default function Button({
    text,
    onClick = () => {},         // Se não for passado, não faz nada por padrão
    type = 'button',
    disabled = false
}: ButtonProps) {
    return (
        <button
            type={type}
            className={styles.customButton}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    )
}