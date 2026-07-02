import type { InputHTMLAttributes } from 'react'
import styles from './FormInput.module.css'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    status?: 'erro' | 'sucesso' | ''
    shake?: boolean
}

export default function FormInput({
    label,
    error,
    status = '',
    shake = false,
    ...props
}: FormInputProps) {
    return (
            <div className={`${styles.wrapper} ${shake ? styles.shake : ''}`}>
                <label htmlFor={props.id} className={styles.label}>
                    {label}
                    {props.required && <span className={styles.required}> *</span>}
                    
                </label>
                <input
                    {...props}
                    className={`${styles.input} ${status ? styles[status] : ''}`}
                />
                {error && <small className={styles.error}>{error}</small>}
            </div>
        );
}