import Header from '../../components/Header/Header';
import { ImagemCarrossel } from '../../components/ProdutoDetalhe/ImagemCarrossel/ImagemCarrossel';
import { ProdutoInfo } from '../../components/ProdutoDetalhe/ProdutoInfo/ProdutoInfo';
import { ProdutosSemelhantes } from '../../components/ProdutoDetalhe/ProdutosSemelhantes/ProdutosSemelhantes';
import { Descricao } from '../../components/ProdutoDetalhe/Descricao/Descricao';
import { EspecificacoesTecnicas } from '../../components/ProdutoDetalhe/EspecificacoesTecnicas/EspecificacoesTecnicas';
import { InfoVendedor } from '../../components/ProdutoDetalhe/InfoVendedor/InfoVendedor';
import { AvaliacaoSection } from '../../components/ProdutoDetalhe/AvaliacaoSection/AvaliacaoSection';
import { BannerLateral } from '../../components/ProdutoDetalhe/BannerLateral/BannerLateral';
import { useProdutoStore } from '../../hooks/useProdutoStore';
import type { ProdutoSelecionado } from '../../context/ProdutoContext';
import type { Route } from '../../router/useRouter';
import {
  FALLBACK_PRODUTO,
  MOCK_SEMELHANTES,
  MOCK_ESPECIFICACOES,
  MOCK_AVALIACOES
} from './ProdutoDetalhe.mock';
import styles from './ProdutoDetalhe.module.css';

interface ProdutoDetalheProps {
  navigate: (route: Route) => void;
}

export default function ProdutoDetalhe({ navigate }: ProdutoDetalheProps) {
  const { produtoSelecionado, setProdutoSelecionado } = useProdutoStore();

  // Usa os dados do produto clicado; caso acesse direto via hash, usa fallback
  const produto: ProdutoSelecionado = produtoSelecionado ?? FALLBACK_PRODUTO;

  // Ao clicar num card semelhante: salva no store e força re-render no topo
  const handleSemelhante = (p: ProdutoSelecionado) => {
    setProdutoSelecionado(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // "Locar" fica reservado para outro fluxo (a definir); por ora não navega para nada.
  const handleAlugar = () => { };

  // Ao clicar em "Reservar": garante que o produto está salvo no store e navega para a Solicitação de Reserva
  const handleReservar = () => {
    setProdutoSelecionado(produto);
    // navigate('solicitarReserva');
  };

  return (
    <div className={styles.produtoDetalheContainer}>
      <Header navigate={navigate} currentRoute="home" />

      <main className={styles.produtoDetalheMain}>

        {/* ── LAYOUT: conteúdo (esquerda) + banner alto (direita, desktop) ── */}
        <div className={styles.produtoLayoutDesktop}>

          <div className={styles.produtoColConteudo}>

            {/* ── SEÇÃO HERO ── */}
            <section className={styles.produtoHeroSection}>
              <div className={styles.produtoHeroInner}>

                <div className={styles.produtoColImagem}>
                  <ImagemCarrossel
                    images={produto.images}
                    title={produto.title}
                  />
                </div>

                <div className={styles.produtoColInfo}>
                  <ProdutoInfo
                    title={produto.title}
                    price={produto.price}
                    rating={produto.rating}
                    reviewCount={produto.reviewCount}
                    brand={produto.brand}
                    imageVerificado={produto.imageVerificado}
                    imageNota={produto.imageNota}
                    estoqueDisponivel={produto.estoqueDisponivel} // <-- Passando o estoque disponível
                    onAlugar={handleAlugar}                       // <-- Conectando a ação de alugar
                    onReservar={handleReservar}                   // <-- Conectando a ação de reservar
                  />
                </div>

              </div>
            </section>

            {/* ── PRODUTOS SEMELHANTES ── */}
            <section className={styles.produtoSectionPadded}>
              <ProdutosSemelhantes
                produtos={MOCK_SEMELHANTES}
                onCardClick={(p) => handleSemelhante(p as unknown as ProdutoSelecionado)}
              />
            </section>

            {/* ── GRID INFERIOR ── */}
            <div className={styles.produtoGridInferior}>

              <div className={styles.produtoDescVendedorRow}>
                <div className={styles.produtoDescCol}>
                  <Descricao
                    texto="Ideal para uso doméstico e profissional leve. Perfeita para montagem de móveis, instalações e pequenos reparos. Compacta, potente e fácil de manusear — resolve o problema sem complicação."
                  />
                </div>
                <div className={styles.produtoVendedorCol}>
                  <InfoVendedor
                    nome="MS Ferramentas"
                    rating={4.9}
                    reviewCount={200}
                    locacoes={500}
                    verificado
                    imageNota={produto.imageNota}
                  />
                </div>
              </div>

              <EspecificacoesTecnicas especificacoes={MOCK_ESPECIFICACOES} />

              <AvaliacaoSection
                mediaGeral={produto.rating}
                totalAvaliacoes={produto.reviewCount}
                distribuicao={[72, 18, 6, 2, 2]}
                avaliacoes={MOCK_AVALIACOES}
                imageNota={produto.imageNota}
              />
            </div>

          </div>

          {/* Banner lateral alto — visível só no desktop, sticky */}
          <div className={styles.produtoColBanner}>
            <BannerLateral />
          </div>

        </div>
      </main>
    </div>
  );
}