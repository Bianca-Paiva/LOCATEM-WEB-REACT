import { useState, useEffect } from 'react'
import type { ReactNode, FormEvent } from "react";
import type { Route } from '../../router/useRouter'
import logoIcon from '../../assets/LogoIcon.png'
import { Icon } from "@iconify/react"; // home, bell-outline, account-circle-outline, menu, cart-outline, magnify, star 
import { X, LogOut } from "lucide-react";
import { useCarrinhoStore } from '../../hooks/useCarrinhoStore'
import { useAuth } from '../../hooks/useAuth'
import { useBuscaStore } from '../../hooks/useBuscaStore'
import type { TipoUsuario } from '../../types/usuario.types'
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
    /** Restringe o item a este(s) tipo(s) de usuário. Ausente = visível para locador, locatário e visitante não autenticado. */
    perfis?: TipoUsuario[];
}

export default function Header({ navigate, currentRoute }: HeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const { itens: itensCarrinho } = useCarrinhoStore()
    const quantidadeCarrinho = itensCarrinho.length
    const { usuario, isAuthenticated, logout } = useAuth()
    const { termoBusca, setTermoBusca } = useBuscaStore()

    // Autenticado -> avatar leva para o Perfil; não autenticado -> mantém o comportamento atual (leva para o Login).
    const rotaConta: Route = isAuthenticated ? 'perfil' : 'login'

    // Mesmo comportamento do botão "Sair da Conta" já existente no Perfil: encerra a sessão e volta pra Home.
    const handleLogout = () => {
        logout()
        setMenuOpen(false)
        navigate('home')
    }

    // Submit da barra de busca (desktop e mobile): o termo já fica salvo no BuscaContext a
    // cada digitação (onChange), então aqui só falta navegar pra página de Busca lê-lo.
    const handleSubmitBusca = (e: FormEvent) => {
        e.preventDefault()
        navigate('busca')
    }

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
            route: "home", // aparece para: locador e locatário
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
            route: "carrinho", // aparece para: locatário
            perfis: ['locatario'],
            renderIcon: (active) => (
                <Icon
                    icon={active ? "mdi:cart" : "mdi:cart-outline"}
                    width={22}
                    height={22}
                />
            ),
        },
        {
            label: "Minhas Locações",
            route: "minhasLocacoes", // aparece para: locatário
            perfis: ['locatario'],
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
            route: "minhasFerramentas", // aparece para: locador
            perfis: ['locador'],
            renderIcon: (active) => (
                <Icon
                    icon={active ? "material-symbols:package-2" : "material-symbols:package-2-outline"}
                    width={22}
                    height={22}
                />
            ),
        },
        {
            label: "Histórico", // aparece para: locatário
            perfis: ['locatario'],
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
            route: "avaliacao", // aparece para: locador (avalia locatário, processo de entrega/despache e receber devolta, plataforma) e locatário (avalia locador, entrega e devolução, produto, plataforma)
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
            route: "notificacoes", // aparece para: locador e locatário
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
            label: "Suporte", // aparece para: locador e locatário
            renderIcon: (active) => (
                <Icon
                    icon={active ? "material-symbols:headset-mic" : "material-symbols:headset-mic-outline"}
                    width={22}
                    height={22}
                />
            ),
        },
    ];

    // Monta a navegação de fato exibida a partir do tipo do usuário autenticado (mesma fonte
    // usada em todo o app via useAuth) — desktop e mobile usam esta mesma lista filtrada,
    // então nunca ficam com regras diferentes entre si. Sem sessão, mantém o comportamento
    // atual (todos os itens visíveis).
    const navItemsVisiveis = navItems.filter(
        (item) => !item.perfis || !usuario || item.perfis.includes(usuario.tipo),
    );

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
                <form className={styles.barraPesquisaMobile} onSubmit={handleSubmitBusca}>
                    <Icon icon="mdi:magnify" width={20} height={20} opacity={0.55} />
                    <input
                        type="search"
                        placeholder="Qual ferramenta você precisa hoje?"
                        value={termoBusca}
                        onChange={e => setTermoBusca(e.target.value)}
                    />
                    {termoBusca && (
                        <button
                            type="button"
                            className={styles.limparBuscaBtn}
                            aria-label="Limpar busca"
                            onClick={() => setTermoBusca('')}
                        >
                            <X size={18} />
                        </button>
                    )}
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
                        {navItemsVisiveis.map(item => {
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

                    {isAuthenticated && (
                        <button type="button" className={styles.menuLateralBtnSair} onClick={handleLogout}>
                            <LogOut size={16} />
                            Sair da Conta
                        </button>
                    )}
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
                    <form className={styles.barraPesquisa} onSubmit={handleSubmitBusca}>
                        <button type="submit" className={styles.lupaBtn}>
                            <Icon icon="mdi:magnify" width={20} height={20} opacity={0.55} />
                        </button>
                        <input
                            type="search"
                            placeholder="Qual ferramenta você precisa hoje?"
                            value={termoBusca}
                            onChange={e => setTermoBusca(e.target.value)}
                        />
                        {termoBusca && (
                            <button
                                type="button"
                                className={styles.limparBuscaBtn}
                                aria-label="Limpar busca"
                                onClick={() => setTermoBusca('')}
                            >
                                <X size={18} />
                            </button>
                        )}
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
                    {navItemsVisiveis.map(item => {
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