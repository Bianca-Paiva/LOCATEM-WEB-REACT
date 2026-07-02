import styles from "./CardOpcaoConta.module.css";
import type { ReactNode } from "react";


interface CardOpcaoContaProps {
    id: string;
    name: string;
    value: 'locador' | 'locatario';
    selected: boolean;
    title: string;
    description: string;
    icon: ReactNode;
    onChange: (value: 'locador' | 'locatario') => void;
}

export default function CardOpcaoConta({
    id,
    name,
    value,
    selected,
    title,
    description,
    icon,
    onChange,
}: CardOpcaoContaProps) {
    return (
        <>
            <input
                type="radio"
                id={id}
                name={name}
                value={value}
                checked={selected}
                onChange={() => onChange(value)}
                className={styles.radioHidden}
            />

            <label
                htmlFor={id}
                className={`${styles.cardTipo} ${selected ? styles.cardTipoSelected : ""}`}
            >
                <div
                    className={`${styles.icone} ${selected ? styles.iconeSelected : ""}`}
                >
                    {icon}
                </div>

                <h3>{title}</h3>

                <p>{description}</p>
            </label>
        </>
    );
}