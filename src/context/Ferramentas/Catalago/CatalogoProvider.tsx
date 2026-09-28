/**
 * Catálogo em memória abastecido exclusivamente pela API real de ferramentas.
 * Mantém apenas o estado auxiliar usado por fluxos que ainda precisam de seleção local.
 */
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Produto } from '../../../types/Ferramentas/produto.types';
import { buscarFerramentasDisponiveis } from '../../../services/ferramentaservice';
import { ferramentaParaProduto } from '../../../services/ferramentaAdapters';
import { CatalogoContext, type CatalogoContextType } from './CatalogoContext';

export function CatalogoProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [ferramentaSelecionadaId, setFerramentaSelecionadaId] = useState<number | null>(null);

  useEffect(() => {
    let ativo = true;

    void buscarFerramentasDisponiveis()
      .then((ferramentas) => {
        if (ativo) setProdutos(ferramentas.map(ferramentaParaProduto));
      })
      .catch(() => {
        if (ativo) setProdutos([]);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const adicionarProduto: CatalogoContextType['adicionarProduto'] = (dados) => {
    const novoProduto: Produto = {
      ...dados,
      id: Date.now(),
      meuAnuncio: true,
    };

    setProdutos((atuais) => [novoProduto, ...atuais]);
    return novoProduto;
  };

  const atualizarProduto: CatalogoContextType['atualizarProduto'] = (id, dadosAtualizados) => {
    setProdutos((atuais) =>
      atuais.map((produto) => (produto.id === id ? { ...produto, ...dadosAtualizados } : produto)),
    );
  };

  const removerProduto: CatalogoContextType['removerProduto'] = (id) => {
    setProdutos((atuais) => atuais.filter((produto) => produto.id !== id));
  };

  const adicionarAvaliacaoProduto: CatalogoContextType['adicionarAvaliacaoProduto'] = (tituloProduto, avaliacao) => {
    setProdutos((atuais) =>
      atuais.map((produto) =>
        produto.title === tituloProduto
          ? { ...produto, avaliacoes: [...(produto.avaliacoes ?? []), avaliacao] }
          : produto,
      ),
    );
  };

  return (
    <CatalogoContext.Provider
      value={{
        produtos,
        adicionarProduto,
        atualizarProduto,
        removerProduto,
        adicionarAvaliacaoProduto,
        ferramentaSelecionadaId,
        setFerramentaSelecionadaId,
      }}
    >
      {children}
    </CatalogoContext.Provider>
  );
}
