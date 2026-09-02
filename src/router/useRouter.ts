import { useState, useEffect } from "react";

export type Route =
  | "home"
  | "busca"
  | "produtoDetalhe"
  | "login"
  | "cadastro"
  | "recuperarSenha"
  | "informeToken"
  | "informeNovaSenha"
  | "notificacoes"
  | "avaliacao"
  | "minhasLocacoes"
  | "detalhesLocacao"
  | "solicitarLocacao"
  | "solicitacaoEnviada"
  | "solicitacaoEnviada"
  | "solicitacaoEnviada"
  | "solicitacaoEnviada"
  | "carrinho"
  | "metodoPagamento"
  | "selecionarCartao"
  | "adicionarCartaoCredito"
  | "adicionarCartaoDebito"
  | "pagamentoCartao"
  | "pagamentoPix"
  | "minhasFerramentas"
  | "cadastroFerramenta"
  | "carrinho"
  | "perfil";

function getRouteFromHash(): Route {
  const hash = window.location.hash.replace("#", "").split("?")[0];

  if (hash === "home") return "home";
  if (hash === "login") return "login";
  if (hash === "cadastro") return "cadastro";
  if (hash === "recuperarSenha") return "recuperarSenha";
  if (hash === "informeToken") return "informeToken";
  if (hash === "informeNovaSenha") return "informeNovaSenha";
  if (hash === "notificacoes") return "notificacoes";
  if (hash === "busca") return "busca";
  if (hash === "produtoDetalhe") return "produtoDetalhe";
  if (hash === "avaliacao") return "avaliacao";
  if (hash === "minhasLocacoes") return "minhasLocacoes";
  if (hash === "detalhesLocacao") return "detalhesLocacao";
  if (hash === "solicitarLocacao") return "solicitarLocacao";
  if (hash === "solicitacaoEnviada") return "solicitacaoEnviada";
  if (hash === "carrinho") return "carrinho";
  if (hash === "metodoPagamento") return "metodoPagamento";
  if (hash === "selecionarCartao") return "selecionarCartao";
  if (hash === "adicionarCartaoCredito") return "adicionarCartaoCredito";
  if (hash === "adicionarCartaoDebito") return "adicionarCartaoDebito";
  if (hash === "pagamentoCartao") return "pagamentoCartao";
  if (hash === "pagamentoPix") return "pagamentoPix";
  if (hash === "minhasFerramentas") return "minhasFerramentas";
  if (hash === "cadastroFerramenta") return "cadastroFerramenta";
  if (hash === "carrinho") return "carrinho";
  if (hash === "perfil") return "perfil";

  return "home";
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(getRouteFromHash);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRouteFromHash());
    };

    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const navigate = (to: Route) => {
    window.location.hash = to;
  };

  return { route, navigate };
}