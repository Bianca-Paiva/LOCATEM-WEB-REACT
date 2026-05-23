import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import olhoAberto from '../../assets/olhoAberto.svg'
import olhoFechado from '../../assets/olhoFechado.svg'
import styles from './PasswordField.module.css'
import type { PasswordStrengthResult } from '../../hooks/usePasswordStrength'

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    status?: 'erro' | 'sucesso' | ''
    strengthResult?: PasswordStrengthResult
    showRequirements?: boolean
}

export default function PasswordField({
    label,
    error,
    status = '',
    strengthResult,
    showRequirements = false,
    ...props
}: PasswordFieldProps) {
    const [visible, setVisible] = useState(false)
    const [focused, setFocused] = useState(false)

    const reqVisible = showRequirements && (focused || (props.value as string)?.length > 0)

    return (
        <div className={styles.campoSenha}>
            <label htmlFor={props.id} className={styles.label}>
                {label}
            </label>

            <div className={styles.inputWrapper}>
                <input
                    {...props}
                    type={visible ? 'text' : 'password'}
                    className={`${styles.input} ${styles.senhaInput} ${status ? styles[status] : ''}`}
                    onFocus={e => { setFocused(true); props.onFocus?.(e) }}
                    onBlur={e => { setFocused(false); props.onBlur?.(e) }}
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

            {strengthResult && (strengthResult.strength !== '') && (
                <small className={`${styles.forcaSenha} ${styles[strengthResult.strength]}`}>
                    {strengthResult.strength === 'fraca' && 'Senha fraca'}
                    {strengthResult.strength === 'media' && 'Senha média'}
                    {strengthResult.strength === 'forte' && 'Senha forte'}
                </small>
            )}

            {error && <small className={styles.erroSenha}>{error}</small>}

            {showRequirements && strengthResult && (
                <ul className={`${styles.requisitos} ${reqVisible ? styles.ativo : ''}`}>
                    {(
                        [
                            ['tamanho', 'Mínimo 8 caracteres'],
                            ['minuscula', 'Letra minúscula'],
                            ['maiuscula', 'Letra maiúscula'],
                            ['numero', 'Número'],
                            ['especial', 'Caractere especial'],
                        ] as const
                    ).map(([key, label]) => (
                        <li
                            key={key}
                            className={
                                (props.value as string)?.length > 0
                                    ? strengthResult.requirements[key]
                                        ? styles.ok
                                        : styles.reqErro
                                    : ''
                            }
                        >
                            {label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}