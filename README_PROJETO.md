# README do Projeto LOCATEM

## Propósito

LOCATEM é uma aplicação web para locação de ferramentas. O sistema separa fluxos de locatário, locador e visitante, permitindo buscar ferramentas, visualizar detalhes, adicionar itens ao carrinho, solicitar locações, cadastrar ferramentas e acompanhar locações.

## Arquitetura geral

O projeto é uma SPA React com TypeScript e Vite. A navegação atual não usa `react-router-dom`; ela é controlada por `src/router/useRouter.ts`, que lê e escreve a rota no hash da URL.

O estado compartilhado fica em providers React dentro de `src/App.tsx`. As telas consomem esses dados por hooks específicos, como `useAuth`, `useCarrinhoStore`, `useCatalogoStore`, `useProdutoStore`, `useBuscaStore` e `useLocacaoStore`.

## Principais tecnologias

- React e React DOM para interface.
- TypeScript para tipagem.
- Vite para desenvolvimento e build.
- CSS Modules para estilos por componente/página.
- ESLint para qualidade de código.
- Zod e React Hook Form para formulários e validação.
- Iconify, Lucide e Swiper para UI.
- Fetch API para integração HTTP.

## Estrutura de pastas

- `src/pages`: telas completas da aplicação, separadas por domínio.
- `src/components`: componentes reutilizáveis de layout, checkout, ferramentas, avaliações, busca, conta e locações.
- `src/hooks`: hooks que encapsulam acesso a contextos e regras de tela/formulário.
- `src/context`: providers e contexts globais de autenticação, busca, carrinho, catálogo, produto selecionado, favoritos, notificações e locações.
- `src/services`: clientes HTTP e adapters da API.
- `src/utils`: funções de formatação, persistência local, datas e montagem de dados de locação.
- `src/types`: tipos compartilhados.
- `src/mocks`: dados de desenvolvimento usados quando a API não está disponível ou como base de telas ainda mockadas.
- `src/validation`: schemas de validação de cadastro, perfil e senha.
- `src/router`: roteador por hash usado pela aplicação.
- `src/assets`: imagens e ícones estáticos.

## Fluxo básico de navegação

`App.tsx` chama `useRouter()` e renderiza uma página de acordo com a rota atual. A função `navigate(route)` altera `window.location.hash`, e o hook atualiza o estado quando o hash muda.

A tela inicial padrão é `home`. Após login, a função de redirecionamento leva locadores para `homeLocador` e locatários para `home`, salvo quando há um retorno pós-login pendente.

## Perfis

- **Visitante**: pode navegar por áreas públicas e iniciar fluxos que, quando necessário, pedem login.
- **Locatário**: busca ferramentas, vê detalhes, favorita produtos, usa carrinho, paga e acompanha suas locações.
- **Locador**: cadastra e gerencia ferramentas, acompanha solicitações e acessa uma home própria. Carrinho e locação como cliente são bloqueados para esse perfil.

## Autenticação

A autenticação fica em `AuthProvider`. O token é salvo em `localStorage` com a chave `token`. Ao iniciar a aplicação, o provider tenta buscar o usuário logado pela API.

Em desenvolvimento, `authService.ts` tenta autenticar primeiro contra `usuarios.mock.ts`. Isso permite testar fluxos de locador e locatário sem backend.

## Busca

O termo digitado no Header é salvo no `BuscaProvider`. A página `Busca.tsx` lê esse termo, aplica filtros, ordenação e paginação sobre o catálogo disponível.

Filtros incluem categoria, marca, voltagem, faixa de preço, forma de pagamento, disponibilidade e avaliação mínima.

## Carrinho

O carrinho fica em `CarrinhoProvider`. Ele guarda itens adicionados a partir da página de produto com datas, horários, quantidade e resumo da locação.

A página `Carrinho.tsx` agrupa itens por locador, permite seleção parcial, calcula subtotal, desconto, frete e total. O avanço para pagamento exige usuário autenticado e frete calculado.

Locadores autenticados não podem usar o carrinho.

## Locações

As locações ficam em `LocacaoProvider`, inicialmente a partir de mocks. O provider também cancela automaticamente locações em `aguardandoPagamento` quando o prazo de pagamento expira.

O arquivo `utils/Locacoes/montarLocacaoData.ts` monta dados de locação pendente, locação confirmada e notificações relacionadas.

## Dados reais e mocks

O projeto mistura integração real com API e mocks:

- Ferramentas, favoritos, autenticação, perfil e CEP têm services próprios.
- Algumas telas ainda usam catálogo mockado via `PRODUTOS_MOCK`.
- A Home do locatário tenta carregar ferramentas da API e usa produtos mockados como fallback quando não há ferramentas carregadas.
- Usuários mockados existem para login em desenvolvimento.

## Integração com API

Os services usam `fetch`. A base principal está definida como `http://localhost:5033/api` em arquivos como `authService.ts`, `ferramentaservice.ts` e `favoritosService.ts`.

Chamadas protegidas leem o token do `localStorage` e enviam `Authorization: Bearer <token>`.

## Principais regras de negócio observadas

- Locador não pode adicionar itens ao carrinho nem seguir o fluxo de checkout como locatário.
- Locatário usa CPF; locador usa CNPJ nas validações de cadastro/perfil.
- Solicitações de locação com aprovação manual respeitam prazo de aprovação e pagamento antes da data mínima de retirada.
- Pagamentos simulados precisam passar pela etapa de processamento antes da tela de aprovado.
- Dados sensíveis completos de cartão não são persistidos pelo fluxo de pagamento; apenas referências não sensíveis são armazenadas.
- Favoritos dependem de usuário autenticado e API protegida.
- Locações aguardando pagamento podem ser canceladas automaticamente quando o prazo expira.

## Como rodar

Instale as dependências:

```bash
npm install
```

Rode em desenvolvimento:

```bash
npm run dev
```

Gere build de produção:

```bash
npm run build
```

Pré-visualize o build:

```bash
npm run preview
```

## Comandos de desenvolvimento

- `npm run dev`: inicia o servidor Vite.
- `npm run build`: executa TypeScript em modo build e gera o bundle.
- `npm run lint`: executa ESLint.
- `npm run check`: executa `tsc --noEmit` e ESLint.
