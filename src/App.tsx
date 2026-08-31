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
import MinhasLocacoes from "./pages/Locacoes/MinhasLocacoes/MinhasLocacoes";
import DetalhesLocacao from "./pages/Locacoes/DetalhesLocacao/DetalhesLocacao";
import MinhasFerramentas from "./pages/MinhasFerramentas/MinhasFerramentas";
import CadastroFerramenta from "./pages/CadastroFerramenta/CadastroFerramenta";
import Carrinho from "./pages/Carrinho/Carrinho";
import Perfil from "./pages/Perfil/Perfil";
import { useRouter } from "./router/useRouter";
import { ProdutoProvider } from "./context/ProdutoContext";
import { LocacaoProvider } from "./context/LocacaoContext";
import { CatalogoProvider } from "./context/CatalogoContext";
import { NotificationProvider } from "./context/NotificationContext";
import { CarrinhoProvider } from "./context/CarrinhoContext";
import { AuthProvider } from "./context/AuthContext";
// Nova importação do contexto de busca
import { BuscaProvider } from "./context/BuscaContext"; 

export default function App() {
  const { route, navigate } = useRouter();

  return (
    <AuthProvider>
      <CatalogoProvider>
        <ProdutoProvider>
          <LocacaoProvider>
            <NotificationProvider>
              <CarrinhoProvider>
                {/* Envolvendo as rotas com o BuscaProvider */}
                <BuscaProvider>
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

                  {route === "minhasLocacoes" && <MinhasLocacoes navigate={navigate} />}

                  {route === "detalhesLocacao" && <DetalhesLocacao navigate={navigate} />}

                  {route === "minhasFerramentas" && <MinhasFerramentas navigate={navigate} />}

                  {route === "cadastroFerramenta" && <CadastroFerramenta navigate={navigate} />}

                  {route === "carrinho" && <Carrinho navigate={navigate} />}

                  {route === "perfil" && <Perfil navigate={navigate} />}
                </BuscaProvider>
              </CarrinhoProvider>
            </NotificationProvider>
          </LocacaoProvider>
        </ProdutoProvider>
      </CatalogoProvider>
    </AuthProvider>
  );
}