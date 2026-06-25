import styles from './PasswordStrengthMeter.module.css'

interface PasswordStrengthMeterProps {
    strength: 'fraca' | 'media' | 'forte' | string
    visible: boolean
}

export default function PasswordStrengthMeter({ strength, visible }: PasswordStrengthMeterProps) {
    // Se o usuário não começou a digitar, o medidor não aparece
    if (!visible) return null

    const getStrengthLabel = () => {
        if (strength === 'media') return 'Média'
        if (strength === 'forte') return 'Forte'
        return 'Fraca'
    }

    // Define quais barras devem estar acesas
    const isBarra1Ativa = strength === 'fraca' || strength === 'media' || strength === 'forte'
    const isBarra2Ativa = strength === 'media' || strength === 'forte'
    const isBarra3Ativa = strength === 'forte'

    return (
        <div className={`${styles.forcaContainer} ${styles[strength] || styles.fraca}`}>
            <div className={styles.barras}>
                <div className={`${styles.barra} ${isBarra1Ativa ? styles.barraAtiva : ''}`} />
                <div className={`${styles.barra} ${isBarra2Ativa ? styles.barraAtiva : ''}`} />
                <div className={`${styles.barra} ${isBarra3Ativa ? styles.barraAtiva : ''}`} />
            </div>
            
            <span className={`${styles.forcaTexto} ${styles[strength] || styles.fraca}`}>
                Segurança: <strong>{getStrengthLabel()}</strong>
            </span>
        </div>
    );
}