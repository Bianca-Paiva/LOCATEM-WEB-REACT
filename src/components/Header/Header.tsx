import { useState, useEffect } from 'react'
import type { ReactNode } from "react";
import type { Route } from '../../router/useRouter'
import logoIcon from '../../assets/LogoIcon.png'
import { Icon } from "@iconify/react"; // home, bell-outline, account-circle-outline, menu, cart-outline, magnify, star 
import {
    X
} from "lucide-react";
import { useCarrinhoStore } from '../../hooks/useCarrinhoStore'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../Avatar/Avatar'
import styles from './Header.module.css'


interface HeaderProps {
    navigate: (route: Route) => void
    currentRoute: Route
}

interface NavItem {
    label: string;
    route?: Route;
    href?: string;
    renderIcon: (active: boolean) => ReactNode;
}

export default function Header({ navigate, currentRoute }: HeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const { itens: itensCarrinho } = useCarrinhoStore()
    const quantidadeCarrinho = itensCarrinho.length
    const { usuario, isAuthenticated } = useAuth()

    // Autenticado -> avatar leva para o Perfil; não autenticado -> mantém o
    // comportamento atual (leva para o Login).
    const rotaConta: Route = isAuthenticated ? 'perfil' : 'login'

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

    const navItems: NavItem[] = [
        {
            label: "Início",
            route: "home",
            renderIcon: (active) => (
                <Icon
                    icon={active ? "mdi:home" : "mdi:home-outline"}
                    width={22}
                    height={22}
                />
            ),
        },
        {
            label: "Carrinho",
            route: "carrinho",
            renderIcon: (active) => (
                <Icon
                    icon={active ? "mdi:cart" : "mdi:cart-outline"}
                    width={22}
                    height={22}
                />
            ),
        },
        {
            label: "Minhas Reservas",
            route: "minhasReservas",
            renderIcon: (active) => (
                <Icon
                    icon={active ? "mdi:calendar-blank" : "mdi:calendar-blank-outline"}
                    width={22}
                    height={22}
                />
            ),
        },
        {
            label: "Minhas Ferramentas",
            route: "minhasFerramentas",
            renderIcon: (active) => (
                <Icon
                    icon={active ? "material-symbols:package-2" : "material-symbols:package-2-outline"}
                    width={22}
                    height={22}
                />
            ),
        },
        {
            label: "Histórico",
            renderIcon: (active) => (
                <Icon
                    icon={active ? "mdi:clock" : "mdi:clock-outline"}
                    width={22}
                    height={22}
                />
            ),
        },
        {
            label: "Avaliações",
            route: "avaliacao",
            renderIcon: (active) => (
                <Icon
                    icon={active ? "mdi:star" : "mdi:star-outline"}
                    width={22}
                    height={22}
                />
            ),
        },
        {
            label: "Notificações",
            route: "notificacoes",
            renderIcon: (active) => (
                <Icon
                    icon={active ? "mdi:bell" : "mdi:bell-outline"}
                    width={22}
                    height={22}
                />
            ),
        },
        // {
        //     label: "Entrar",
        //     route: "login",
        //     renderIcon: (active) => (
        //         <Icon
        //             icon={active ? "mdi:account-circle" : "mdi:account-circle-outline"}
        //             width={22}
        //             height={22}
        //         />
        //     ),
        // },
        {
            label: "Suporte",
            renderIcon: (active) => (
                <Icon
                    icon={active ? "material-symbols:headset-mic" : "material-symbols:headset-mic-outline"}
                    width={22}
                    height={22}
                />
            ),
        },
    ];

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
                            <Icon icon="mdi:menu" width={26} height={26} />
                        </button>
                        <a
                            href="../../pages/Home/Home.tsx"
                            className={styles.logo}
                            onClick={e => { e.preventDefault(); navigate('home') }}
                        >
                            <img src={logoIcon} alt="Logo LOCATEM" />
                            LOCATEM
                        </a>
                    </div>
                    <div className={styles.ladoDireito}>
                        <a
                            href="#"
                            className={styles.carrinhoBtn}
                            onClick={e => { e.preventDefault(); navigate('carrinho') }}
                        >
                            <Icon icon="mdi:cart-outline" width={24} height={24} />
                            {quantidadeCarrinho > 0 && (
                                <span className={styles.quantidadeCarrinho}>{quantidadeCarrinho}</span>
                            )}
                        </a>

                        <a
                            href="#"
                            className={styles.contaBtnMobile}
                            aria-label={isAuthenticated ? 'Meu perfil' : 'Entrar'}
                            onClick={e => { e.preventDefault(); navigate(rotaConta) }}
                        >
                            {isAuthenticated && usuario ? (
                                <Avatar nome={usuario.nome} fotoUrl={usuario.fotoUrl} size={30} />
                            ) : (
                                <Icon icon="mdi:account-circle-outline" width={26} height={26} />
                            )}
                        </a>
                    </div>
                </div>
                <form className={styles.barraPesquisaMobile} onSubmit={e => e.preventDefault()}>
                    <Icon icon="mdi:magnify" width={20} height={20} opacity={0.55} />
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
                        href="../../pages/Home/Home.tsx"
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
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.menuLateralConteudo}>
                    <nav className={styles.menuLateralNav}>
                        {navItems.map(item => {
                            const active = item.route === currentRoute;

                            return (
                                <a
                                    key={item.label}
                                    href="#"
                                    className={active ? styles.ativo : ""}
                                    onClick={e => {
                                        e.preventDefault();
                                        if (item.route) navigate(item.route);
                                        setMenuOpen(false);
                                    }}
                                >
                                    {item.renderIcon(active)}
                                    {item.label}
                                </a>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* ── DESKTOP HEADER ── */}
            <header className={styles.headerDesktop}>
                <div className={styles.linhaTopo}>
                    <a
                        href="../../pages/Home/Home.tsx"
                        className={styles.logo}
                        onClick={e => { e.preventDefault(); navigate('home') }}
                    >
                        <img src={logoIcon} alt="Logo LOCATEM" />
                        LOCATEM
                    </a>
                    <form className={styles.barraPesquisa} onSubmit={e => e.preventDefault()}>
                        <button type="submit" className={styles.lupaBtn}>
                            <Icon icon="mdi:magnify" width={20} height={20} opacity={0.55} />
                        </button>
                        <input type="search" placeholder="Qual ferramenta você precisa hoje?" />
                    </form>
                    <a
                        href="#"
                        className={styles.loginBtn}
                        aria-label={isAuthenticated ? 'Meu perfil' : 'Entrar'}
                        onClick={e => { e.preventDefault(); navigate(rotaConta) }}
                    >
                        {isAuthenticated && usuario ? (
                            <Avatar nome={usuario.nome} fotoUrl={usuario.fotoUrl} size={38} />
                        ) : (
                            <Icon icon="mdi:account-circle-outline"
                                width={32}
                                height={32}
                            />
                        )}
                    </a>
                </div>

                {/* ── DESKTOP NAV MOVIDO PARA DENTRO DO HEADER ── */}
                <nav className={styles.menuNavDesktop}>
                    {navItems.map(item => {
                        const active = item.route === currentRoute;

                        return (
                            <a
                                key={item.label}
                                href="#"
                                className={active ? styles.ativo : ""}
                                onClick={e => {
                                    e.preventDefault();
                                    if (item.route) navigate(item.route);
                                }}
                            >
                                {item.renderIcon(active)}
                                {item.label}
                            </a>
                        );
                    })}
                </nav>
            </header>
        </>
    );
}