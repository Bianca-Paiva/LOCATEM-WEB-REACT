import type { ReactNode } from 'react'
import Header from '../components/Header/Header'
import type { Route } from '../router/useRouter'
import styles from './MainLayout.module.css'

interface MainLayoutProps {
    children: ReactNode
    navigate: (route: Route) => void
    currentRoute: Route
}

export default function MainLayout({ children, navigate, currentRoute }: MainLayoutProps) {
    return (
        <div className={styles.app}>
            <Header navigate={navigate} currentRoute={currentRoute} />
            {children}
        </div>
    )
}
