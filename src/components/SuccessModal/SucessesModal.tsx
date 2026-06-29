import styles from "./SucessesModal.module.css";
import BtnPrincipal from "../../components/BtnPrincipal/BtnPrincipal";

interface SuccessModalProps {
    open: boolean;
    title: string;
    message: string;
    buttonText: string;
    onConfirm: () => void;
}

export default function SuccessModal({
    open,
    title,
    message,
    buttonText,
    onConfirm,
}: SuccessModalProps) {
    if (!open) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                <div className={styles.icon}>
                    <svg
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M20 6L9 17L4 12"
                            stroke="white"
                            strokeWidth="2.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <h2 className={styles.title}>
                    {title}
                </h2>

                <p className={styles.message}>
                    {message}
                </p>

                <BtnPrincipal
                    text={buttonText}
                    onClick={onConfirm}
                />

            </div>
        </div>
    );
}