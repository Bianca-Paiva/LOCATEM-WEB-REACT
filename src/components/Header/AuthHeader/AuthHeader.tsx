import type { Route } from '../../../router/useRouter'
import logoIcon from '../../../assets/LogoIcon.png'
import styles from './AuthHeader.module.css'

interface AuthHeaderProps {
    navigate: (route: Route) => void
}

export default function AuthHeader({ navigate }: AuthHeaderProps) {
    return (
            <header className={styles.header}>
                <div className={styles.container}>
                    <a
                        href="#"
                        className={styles.logo}
                        onClick={(e) => {
                            e.preventDefault()
                            navigate('home')
                        }}
                    >
                        <img src={logoIcon} alt="Logo LOCATEM" />
                        LOCATEM
                    </a>
                </div>
            </header>
    )
}