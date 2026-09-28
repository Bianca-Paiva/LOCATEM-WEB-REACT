# Bibliotecas do Projeto

Este documento resume as bibliotecas declaradas em `package.json` e como elas aparecem no código do LOCATEM.

## Dependências de produção

### React e interface
- **`react@19.2.4`**: biblioteca principal para criação dos componentes da interface.
- **`react-dom@19.2.4`**: renderiza a aplicação React no DOM do navegador.

### Roteamento
- **`react-router-dom@7.18.0`**: biblioteca de roteamento para React. Está instalada, mas o código atual usa um roteador próprio baseado em `window.location.hash` em `src/router/useRouter.ts`.

### Formulários e validação
- **`react-hook-form@7.80.0`**: gerenciamento de formulários em telas como cadastro e edição de perfil.
- **`@hookform/resolvers@5.4.0`**: integração entre `react-hook-form` e schemas de validação.
- **`zod@4.4.3`**: definição de schemas de validação para cadastro e perfil.
- **`cpf-cnpj-validator@2.1.2`**: validação de CPF/CNPJ conforme o tipo de usuário.
- **`libphonenumber-js@1.13.12`**: máscara e validação de telefone com DDD.

### UI, ícones e carrosséis
- **`lucide-react@1.28.0`**: ícones SVG usados em botões, cards, status e telas de conta/checkout.
- **`@iconify/react@6.0.2`**: renderização de ícones do Iconify em componentes como Header, cards e telas de pagamento.
- **`@iconify-json/material-symbols-light@1.2.86`**: coleção Material Symbols Light usada pelo Iconify.
- **`@iconify-json/mdi@1.2.3`**: coleção Material Design Icons usada pelo Iconify.
- **`swiper@12.2.0`**: carrosséis de banners, cards de produto e imagens de ferramenta.
- **`react-qr-code@2.2.0`**: geração do QR Code exibido no pagamento Pix.

### Drag and drop
- **`@dnd-kit/core@6.3.1`**: base do drag and drop usado no upload/ordenação de fotos da ferramenta.
- **`@dnd-kit/sortable@10.0.0`**: ordenação das fotos arrastáveis.
- **`@dnd-kit/utilities@3.2.2`**: helpers de transformação visual usados junto ao `dnd-kit`.

## Dependências de desenvolvimento

### Build e servidor local
- **`vite@8.1.3`**: servidor de desenvolvimento e build da aplicação.
- **`@vitejs/plugin-react@6.0.1`**: plugin oficial para compilar React no Vite.
- **`vite-plugin-react-click-to-component@4.2.2`**: plugin de desenvolvimento para abrir componentes no editor a partir do navegador.

### TypeScript
- **`typescript@~6.0.2`**: tipagem estática do projeto.
- **`@types/react@19.2.14`**: tipos TypeScript do React.
- **`@types/react-dom@19.2.3`**: tipos TypeScript do React DOM.
- **`@types/node@24.12.2`**: tipos do Node usados por configuração e tooling.

### Qualidade de código
- **`eslint@9.39.4`**: linter do projeto.
- **`@eslint/js@9.39.4`**: regras base de JavaScript para ESLint.
- **`typescript-eslint@8.58.0`**: integração do TypeScript com ESLint.
- **`eslint-plugin-react-hooks@7.0.1`**: valida as regras de hooks do React.
- **`eslint-plugin-react-refresh@0.5.2`**: regras relacionadas ao Fast Refresh do Vite.
- **`globals@17.4.0`**: lista de variáveis globais usada pela configuração do ESLint.

### Testes automatizados
- **`vitest@5.0.2`**: runner dos testes unitarios e de integracao. E necessario para executar as suites em `tests/unit` e `tests/integration`, reaproveitando a configuracao do Vite em `vitest.config.ts`.
- **`@vitest/coverage-v8@5.0.2`**: provedor de cobertura do Vitest baseado no motor V8. E usado por `npm run test:coverage` para gerar resumo no terminal e relatorio HTML em `coverage`.
- **`jsdom@29.1.1`**: ambiente DOM em memoria para testes React. Permite renderizar telas, providers e componentes no Vitest sem abrir um navegador real.
- **`@testing-library/react@16.3.3`**: biblioteca de renderizacao e consulta de componentes React. E usada nos testes de componentes e integracao para validar o que o usuario ve na tela.
- **`@testing-library/jest-dom@7.0.1`**: matchers extras para assercoes de DOM, como `toBeInTheDocument` e `toHaveTextContent`. E carregada globalmente por `tests/setupTests.tsx`.
- **`@testing-library/user-event@14.6.7`**: simulacao de interacoes reais de usuario, como clique, digitacao e selecao. E usada nos fluxos de login, busca, carrinho e filtros.
- **`msw@2.15.0`**: mock de requisicoes HTTP em nivel de rede. Os handlers em `tests/mocks/handlers.ts` deixam a UI chamar os services reais sem depender do backend local.
- **`@playwright/test@1.63.0`**: framework dos testes E2E no navegador. Executa os fluxos completos em `tests/e2e`, com Vite iniciado pelo runner `tests/e2e/run-playwright.mjs`.

## Observações de uso

- A busca por imports confirmou uso direto de `dnd-kit`, `react-hook-form`, `zod`, `cpf-cnpj-validator`, `libphonenumber-js`, `Iconify`, `lucide-react`, `react-qr-code` e `swiper`.
- `react-router-dom` está instalado, mas não foi encontrado import direto no código atual.
- As versões deste documento foram alinhadas ao `package.json`.
