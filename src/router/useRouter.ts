import { useState, useEffect } from "react";

export type Route =
  | "home"
  | "busca"
  | "produtoDetalhe"
  | "login"
  | "cadastro"
  | "recuperarSenha"
  | "informeToken"
  | "informeNovaSenha";

function getRouteFromHash(): Route {
  const hash = window.location.hash.replace("#", "").split("?")[0];

  if (hash === "produtoDetalhe") return "produtoDetalhe";
  if (hash === "login") return "login";
  if (hash === "cadastro") return "cadastro";
  if (hash === "recuperarSenha") return "recuperarSenha";
  if (hash === "informeToken") return "informeToken";
  if (hash === "informeNovaSenha") return "informeNovaSenha";
  if (hash === "busca") return "busca";

  return "busca";
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
