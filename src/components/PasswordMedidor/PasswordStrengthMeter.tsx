import styles from './PasswordStrengthMeter.module.css'

interface PasswordStrengthMeterProps {
    strength: 'fraca' | 'media' | 'forte' | string
    visible: boolean
}

export default function PasswordStrengthMeter({ strength, visible }: PasswordStrengthMeterProps) {
    // Se o usuário não começou a digitar, o medidor não aparece
    if (!visible) return null

    const getStrengthLabel = () => {
        switch (strength) {
            case 'media': return 'Média'
            case 'forte': return 'Forte'
            default: return 'Fraca'
        }
    }

    return (
        <div className={styles.forcaContainer}>
            <div className={styles.barras}>
                <div className={`${styles.barra} ${strength ? styles.ativaFraca : ''}`} />
                <div className={`${styles.barra} ${(strength === 'media' || strength === 'forte') ? styles.ativaMedia : ''}`} />
                <div className={`${styles.barra} ${strength === 'forte' ? styles.ativaForte : ''}`} />
            </div>
            
            <span className={`${styles.forcaTexto} ${styles[strength] || styles.fraca}`}>
                Segurança: <strong>{getStrengthLabel()}</strong>
            </span>
        </div>
    )
}