import styles from './PageHeader.module.css'

interface PageHeaderProps {
    title: string
    subtitle: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <div className={styles.headerContainer}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
        </div>
    )
}