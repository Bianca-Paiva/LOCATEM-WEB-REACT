// Rotas
import { useRouter } from "./router/useRouter";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { BuscaProvider } from "./context/BuscaContext";
import { CarrinhoProvider } from "./context/CarrinhoContext";
import { CatalogoProvider } from "./context/CatalogoContext";
import { LocacaoProvider } from "./context/LocacaoContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProdutoProvider } from "./context/ProdutoContext";

// Pages - Autenticação e Recuperação de Senha
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha/InformeEmail/InformeEmail";
import InformeToken from "./pages/RecuperarSenha/InformeToken/InformeToken";
import InformeNovaSenha from "./pages/RecuperarSenha/InformeNovaSenha/InformeNovaSenha";

// Pages - Navegação Principal e Perfil
import Home from "./pages/Home/Home";
import Busca from "./pages/Busca/Busca";
import Notificacoes from "./pages/Notificacoes/Notificacoes";
import Perfil from "./pages/Perfil/Perfil";


// Pages - Ferramentas e Produtos
import CadastroFerramenta from "./pages/CadastroFerramenta/CadastroFerramenta";
import MinhasFerramentas from "./pages/MinhasFerramentas/MinhasFerramentas";
import ProdutoDetalhe from "./pages/ProdutoDetalhe/ProdutoDetalhe";
import Avaliacao from "./pages/Avaliacao/Avaliacao";

// Pages - Locações
import MinhasLocacoes from "./pages/Locacoes/MinhasLocacoes/MinhasLocacoes";
import DetalhesLocacao from "./pages/Locacoes/DetalhesLocacao/DetalhesLocacao";

// Pages - Carrinho e Fluxo de Pagamento
import Carrinho from "./pages/Carrinho/Carrinho";
import MetodoPagamento from "./pages/FluxoPagamento/MetodoPagamento/MetodoPagamento";
import SelecionarCartao from "./pages/FluxoPagamento/SelecionarCartao/SelecionarCartao";
import AdicionarCartaoCredito from "./pages/FluxoPagamento/AdicionarCartaoCredito/AdicionarCartaoCredito";
import AdicionarCartaoDebito from "./pages/FluxoPagamento/AdicionarCartaoDebito/AdicionarCartaoDebito";
import PagamentoPix from "./pages/FluxoPagamento/PagamentoPix/PagamentoPix";

export default function App() {
  const { route, navigate } = useRouter();

  return (
    <AuthProvider>
      <CatalogoProvider>
        <ProdutoProvider>
          <LocacaoProvider>
            <NotificationProvider>
              <CarrinhoProvider>
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

                  {route === "metodoPagamento" && <MetodoPagamento navigate={navigate} />}

                  {route === "selecionarCartao" && <SelecionarCartao navigate={navigate} />}

                  {route === "adicionarCartaoCredito" && <AdicionarCartaoCredito navigate={navigate} />}

                  {route === "adicionarCartaoDebito" && <AdicionarCartaoDebito navigate={navigate} />}

                  {route === "pagamentoPix" && <PagamentoPix navigate={navigate} />}

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