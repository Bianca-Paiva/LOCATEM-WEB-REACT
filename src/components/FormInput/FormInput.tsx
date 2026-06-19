import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import styles from './FormInput.module.css'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    status?: 'erro' | 'sucesso' | ''
    shake?: boolean
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, status = '', shake = false, ...props }, ref) => {
        return (
            <div className={`${styles.wrapper} ${shake ? styles.shake : ''}`}>
                <label htmlFor={props.id} className={styles.label}>
                    {label}
                </label>
                <input
                    ref={ref}
                    {...props}
                    className={`${styles.input} ${status ? styles[status] : ''}`}
                />
                {error && <small className={styles.error}>{error}</small>}
            </div>
        )
    }
)

FormInput.displayName = 'FormInput'
export default FormInput
