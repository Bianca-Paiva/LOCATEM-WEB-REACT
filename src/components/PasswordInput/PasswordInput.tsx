import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import olhoAberto from '../../assets/olhoAberto.svg'
import olhoFechado from '../../assets/olhoFechado.svg'
import styles from './PasswordInput.module.css'
import type { PasswordStrengthResult } from '../../hooks/passwordStrength'
import { useEffect } from 'react'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    status?: 'erro' | 'sucesso' | ''
    strengthResult?: PasswordStrengthResult
    showRequirements?: boolean
    shake?: boolean
}

export default function PasswordInput({
    label,
    error,
    status = '',
    shake = false,
    ...props
}: PasswordInputProps) {
    const [visible, setVisible] = useState(false)

    console.log('render', shake)
    useEffect(() => {
        console.log('shake mudou:', shake)
    }, [shake])

    return (
        <div className={`${styles.campoSenha} ${shake ? styles.shake : ''}`}>
            <label htmlFor={props.id} className={styles.label}>
                {label}
                {props.required && <span className={styles.required}> *</span>}
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