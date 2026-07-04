import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha/InformeEmail/InformeEmail";
import InformeToken from "./pages/RecuperarSenha/InformeToken/InformeToken";
import InformeNovaSenha from "./pages/RecuperarSenha/InformeNovaSenha/InformeNovaSenha";
import Home from "./pages/Home/Home";
import Busca from "./pages/Busca/Busca";
import ProdutoDetalhe from "./pages/ProdutoDetalhe/ProdutoDetalhe";
import { useRouter } from "./router/useRouter";
import { ProdutoProvider } from "./store/produtoStore";

export default function App() {
  const { route, navigate } = useRouter();

  return (
    <ProdutoProvider>
      {route === "home" && <Home navigate={navigate} />}
      {route === "busca" && <Busca navigate={navigate} />}
      {route === "login" && <Login navigate={navigate} />}
      {route === "cadastro" && <Cadastro navigate={navigate} />}
      {route === "recuperarSenha" && <RecuperarSenha navigate={navigate} />}
      {route === "informeToken" && <InformeToken navigate={navigate} />}
      {route === "informeNovaSenha" && <InformeNovaSenha navigate={navigate} />}
      {route === "produtoDetalhe" && <ProdutoDetalhe navigate={navigate} />}
    </ProdutoProvider>
  );
}