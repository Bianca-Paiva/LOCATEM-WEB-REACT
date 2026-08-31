# Descrição das Bibliotecas

Aqui está uma breve explicação da finalidade de cada biblioteca listada em seu projeto:

### Drag and Drop (Arrastar e Soltar)
- **`@dnd-kit/core@6.3.1`**: O núcleo da biblioteca `@dnd-kit`, utilizada para criar interfaces de arrastar e soltar de forma leve, modular e acessível no React.
- **`@dnd-kit/sortable@10.0.0`**: Módulo do `@dnd-kit` focado em criar listas ordenáveis, permitindo que o usuário reordene itens os arrastando.
- **`@dnd-kit/utilities@3.2.2`**: Utilitários de suporte usados em conjunto com as outras ferramentas do `@dnd-kit`.

### Formulários e Validação
- **`react-hook-form@7.80.0`**: Biblioteca muito performática para gerenciar o estado de formulários e suas validações no React, com a vantagem de reduzir re-renderizações desnecessárias.
- **`zod@4.4.3`**: Biblioteca focada em declaração e validação de esquemas (*schemas*). É muito utilizada para validar dados de formulários e respostas de APIs, integrando perfeitamente com TypeScript.
- **`@hookform/resolvers@5.4.0`**: Ponte que permite usar bibliotecas de validação de esquemas (como o próprio `zod`) nativamente como validadores dentro do `react-hook-form`.
- **`cpf-cnpj-validator@2.1.2`**: Biblioteca utilitária para validação e formatação de números de CPF e CNPJ brasileiros.
- **`libphonenumber-js@1.13.12`**: Biblioteca para formatação, análise (*parsing*) e validação de números de telefone internacionais.

### Ícones e Interface
- **`@iconify/react@6.0.2`**: Componente React do Iconify que permite renderizar centenas de milhares de ícones sob demanda.
- **`@iconify-json/material-symbols-light@1.2.86`**: Pacote de dados JSON contendo os ícones da coleção "Material Symbols Light" para uso com o Iconify.
- **`@iconify-json/mdi@1.2.3`**: Pacote de dados JSON contendo os ícones da coleção "Material Design Icons" para o Iconify.
- **`lucide-react@1.28.0`**: Biblioteca moderna de ícones SVG com traços limpos e personalizáveis para React.
- **`swiper@12.2.0`**: Uma das bibliotecas mais poderosas para criar carrosséis (*sliders*) interativos e responsivos, com excelente suporte para telas de toque (*touch*).

### React e Roteamento
- **`react@19.2.5`**: A biblioteca principal para construção da interface de usuário baseada em componentes.
- **`react-dom@19.2.5`**: Pacote que fornece os métodos específicos para o DOM, permitindo que os componentes do React sejam renderizados no navegador web.
- **`react-router-dom@7.18.0`**: Biblioteca padrão de roteamento (*routing*) para React, permitindo a navegação entre diferentes telas/páginas da aplicação (SPAs).

### Build e Ferramentas de Desenvolvimento (Vite)
- **`vite@8.1.3`**: Ferramenta de construção (*bundler*) e servidor de desenvolvimento frontend extremamente rápida.
- **`@vitejs/plugin-react@6.0.1`**: Plugin oficial do Vite que habilita o suporte total ao React, utilizando o Babel para compilação e permitindo o *Fast Refresh* (atualização rápida).
- **`vite-plugin-react-click-to-component@4.2.2`**: Plugin que permite segurar uma tecla (como Alt) e clicar em um componente no navegador para abrir o arquivo de código diretamente no seu editor de texto (ex: VS Code).

### Qualidade de Código (Linting)
- **`eslint@9.39.4`**: Ferramenta de análise estática (*linter*) para identificar, reportar e corrigir padrões problemáticos no código.
- **`@eslint/js@9.39.4`**: Regras e configurações fundamentais de JavaScript para o ESLint.
- **`eslint-plugin-react-hooks@7.1.1`**: Plugin que impõe as "Regras dos Hooks" do React (garantindo que hooks não sejam chamados dentro de laços condicionais, por exemplo).
- **`eslint-plugin-react-refresh@0.5.2`**: Garante que os componentes React estejam escritos de maneira que suporte a atualização de tela do Vite (*Fast Refresh*) sem perder o estado.
- **`globals@17.5.0`**: Pacote que lista as variáveis globais de vários ambientes (como `browser`, `node`) para que o ESLint não acuse erros falsos quando você usá-las.

### TypeScript
- **`typescript@6.0.3`**: Linguagem de programação (superset do JavaScript) que adiciona tipagem estática e maior segurança ao desenvolvimento.
- **`typescript-eslint@8.58.2`**: Ferramentas que integram o TypeScript ao ESLint, permitindo que o linter entenda e valide o código TS.
- **`@types/react@19.2.14`**: Definições de tipos TS para o React.
- **`@types/react-dom@19.2.3`**: Definições de tipos TS para o React DOM.
- **`@types/node@24.12.2`**: Definições de tipos TS para o Node.js.