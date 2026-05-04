import "./navDesktop.css"

function NavDesktop() {
    return (
        <nav className="menu-navegacao-desktop">
            <a href="#">
                <img src="//src/assets/home.png" alt="Ícone Início" />Início
            </a>
            <a href="#">
                <img src="//src/assets/carrinho.png" alt="Ícone Carrinho" />Carrinho
            </a>
            <a href="#">
                <img src="//src/assets/relogio.png" alt="Ícone Histórico" />Histórico
            </a>
            <a href="#">
                <img src="//src/assets/calendario.png" alt="Ícone Agendamento" />Agendamento
            </a>
            <a href="#">
                <img src="//src/assets/notificacoes.png" alt="Ícone Notificações" />Notificações
            </a>
            <a href="#">
                <img src="//src/assets/Star.png" alt="Ícone Avaliações" />Avaliações
            </a>
            <a href="#">
                <img src="//src/assets/suporte.png" alt="Ícone Suporte" />Suporte
            </a>
            <a href="#">
                <img src="//src/assets/usuario.png" alt="Ícone Entrar" />Entrar
            </a>
        </nav>
    )
}

export default NavDesktop;