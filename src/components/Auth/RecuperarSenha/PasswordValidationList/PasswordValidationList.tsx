import { Check, X } from "lucide-react";
import styles from './PasswordValidationList.module.css'

interface ValidationItem {
    label: string
    valid: boolean
}

interface ValidationListProps {
    title: string
    items: ValidationItem[]
}

export default function ValidationList({
    title,
    items,
}: ValidationListProps) {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>{title}</h3>

            <div className={styles.list}>
                {items.map((item) => (
                    <div key={item.label} className={styles.item}>
                        {item.valid ? (
                            <Check className={styles.iconCheck} />
                        ) : (
                            <X className={styles.iconX} />
                        )}

                        <span
                            className={`${styles.label} ${item.valid ? styles.valid : styles.invalid
                                }`}
                        >
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}