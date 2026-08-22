import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha/InformeEmail/InformeEmail";
import InformeToken from "./pages/RecuperarSenha/InformeToken/InformeToken";
import InformeNovaSenha from "./pages/RecuperarSenha/InformeNovaSenha/InformeNovaSenha";
import Home from "./pages/Home/Home";
import Busca from "./pages/Busca/Busca";
import Notificacoes from "./pages/Notificacoes/Notificacoes";
import ProdutoDetalhe from "./pages/ProdutoDetalhe/ProdutoDetalhe";
import Avaliacao from "./pages/Avaliacao/Avaliacao";
import MinhasReservas from "./pages/Reservas/MinhasReservas/MinhasReservas";
import DetalhesReserva from "./pages/Reservas/DetalhesReserva/DetalhesReserva";
import MinhasFerramentas from "./pages/MinhasFerramentas/MinhasFerramentas";
import CadastroFerramenta from "./pages/CadastroFerramenta/CadastroFerramenta";
import Carrinho from "./pages/Carrinho/Carrinho";
import { useRouter } from "./router/useRouter";
import { ProdutoProvider } from "./context/ProdutoContext";
import { ReservaProvider } from "./context/ReservaContext";
import { CatalogoProvider } from "./context/CatalogoContext";
import { NotificationProvider } from "./context/NotificationContext";
import { CarrinhoProvider } from "./context/CarrinhoContext";

export default function App() {
  const { route, navigate } = useRouter();

  return (
    <CatalogoProvider>
    <ProdutoProvider>
      <ReservaProvider>
      <NotificationProvider>
      <CarrinhoProvider>
        {route === "home" && <Home navigate={navigate} />}

        {route === "busca" && <Busca navigate={navigate} />}

        {route === "login" && <Login navigate={navigate} />}

        {route === "cadastro" && <Cadastro navigate={navigate} />}

        {route === "recuperarSenha" && <RecuperarSenha navigate={navigate} />}

        {route === "informeToken" && <InformeToken navigate={navigate} />}

        {route === "informeNovaSenha" && <InformeNovaSenha navigate={navigate} />}

        {route === "notificacoes" && <Notificacoes navigate={navigate} />}

        {route === "avaliacao" && <Avaliacao navigate={navigate} />}

        {route === "produtoDetalhe" && <ProdutoDetalhe navigate={navigate} />}

        {route === "minhasReservas" && <MinhasReservas navigate={navigate} />}

        {route === "detalhesReserva" && <DetalhesReserva navigate={navigate} />}

        {route === "minhasFerramentas" && <MinhasFerramentas navigate={navigate} />}

        {route === "cadastroFerramenta" && <CadastroFerramenta navigate={navigate} />}

        {route === "carrinho" && <Carrinho navigate={navigate} />}
      </ReservaProvider>
    </ProdutoProvider>
    </CatalogoProvider>
  );
}