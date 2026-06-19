import styles from './PasswordRequirements.module.css'

interface PasswordRequirementsProps {
    requirements: {
        tamanho: boolean
        minuscula: boolean
        maiuscula: boolean
        numero: boolean
        especial: boolean
    }
    value: string
}

export default function PasswordRequirements({ requirements, value }: PasswordRequirementsProps) {
    const hasStartedTyping = value.length > 0

    const listItems = [
        { key: 'tamanho', label: 'Pelo menos 8 caracteres' },
        { key: 'maiuscula', label: 'Pelo menos uma letra maiúscula' },
        { key: 'minuscula', label: 'Pelo menos uma letra minúscula' },
        { key: 'numero', label: 'Pelo menos um número' },
        { key: 'especial', label: 'Pelo menos um caractere especial' },
    ] as const

    return (
        <div className={styles.cardRequisitos}>
            <h4 className={styles.titulo}>Dicas de segurança</h4>
            <ul className={styles.lista}>
                {listItems.map(({ key, label }) => {
                    // Se o usuário não digitou nada ainda, fica neutro/erro. Se digitou, valida o boolean.
                    const isValid = hasStartedTyping ? requirements[key] : false

                    return (
                        <li 
                            key={key} 
                            className={`${styles.item} ${isValid ? styles.valido : styles.invalido}`}
                        >
                            {isValid ? (
                                /* Ícone de Check (Sucesso) */
                                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            ) : (
                                /* Ícone de X (Erro) idêntico à imagem */
                                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                            <span className={styles.texto}>{label}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}