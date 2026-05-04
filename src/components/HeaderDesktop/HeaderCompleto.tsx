import HeaderContainer from "./HeaderContainer";
import Logo from "./Logo";

function HeaderLogoChatSearch() {
    return (
        <HeaderContainer>
            <div className="header-top">
                <Logo />

                <form className="search-bar">
                    <input type="search" placeholder="Buscar ferramentas..." />
                    <button type="submit">
                        <img src="/src/assets/lupa.png" alt="Buscar" />
                    </button>
                </form>

                <button className="chat">
                    <img src="/src/assets/chat.png" alt="Chat" />
                </button>
            </div>
        </HeaderContainer>
    );
}

export default HeaderLogoChatSearch;