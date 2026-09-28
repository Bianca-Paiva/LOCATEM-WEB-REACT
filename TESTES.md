# Testes automatizados

Este projeto usa uma base de QA com Vitest, React Testing Library, MSW e Playwright.

## Stack

- Vitest para testes unitarios, componentes e integracao.
- React Testing Library, jest-dom e user-event para comportamento de UI.
- MSW para simular endpoints HTTP sem depender do backend real.
- Playwright para jornadas reais no navegador.
- jsdom como ambiente DOM dos testes Vitest.

## Estrutura

- `tests/unit`: regras puras de auth, carrinho, filtros, produtos e utils.
- `tests/integration`: componentes e fluxos com providers reais e MSW.
- `tests/e2e`: jornadas de visitante, locatario, locador e checkout.
- `tests/fixtures`: dados reutilizaveis de API e carrinho.
- `tests/mocks`: handlers MSW e servidor de testes.
- `tests/utils`: helpers de render com providers.

## Comandos

- `npm run test`: roda Vitest em modo watch.
- `npm run test:run`: roda testes unitarios/integracao uma vez.
- `npm run test:coverage`: gera cobertura em texto e HTML em `coverage/`.
- `npm run test:e2e`: sobe Vite via `tests/e2e/run-playwright.mjs` e roda Playwright.
- `npm run test:e2e:ui`: abre a UI do Playwright com o servidor Vite local gerenciado pelo runner.
- `npm run qa`: roda `check`, `test:run` e `test:e2e`.

## MSW

O MSW e inicializado em `tests/setupTests.tsx` e usa handlers de `tests/mocks/handlers.ts`.
Os cenarios cobertos simulam:

- API de ferramentas com sucesso.
- API de ferramentas retornando lista vazia.
- API de ferramentas retornando erro 500.
- API de ferramentas com atraso.
- Login valido e invalido.
- Favoritos sem depender do backend real.

## Usuarios de teste

Os testes reutilizam as contas mockadas do projeto:

- Locatario: `maria.oliveira@exemplo.com` / `Teste@123`.
- Locador: `joao.silva@exemplo.com` / `Teste@123`.
- Visitante: sem token/sessao.

## Fluxos cobertos

- Visitante acessa Home, pesquisa ferramenta, abre detalhe, adiciona ao carrinho, acessa carrinho e e direcionado ao Login ao continuar para pagamento.
- Locatario acessa Home, ve navegacao privada, adiciona produto ao carrinho, calcula frete e chega ao metodo de pagamento.
- Locador acessa HomeLocador, ve Minhas Ferramentas/Gerenciar Locacoes e e impedido de acessar carrinho, busca e pagamento por rota direta.
- Header respeita visitante, locatario, locador e regra responsiva do carrinho.
- Produtos usam API quando disponivel e `produtos.mock.ts` como fallback quando a API falha ou retorna vazio.
- Carrinho bloqueia locador, exige login para checkout de visitante e exige frete para locatario autenticado.

## Observacoes

O Playwright usa Microsoft Edge local (`channel: "msedge"`) para evitar depender do download do Chromium em maquinas Windows onde o CDN pode falhar por timeout. O runner `tests/e2e/run-playwright.mjs` sobe e fecha o servidor Vite de forma explicita.
