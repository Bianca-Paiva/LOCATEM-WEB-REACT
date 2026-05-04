import "./header.css";

function HeaderContainer({ children }: { children: React.ReactNode }) {
    return <header className="header">{children}</header>;
}

export default HeaderContainer;