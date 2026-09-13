import type { ReactNode } from 'react'
import styles from './BtnNegativo.module.css'

interface ButtonProps {
    children: ReactNode         // Conteúdo do botão (Ex: "Recusar", "Cancelar", "Excluir")
    onClick?: () => void        // Função de clique (opcional)
    type?: 'button' | 'submit'
    disabled?: boolean          // Se o botão está desativado ou não
    icon?: ReactNode            // Ícone opcional exibido antes do texto (mesmo padrão do BtnPrincipal)
    className?: string          // Classe extra opcional, para ajustes pontuais sem duplicar o componente
}

export default function BtnNegativo({
    children,
    onClick = () => { },         // Se não for passado, não faz nada por padrão
    type = 'button',            // Padrão 'button' (e não 'submit'): ações destrutivas não devem disparar submits acidentais
    disabled,
    icon,
    className
}: ButtonProps) {
    return (
        <button
            type={type}
            className={className ? `${styles.customButton} ${className}` : styles.customButton}
            onClick={onClick}
            disabled={disabled}
        >
            {icon ? <span className={styles.icone} aria-hidden="true">{icon}</span> : null}
            {children}
        </button>
    )
}