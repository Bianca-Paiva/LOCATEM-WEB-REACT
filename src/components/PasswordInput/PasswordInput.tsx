import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import olhoAberto from '../../assets/olhoAberto.svg'
import olhoFechado from '../../assets/olhoFechado.svg'
import styles from './PasswordInput.module.css'
import type { PasswordStrengthResult } from '../../hooks/usePasswordStrength'

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    status?: 'erro' | 'sucesso' | ''
    strengthResult?: PasswordStrengthResult
    showRequirements?: boolean
    shake?: boolean
}

export default function PasswordField({
    label,
    error,
    status = '',
    shake = false,
    ...props
}: PasswordFieldProps) {
    const [visible, setVisible] = useState(false)

    return (
        <div className={`${styles.campoSenha} ${shake ? styles.shake : ''}`}>
            <label htmlFor={props.id} className={styles.label}>
                {label}
            </label>

            <div className={styles.inputWrapper}>
                <input
                    {...props}
                    type={visible ? 'text' : 'password'}
                    className={`${styles.input} ${styles.senhaInput} ${status ? styles[status] : ''}`}
                />
                <button
                    type="button"
                    className={`${styles.eyeBtn} ${visible ? styles.active : ''}`}
                    onClick={() => setVisible(v => !v)}
                    aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
                >
                    {visible
                        ? <img src={olhoAberto} alt="Mostrar" />
                        : <img src={olhoFechado} alt="Ocultar" />
                    }
                </button>
            </div>

            {error && <small className={styles.erroSenha}>{error}</small>}
        </div>
    )
}