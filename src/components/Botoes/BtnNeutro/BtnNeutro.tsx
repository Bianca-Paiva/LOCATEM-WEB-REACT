import type { ReactNode } from 'react'
import styles from './BtnNeutro.module.css'

interface ButtonProps {
    children: ReactNode
    onClick?: () => void
    type?: 'button' | 'submit'
    disabled?: boolean
    icon?: ReactNode
    className?: string
}

export default function BtnNeutro({
    children,
    onClick = () => { },
    type = 'button',
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
