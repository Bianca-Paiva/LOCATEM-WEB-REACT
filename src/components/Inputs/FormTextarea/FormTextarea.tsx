import type { TextareaHTMLAttributes } from 'react'
// Reaproveita o mesmo CSS module do FormInput para manter a identidade visual
import styles from '../FormInput/FormInput.module.css'

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    error?: string
    status?: 'erro' | 'sucesso' | ''
    shake?: boolean
}

export default function FormTextarea({
    label,
    error,
    status = '',
    shake = false,
    ...props
}: FormTextareaProps) {
    return (
        <div className={`${styles.wrapper} ${shake ? styles.shake : ''}`}>
            <label htmlFor={props.id} className={styles.label}>
                {label}
                {props.required && <span className={styles.required}> *</span>}
            </label>
            <textarea
                {...props}
                className={`${styles.textarea} ${status ? styles[status] : ''}`}
            />
            {error && <small className={styles.error}>{error}</small>}
        </div>
    )
}