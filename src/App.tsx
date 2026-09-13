// -------------------------------
// CONFIGURAÇÕES E CONTEXTOS
// -------------------------------
import { useRouter } from "./router/useRouter";

import { AuthProvider } from "./context/Auth/AuthContext";
import { BuscaProvider } from "./context/Busca/BuscaContext";
import { CarrinhoProvider } from "./context/Checkout/Carrinho/CarrinhoContext";
import { CatalogoProvider } from "./context/Ferramentas/Catalago/CatalogoContext";
import { LocacaoProvider } from "./context/Locacoes/LocacaoContext";
import { NotificationProvider } from "./context/Conta/Notificacao/NotificationContext";
import { ProdutoProvider } from "./context/Ferramentas/Produto/ProdutoContext";

// -------------------------------
// IMPORTAÇÃO DAS TELAS (PAGES)
// -------------------------------

// Navegação Principal e Descoberta
import Home from "./pages/Home/Home";
import Busca from "./pages/Busca/Busca";
import ProdutoDetalhe from "./pages/Ferramentas/ProdutoDetalhe/ProdutoDetalhe";

// Autenticação e Acesso
import Login from "./pages/Auth/Login/Login";
import Cadastro from "./pages/Auth/CadastroUsuario/CadastroUsuario";
import RecuperarSenha from "./pages/Auth/RecuperarSenha/InformeEmail/InformeEmail";
import InformeToken from "./pages/Auth/RecuperarSenha/InformeToken/InformeToken";
import InformeNovaSenha from "./pages/Auth/RecuperarSenha/InformeNovaSenha/InformeNovaSenha";

// Perfil e Interações
import Perfil from "./pages/Conta/Perfil/Perfil";
import Notificacoes from "./pages/Conta/Notificacoes/Notificacoes";
import Avaliacao from "./pages/Avaliacao/Avaliacao";

// Área do Cliente/Locatário (Quem está alugando)
import Carrinho from "./pages/Checkout/Carrinho/Carrinho";
import MinhasLocacoes from "./pages/Locacoes/MinhasLocacoes/MinhasLocacoes";
import DetalhesLocacao from "./pages/Locacoes/DetalhesLocacao/DetalhesLocacao";
import HistoricoLocacoes from "./pages/Locacoes/HistoricoLocacoes/HistoricoLocacoes";

// Pagamento e Checkout 
import MetodoPagamento from "./pages/Checkout/FluxoPagamento/MetodoPagamento/MetodoPagamento";
import SelecionarCartao from "./pages/Checkout/FluxoPagamento/SelecionarCartao/SelecionarCartao";
import AdicionarCartaoCredito from "./pages/Checkout/FluxoPagamento/AdicionarCartaoCredito/AdicionarCartaoCredito";
import AdicionarCartaoDebito from "./pages/Checkout/FluxoPagamento/AdicionarCartaoDebito/AdicionarCartaoDebito";
import PagamentoPix from "./pages/Checkout/FluxoPagamento/PagamentoPix/PagamentoPix";
import ProcessandoPagamento from "./pages/Checkout/FluxoPagamento/ProcessandoPagamento/ProcessandoPagamento";
import PagamentoAprovado from "./pages/Checkout/FluxoPagamento/PagamentoAprovado/PagamentoAprovado";

// Área do Locador (Quem disponibiliza a ferramenta)
import MinhasFerramentas from "./pages/Ferramentas/MinhasFerramentas/MinhasFerramentas";
import FerramentaDetalhe from "./pages/Ferramentas/FerramentaDetalhe/FerramentaDetalhe";
import CadastroFerramenta from "./pages/Ferramentas/CadastroFerramenta/CadastroFerramenta";
import GerenciarLocacoes from "./pages/Locacoes/GerenciarLocacoes/GerenciarLocacoes";

export default function App() {
  const { route, navigate } = useRouter();

  return (
    /* 
      Essa "escadinha" de Providers serve para compartilhar dados globais com o app inteiro. Tudo que está aqui dentro tem acesso à Autenticação, Carrinho, Buscas, etc., sem precisar passar propriedades manualmente tela a tela.
    */
    <AuthProvider>
      <CatalogoProvider>
        <ProdutoProvider>
          <LocacaoProvider>
            <NotificationProvider>
              <CarrinhoProvider>
                <BuscaProvider>

                  {/* Navegação Principal e Descoberta */}
                  {route === "home" && <Home navigate={navigate} />}
                  {route === "busca" && <Busca navigate={navigate} />}
                  {route === "produtoDetalhe" && <ProdutoDetalhe navigate={navigate} />}

                  {/* Autenticação e Acesso */}
                  {route === "login" && <Login navigate={navigate} />}
                  {route === "cadastro" && <Cadastro navigate={navigate} />}
                  {route === "recuperarSenha" && <RecuperarSenha navigate={navigate} />}
                  {route === "informeToken" && <InformeToken navigate={navigate} />}
                  {route === "informeNovaSenha" && <InformeNovaSenha navigate={navigate} />}

                  {/* Perfil e Interações */}
                  {route === "perfil" && <Perfil navigate={navigate} />}
                  {route === "notificacoes" && <Notificacoes navigate={navigate} />}
                  {route === "avaliacao" && <Avaliacao navigate={navigate} />}

                  {/* Área do Cliente/Locatário (Quem está alugando) */}
                  {route === "carrinho" && <Carrinho navigate={navigate} />}
                  {route === "minhasLocacoes" && <MinhasLocacoes navigate={navigate} />}
                  {route === "detalhesLocacao" && <DetalhesLocacao navigate={navigate} />}
                  {route === "historicoLocacoes" && <HistoricoLocacoes navigate={navigate} />}

                  {/* Pagamento e Checkout */}
                  {route === "metodoPagamento" && <MetodoPagamento navigate={navigate} />}
                  {route === "selecionarCartao" && <SelecionarCartao navigate={navigate} />}
                  {route === "adicionarCartaoCredito" && <AdicionarCartaoCredito navigate={navigate} />}
                  {route === "adicionarCartaoDebito" && <AdicionarCartaoDebito navigate={navigate} />}
                  {route === "pagamentoPix" && <PagamentoPix navigate={navigate} />}
                  {route === "processandoPagamento" && <ProcessandoPagamento navigate={navigate} />}
                  {route === "pagamentoAprovado" && <PagamentoAprovado navigate={navigate} />}

                  {/* Área do Locador (Quem disponibiliza a ferramenta) */}
                  {route === "minhasFerramentas" && <MinhasFerramentas navigate={navigate} />}
                  {route === "ferramentaDetalhe" && <FerramentaDetalhe navigate={navigate} />}
                  {route === "cadastroFerramenta" && <CadastroFerramenta navigate={navigate} />}
                  {route === "gerenciarLocacoes" && <GerenciarLocacoes navigate={navigate} />}

                </BuscaProvider>
              </CarrinhoProvider>
            </NotificationProvider>
          </LocacaoProvider>
        </ProdutoProvider>
      </CatalogoProvider>
    </AuthProvider>
  );
}