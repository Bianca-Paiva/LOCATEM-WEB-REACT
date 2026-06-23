import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha/InformeEmail/InformeEmail";
import InformeToken from "./pages/RecuperarSenha/InformeToken/InformeToken";
import InformeNovaSenha from "./pages/RecuperarSenha/InformeNovaSenha/InformeNovaSenha";
import Home from "./pages/Home/Home";
// import Produto from './pages/Produtos/Produtos'
import Busca from "./pages/Busca/Busca";

import { useRouter } from "./router/useRouter";

export default function App() {
  const { route, navigate } = useRouter();

  if (route === "home") return <Home navigate={navigate} />;

  if (route === "busca") return <Busca navigate={navigate} />;

//   if (route === "produto") return <Produto navigate={navigate} />;

  if (route === "login") return <Login navigate={navigate} />;

  if (route === "cadastro") return <Cadastro navigate={navigate} />;

  if (route === "recuperarSenha") return <RecuperarSenha navigate={navigate} />;

  if (route === "informeToken") return <InformeToken navigate={navigate} />;

  if (route === "informeNovaSenha")
    return <InformeNovaSenha navigate={navigate} />;

  return null;
}
