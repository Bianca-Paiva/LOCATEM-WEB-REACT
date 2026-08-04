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
  | "minhasReservas"
  | "detalhesReserva"
  | "solicitarReserva"
  | "solicitacaoEnviada"
  | "solicitacaoEnviada"
  | "solicitacaoEnviada"
  | "solicitacaoEnviada"
   | "carrinho"          
  | "pagamentoCartao" 
  | "pagamentoPix";
  ;

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
  if (hash === "minhasReservas") return "minhasReservas";
  if (hash === "detalhesReserva") return "detalhesReserva";
  if (hash === "solicitarReserva") return "solicitarReserva";
  if (hash === "solicitacaoEnviada") return "solicitacaoEnviada";
  if (hash === "carrinho") return "carrinho";
  if (hash === "pagamentoCartao") return "pagamentoCartao";
  if (hash === "pagamentoPix") return "pagamentoPix";
  return "carrinho";
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
