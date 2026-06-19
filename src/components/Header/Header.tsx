import { useState, useEffect } from 'react'
import type { Route } from '../../router/useRouter'
import logoIcon from '../../assets/LogoIcon.png'
import menuHamburguer from '../../assets/menuHamburguer.png'
import carrinho from '../../assets/carrinho.png'
import lupa from '../../assets/lupa.png'
import chat from '../../assets/chat.png'
import home from '../../assets/home.png'
import relogio from '../../assets/relogio.png'
import calendario from '../../assets/calendario.png'
import notificacoes from '../../assets/notificacoes.png'
import star from '../../assets/Star.png'
import suporte from '../../assets/suporte.png'
import usuario from '../../assets/usuario.png'
import styles from './Header.module.css'

interface HeaderProps {
    navigate: (route: Route) => void
    currentRoute: Route
}

export default function Header({ navigate, currentRoute }: HeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false)

    // lock scroll when menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    // close on ESC
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [])

    const navItems: { label: string; icon: string; route?: Route; href?: string }[] = [
        { label: 'Início', icon: home, route: 'home' },
        { label: 'Carrinho', icon: carrinho },
        { label: 'Histórico', icon: relogio },
        { label: 'Agendamento', icon: calendario },
        { label: 'Notificações', icon: notificacoes },
        { label: 'Avaliações', icon: star },
        { label: 'Suporte', icon: suporte },
        { label: 'Entrar', icon: usuario, route: 'login' },
    ]

    return (
        <>
            {/* ── MOBILE HEADER ── */}
            <header className={styles.headerMobile}>
                <div className={styles.linhaTopo}>
                    <div className={styles.ladoEsquerdo}>
                        <button
                            className={styles.menuBtn}
                            onClick={() => setMenuOpen(true)}
                            aria-label="Abrir menu"
                        >
                            <img src={menuHamburguer} alt="Menu" />
                        </button>
                        <a
                            href="#"
                            className={styles.logo}
                            onClick={e => { e.preventDefault(); navigate('home') }}
                        >
                            <img src={logoIcon} alt="Logo LOCATEM" />
                            LOCATEM
                        </a>
                    </div>
                    <a href="#" className={styles.carrinhoBtn}>
                        <img src={carrinho} alt="Carrinho" />
                        <span className={styles.quantidadeCarrinho}>2</span>
                    </a>
                </div>
                <form className={styles.barraPesquisaMobile} onSubmit={e => e.preventDefault()}>
                    <img src={lupa} alt="Buscar" />
                    <input type="search" placeholder="Qual ferramenta você precisa hoje?" />
                </form>
            </header>

            {/* ── DRAWER OVERLAY ── */}
            <div
                className={`${styles.menuLateralOverlay} ${menuOpen ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)}
            />

            {/* ── DRAWER ── */}
            <aside
                className={`${styles.menuLateral} ${menuOpen ? styles.active : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navegação"
            >
                <div className={styles.menuLateralCabecalho}>
                    <a
                        href="#"
                        className={styles.menuLateralLogo}
                        onClick={e => { e.preventDefault(); navigate('home'); setMenuOpen(false) }}
                    >
                        <img src={logoIcon} alt="Logo LOCATEM" />
                        LOCATEM
                    </a>
                    <button
                        className={styles.menuLateralBtnFechar}
                        onClick={() => setMenuOpen(false)}
                        aria-label="Fechar menu"
                    >
                        ✕
                    </button>
                </div>

                <div className={styles.menuLateralConteudo}>
                    <nav className={styles.menuLateralNav}>
                        {navItems.map(item => (
                            <a
                                key={item.label}
                                href="#"
                                className={item.route === currentRoute ? styles.ativo : ''}
                                onClick={e => {
                                    e.preventDefault()
                                    if (item.route) navigate(item.route)
                                    setMenuOpen(false)
                                }}
                            >
                                <img src={item.icon} alt="" />
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* ── DESKTOP HEADER ── */}
            <header className={styles.headerDesktop}>
                <div className={styles.linhaTopo}>
                    <a
                        href="#"
                        className={styles.logo}
                        onClick={e => { e.preventDefault(); navigate('home') }}
                    >
                        <img src={logoIcon} alt="Logo LOCATEM" />
                        LOCATEM
                    </a>
                    <form className={styles.barraPesquisa} onSubmit={e => e.preventDefault()}>
                        <button type="submit" className={styles.lupaBtn}>
                            <img src={lupa} alt="Buscar" />
                        </button>
                        <input type="search" placeholder="Qual ferramenta você precisa hoje?" />
                    </form>
                    <a href="#" className={styles.chatBtn}>
                        <img src={chat} alt="Chat" />
                    </a>
                </div>
            </header>

            {/* ── DESKTOP NAV ── */}
            <nav className={styles.menuNavDesktop}>
                {navItems.map(item => (
                    <a
                        key={item.label}
                        href="#"
                        className={item.route === currentRoute ? styles.ativo : ''}
                        onClick={e => {
                            e.preventDefault()
                            if (item.route) navigate(item.route)
                        }}
                    >
                        <img src={item.icon} alt="" />
                        {item.label}
                    </a>
                ))}
            </nav>
        </>
    )
}