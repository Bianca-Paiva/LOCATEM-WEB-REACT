import HeaderContainer from "./HeaderContainer";
import Logo from "./Logo";

function HeaderLogoChat() {
    return (
        <HeaderContainer>
            <div className="header-top header-top-chat">
                <Logo />

                <button className="chat">
                    <img src="/src/assets/chat.png" alt="Chat" />
                </button>
            </div>
        </HeaderContainer>
    );
}

export default HeaderLogoChat;