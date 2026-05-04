import HeaderContainer from "./HeaderContainer";
import Logo from "./Logo";

function HeaderLogo() {
    return (
        <HeaderContainer>
            <div className="header-top">
                <Logo />
            </div>
        </HeaderContainer>
    );
}

export default HeaderLogo;