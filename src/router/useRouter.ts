import { useState, useEffect } from "react";

/**
 * 1. LISTA DE TELAS
 * Aqui ficam os nomes de todas as telas (rotas) do sistema.
 * Se uma tela nova for criada, é só adicionar o nome dela aqui.
 */
const validRoutes = [
  // Navegação Principal e Descoberta
  "home",
  "busca",
  "produtoDetalhe",

  // Autenticação e Acesso
  "login",
  "cadastro",
  "recuperarSenha",
  "informeToken",
  "informeNovaSenha",

  // Perfil e Interações
  "perfil",
  "notificacoes",
  "avaliacao",

  // Área do Cliente/Locatário (Quem está alugando)
  "carrinho",
  "solicitarLocacao",
  "solicitacaoEnviada",
  "minhasLocacoes",
  "detalhesLocacao",
  "historicoLocacoes",

  // Pagamento e Checkout
  "metodoPagamento",
  "selecionarCartao",
  "adicionarCartaoCredito",
  "adicionarCartaoDebito",
  "pagamentoPix",
  "processandoPagamento",
  "pagamentoAprovado",

  // Área do Locador (Quem disponibiliza a ferramenta)
  "minhasFerramentas",
  "ferramentaDetalhe",
  "cadastroFerramenta",
  "gerenciarLocacoes",
] as const;

/**
 * 2. TIPO DA ROTA
 * O TypeScript lê a lista acima automaticamente.
 * Isso impede que alguém tente navegar para uma tela que não existe (ex: "homer").
 */
export type Route = typeof validRoutes[number];

/**
 * 3. DESCOBRIR A TELA ATUAL PELA URL
 * Essa função olha para o link do navegador e tenta adivinhar em qual tela estamos.
 */
function getRouteFromHash(): Route {
  // Pega o texto da URL, tira o '#' do começo e ignora qualquer coisa depois do '?'
  const hash = window.location.hash.replace("#", "").split("?")[0];

  // A palavra da URL existe na nossa lista de telas válidas? 
  if (validRoutes.includes(hash as Route)) {
    return hash as Route; // Se sim, vamos para ela!
  }

  // Se a URL estiver vazia ou com uma tela inventada (ex: #abobrinha), mandamos o usuário de volta para a "home" por segurança.
  return "home";
}

/**
 * 4. O HOOK DE NAVEGAÇÃO
 * Essa é a ferramenta que mais vai ser usada nas telas.
 * Ela diz em qual tela você está e te dá uma função para mudar de tela.
 */
export function useRouter() {
  // Guarda a tela atual. Assim que o app abre, ele já olha a URL para saber onde começar.
  const [route, setRoute] = useState<Route>(getRouteFromHash);

  useEffect(() => {
    // Sempre que o link (URL) mudar, atualiza a tela no React.
    const onHashChange = () => {
      setRoute(getRouteFromHash());
    };

    // Fica "escutando" a URL do navegador. 
    // Isso faz os botões de "Voltar" e "Avançar" do próprio navegador funcionarem direitinho.
    window.addEventListener("hashchange", onHashChange);

    // Quando o componente for destruído/fechado, paramos de "escutar" a URL para economizar memória.
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  /**
   * Função para levar o usuário para outra tela.
   * Exemplo de uso num botão: onClick={() => navigate("login")}
   */
  const navigate = (to: Route) => {
    window.location.hash = to;
  };

  // Entrega para o componente a tela atual e a função de viajar entre telas.
  return { route, navigate };
}