import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../../hooks/Auth/useAuth';
import {
  adicionarFavorito,
  buscarFavoritos,
  removerFavorito,
  type FavoritoCompleto,
  type FavoritoReferencia,
} from '../../../services/favoritosService';
import { buscarFerramentaPorId } from '../../../services/ferramentaservice';
import { FavoritosContext } from './FavoritosContext';

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [favoritos, setFavoritos] = useState<FavoritoCompleto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [processando, setProcessando] = useState<Set<number>>(new Set());

  const recarregarFavoritos = useCallback(async () => {
    if (!usuario) {
      setFavoritos([]);
      setErro('');
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const referencias = await buscarFavoritos();

      const resultados = await Promise.all(
        referencias.map(async (referencia): Promise<FavoritoCompleto | null> => {
          try {
            const ferramenta = await buscarFerramentaPorId(referencia.ferramentaId);

            return {
              ...referencia,
              ferramenta,
            };
          } catch {
            return null;
          }
        }),
      );

      setFavoritos(
        resultados.filter(
          (item): item is FavoritoCompleto => item !== null,
        ),
      );
    } catch (error) {
      setFavoritos([]);
      setErro(error instanceof Error ? error.message : 'Não foi possível carregar os favoritos.');
    } finally {
      setCarregando(false);
    }
  }, [usuario]);

  useEffect(() => {
    let cancelado = false;

    const carregarFavoritosDoUsuario = async () => {
      if (!usuario) {
        if (cancelado) return;
        setFavoritos([]);
        setErro('');
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro('');

      try {
        const referencias = await buscarFavoritos();

        const resultados = await Promise.all(
          referencias.map(async (referencia): Promise<FavoritoCompleto | null> => {
            try {
              const ferramenta = await buscarFerramentaPorId(referencia.ferramentaId);

              return {
                ...referencia,
                ferramenta,
              };
            } catch {
              return null;
            }
          }),
        );

        if (cancelado) return;

        setFavoritos(
          resultados.filter(
            (item): item is FavoritoCompleto => item !== null,
          ),
        );
      } catch (error) {
        if (cancelado) return;
        setFavoritos([]);
        setErro(error instanceof Error ? error.message : 'NÃ£o foi possÃ­vel carregar os favoritos.');
      } finally {
        if (!cancelado) setCarregando(false);
      }
    };

    void carregarFavoritosDoUsuario();

    return () => {
      cancelado = true;
    };
  }, [usuario]);

  const marcarProcessando = (ferramentaId: number, ativo: boolean) => {
    setProcessando((anterior) => {
      const proximo = new Set(anterior);

      if (ativo) {
        proximo.add(ferramentaId);
      } else {
        proximo.delete(ferramentaId);
      }

      return proximo;
    });
  };

  const toggleFavorito = async (ferramentaId: number) => {
    if (!usuario) {
      throw new Error('Usuário não autenticado');
    }

    if (processando.has(ferramentaId)) return;

    marcarProcessando(ferramentaId, true);

    try {
      const existente = favoritos.find(
        (favorito) => favorito.ferramentaId === ferramentaId,
      );

      if (existente) {
        await removerFavorito(ferramentaId);

        setFavoritos((anterior) =>
          anterior.filter((favorito) => favorito.ferramentaId !== ferramentaId),
        );

        return;
      }

      const referencia: FavoritoReferencia =
        await adicionarFavorito(ferramentaId);

      const ferramenta = await buscarFerramentaPorId(ferramentaId);

      setFavoritos((anterior) => [
        {
          ...referencia,
          ferramenta,
        },
        ...anterior.filter((favorito) => favorito.ferramentaId !== ferramentaId),
      ]);
    } finally {
      marcarProcessando(ferramentaId, false);
    }
  };

  const isFavoritado = (ferramentaId: number) =>
    favoritos.some((favorito) => favorito.ferramentaId === ferramentaId);

  const isProcessando = (ferramentaId: number) =>
    processando.has(ferramentaId);

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        carregando,
        erro,
        isFavoritado,
        isProcessando,
        toggleFavorito,
        recarregarFavoritos,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}
