import { useEffect } from 'react';
import styles from './Alerta.module.css';

interface AlertaProps {
    titulo: string
    mensagem: string
    onClose: () => void
}

export default function Alerta({ titulo, mensagem, onClose } : AlertaProps) {

    useEffect(() => {
        // Define o timer de 15 segundos (15000 milissegundos)
        const timer = setTimeout(() => {
            onClose();
        }, 15000);

        // Limpa o timer se o componente for desmontado antes dos 15s 
        // ou se o usuário fechar manualmente
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={styles.alertContainer}>
            <div className={styles.alertIcon}>!</div>
            <div className={styles.alertContent}>
                <h4>{titulo}</h4>
                <p>{mensagem}</p>
            </div>
            <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>
    )
}