import { ImageOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import type {
  ChaveSubAvaliacao,
  ProdutoAvaliacao,
} from '../../../pages/Avaliacao/Avaliacao.types';
import { LABEL_SUB_AVALIACAO } from '../../../pages/Avaliacao/Avaliacao.types';
import { EstrelasAvaliacao } from '../EstrelaAvaliacao/EstrelaAvaliacao';
import { CarrosselAvaliacoesPendentes } from '../CarroselAvaliacoesPendentes/CarroselAvaliacoesPendentes';
import styles from './ModalAvaliacao.module.css';

import IconCaminhao from '../../../assets/IconCaminhao.png';

interface ModalAvaliacaoProps {
  produto: ProdutoAvaliacao | null;
  itensCarrossel: ProdutoAvaliacao[];
  observacao: string;
  camposComErro: ChaveSubAvaliacao[];
  erroVisivel: boolean;
  aoFechar: () => void;
  aoMudarObservacao: (texto: string) => void;
  aoSelecionarSubNota: (chave: ChaveSubAvaliacao, valor: number) => void;
  aoSelecionarProdutoCarrossel: (id: string) => void;
  aoEnviar: () => void;
}

/**
 * Modal completo de avaliação: produto + 3 sub-notas obrigatórias
 * o useState local do painel de observações (obsExpandida abaixo).
 */
export function ModalAvaliacao({
  produto,
  itensCarrossel,
  observacao,
  camposComErro,
  erroVisivel,
  aoFechar,
  aoMudarObservacao,
  aoSelecionarSubNota,
  aoSelecionarProdutoCarrossel,
  aoEnviar,
}: ModalAvaliacaoProps) {
  const [obsExpandida, setObsExpandida] = useState(true);

  const aberto = produto !== null;

  // Fecha com a tecla Esc.
  useEffect(() => {
    if (!aberto) return;

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') aoFechar();
    }

    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [aberto, aoFechar]);

  // Trava o scroll do body enquanto o modal está aberto.
  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [aberto]);

  if (!produto) return null;

  const iconesPorSub: Record<ChaveSubAvaliacao, string | null> = {
    locador: produto.loja.logo,
    entrega: IconCaminhao,
    produto: produto.imagem,
  };

  return (
    <div
      className={`${styles.overlay} ${aberto ? styles.open : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Avaliar produto"
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) aoFechar();
      }}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <button className={styles.voltar} onClick={aoFechar} aria-label="Fechar modal">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar
          </button>
        </div>

        <div className={styles.produto}>
          <div className={styles.produtoTopo}>
            <img src={produto.imagem} alt={produto.nome} />
            <div className={styles.produtoInfo}>
              <p className={styles.produtoNome}>{produto.nome}</p>
              <p className={styles.produtoData}>{produto.dataLocacao}</p>
            </div>
          </div>

          <div className={styles.avaliacoes}>
            <div className={styles.subRatings}>
              {(Object.keys(produto.subAvaliacoes) as ChaveSubAvaliacao[]).map((chave) => (
                <div
                  key={chave}
                  className={`${styles.subRating} ${camposComErro.includes(chave) ? styles.subRatingErro : ''
                    }`}
                >
                  <span className={styles.subRatingLabel}>{LABEL_SUB_AVALIACAO[chave]}</span>

                  <div className={styles.subRatingIcone}>
                    {iconesPorSub[chave] ? (
                      <img
                        src={iconesPorSub[chave] as string}
                        alt={chave}
                        loading="eager"
                      />
                    ) : (
                      <ImageOff size={20} aria-label="Loja sem logo cadastrada" />
                    )}
                  </div>

                  <EstrelasAvaliacao
                    notaAtual={produto.subAvaliacoes[chave]}
                    variante="modal"
                    descricaoContexto={LABEL_SUB_AVALIACAO[chave]}
                    aoSelecionar={(valor) => aoSelecionarSubNota(chave, valor)}
                  />
                </div>
              ))}
            </div>

            <p className={`${styles.erro} ${erroVisivel ? styles.erroVisivel : ''}`}>
              Avalie o locador, a entrega e o produto antes de enviar.
            </p>
          </div>
        </div>

        <div className={styles.obs}>
          <button
            className={styles.obsToggle}
            aria-expanded={obsExpandida}
            onClick={() => setObsExpandida((atual) => !atual)}
          >
            Observações (opcional)
            <span className={`${styles.chevron} ${obsExpandida ? styles.chevronAberto : ''}`}>
              <svg width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1.00009 1L7.16118 6.25L13.3223 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          {obsExpandida && (
            <textarea
              className={styles.obsTextarea}
              placeholder="Compartilhe sua experiência com este produto..."
              value={observacao}
              onChange={(evento) => aoMudarObservacao(evento.target.value)}
            />
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.btnEnviar} onClick={aoEnviar}>
            {produto.status === 'realizada' ? 'Editar' : 'Enviar'}
          </button>
        </div>

        <CarrosselAvaliacoesPendentes
          itens={itensCarrossel}
          aoSelecionarItem={aoSelecionarProdutoCarrossel}
        />
      </div>
    </div>
  );
}