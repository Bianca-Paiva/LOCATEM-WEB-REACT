import styles from './FooterLink.module.css'

interface FooterLinkProps {
    text: string        
    linkText: string    
    onClick: () => void // Função que executa a navegação
}

export default function FooterLink({ text, linkText, onClick }: FooterLinkProps) {
    return (
        <div className={styles.linkContainer}>
            <span className={styles.text}>{text}</span>
            <button 
                type="button" 
                className={styles.linkButton} 
                onClick={onClick}
            >
                {linkText}
            </button>
        </div>
    )
}