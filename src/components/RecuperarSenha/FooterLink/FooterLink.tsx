import styles from './FooterLink.module.css'

interface FooterLinkProps {
    text: string        
    linkText: string    
    onLinkClick: () => void // Função que executa a navegação
}

export default function FooterLink({ text, linkText, onLinkClick }: FooterLinkProps) {
    return (
        <div className={styles.linkContainer}>
            <span className={styles.text}>{text}</span>
            <button 
                type="button" 
                className={styles.linkButton} 
                onClick={onLinkClick}
            >
                {linkText}
            </button>
        </div>
    )
}