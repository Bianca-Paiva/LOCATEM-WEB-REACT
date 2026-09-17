import styles from "./CardOpcaoConta.module.css";

import { User } from "lucide-react";
import { Icon } from "@iconify/react"; // ícone tools (ferramentas)


interface CardOpcaoContaProps {
    id: string;
    name: string;
    value: 'locador' | 'locatario';
    selected: boolean;
    title: string;
    description: string;
    onChange: (value: 'locador' | 'locatario') => void;
}

export default function CardOpcaoConta({
    id,
    name,
    value,
    selected,
    title,
    description,
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
                    {value === "locatario" ? (
                        <User size={24} />
                    ) : (
                        <Icon icon="mdi:tools" width={24} height={24} />
                    )}
                </div>

                <h3>{title}</h3>

                <p>{description}</p>
            </label>
        </>
    );
}