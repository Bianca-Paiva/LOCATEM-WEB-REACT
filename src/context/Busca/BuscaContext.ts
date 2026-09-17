import { createContext } from 'react';

export interface BuscaContextType {
    /** Termo de busca atual, digitado na barra de pesquisa do Header em qualquer tela. */
    termoBusca: string;
    /** Atualiza o termo de busca global (usado pelo Header ao pesquisar). */
    setTermoBusca: (termo: string) => void;
}

export const BuscaContext = createContext<BuscaContextType | null>(null);
