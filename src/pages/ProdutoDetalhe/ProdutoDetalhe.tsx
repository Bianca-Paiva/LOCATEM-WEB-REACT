import { useState } from 'react';
import Header from '../../components/Header/Header';
import { ImagemCarrossel } from '../../components/ProdutoDetalhe/ImagemCarrossel/ImagemCarrossel';
import { ProdutoInfo } from '../../components/ProdutoDetalhe/ProdutoInfo/ProdutoInfo';
import { ProdutosSemelhantes } from '../../components/ProdutoDetalhe/ProdutosSemelhantes/ProdutosSemelhantes';
import { Descricao } from '../../components/ProdutoDetalhe/Descricao/Descricao';
import { EspecificacoesTecnicas } from '../../components/ProdutoDetalhe/EspecificacoesTecnicas/EspecificacoesTecnicas';
import { InfoVendedor } from '../../components/ProdutoDetalhe/InfoVendedor/InfoVendedor';
import { AvaliacaoSection } from '../../components/ProdutoDetalhe/AvaliacaoSection/AvaliacaoSection';
import { BannerLateral } from '../../components/ProdutoDetalhe/BannerLateral/BannerLateral';
import SolicitarReservaModal from '../../components/SolicitarReserva/SolicitarReservaModal/SolicitarReservaModal';
import { useProdutoStore } from '../../hooks/useProdutoStore';
import { getLocadorByNome } from '../../mocks/locadores.mock';
import type { ProdutoSelecionado } from '../../context/ProdutoContext';
import type { Route } from '../../router/useRouter';
import type { DadosReservaModal, ModoAberturaModal } from '../../components/SolicitarReserva/SolicitarReservaModal/SolicitarReservaModal.types';
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

  // Dados do locador vêm sempre do catálogo, buscados pelo nome salvo no produto.
  const locador = getLocadorByNome(produto.locador);

  // ── Modal de Solicitação de Reserva ──────────────────────────────────────
  // Aberto tanto por "Locar" quanto por "Adicionar ao carrinho"; o `modo`
  // controla o rótulo/ação do botão de confirmação dentro do modal.
  const [modalAberto, setModalAberto] = useState(false);
  const [modoModal, setModoModal] = useState<ModoAberturaModal>('locar');

  // Se a página de detalhe já tiver seletores próprios de quantidade/período
  // (dentro de ProdutoInfo), eleve esse estado para cá e passe os valores
  // abaixo como `quantidadeInicial` / `dataEntregaInicial` / `dataDevolucaoInicial`
  // do modal, para que o usuário só precise informar os horários.
  const [quantidadeSelecionada] = useState(1);
  const [periodoSelecionado] = useState<{ dataEntrega?: string; dataDevolucao?: string }>({});

  const handleAlugar = () => {
    setModoModal('locar');
    setModalAberto(true);
  };

  // const handleAdicionarCarrinho = () => {
  //   setModoModal('carrinho');
  //   setModalAberto(true);
  // };

  const handleFecharModal = () => setModalAberto(false);

  const handleContinuar = (dados: DadosReservaModal) => {
    setProdutoSelecionado(produto);
    setModalAberto(false);

    // Se o locador exigir aprovação manual, o fluxo segue para a tela de
    // confirmação (aguardando o locador); caso contrário, para o pagamento.
    // Ajuste `locador.aprovacaoManual` conforme o dado real vindo do catálogo.
    if ((locador as { aprovacaoManual?: boolean }).aprovacaoManual) {
      navigate('solicitacaoEnviada');
    } else {
      //navigate('pagamento');
    }

    void dados; // dados completos (datas, horários, quantidade, resumo) prontos para a próxima etapa
  };

  const handleAdicionarAoCarrinhoConfirmado = (dados: DadosReservaModal) => {
    // TODO: integrar com o store de carrinho já existente na aplicação,
    // passando `produto` + `dados` (datas, horários, quantidade, resumo).
    setModalAberto(false);
    void dados;
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
                    estoqueDisponivel={produto.estoqueDisponivel}
                    onAlugar={handleAlugar}                       // <-- abre o modal em modo "locar"
                    onReservar={handleAlugar}                     // <-- mantido por compatibilidade; use handleAlugar
                    //onAdicionarCarrinho={handleAdicionarCarrinho} // <-- abre o modal em modo "carrinho" (novo prop; adicionar o botão em ProdutoInfo)
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
                    nome={locador.nome}
                    rating={locador.rating}
                    reviewCount={locador.reviewCount}
                    locacoes={locador.locacoes}
                    verificado={locador.verificado}
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

      <SolicitarReservaModal
        aberto={modalAberto}
        produto={produto}
        modo={modoModal}
        quantidadeInicial={quantidadeSelecionada}
        dataEntregaInicial={periodoSelecionado.dataEntrega}
        dataDevolucaoInicial={periodoSelecionado.dataDevolucao}
        onClose={handleFecharModal}
        onContinuar={handleContinuar}
        onAdicionarCarrinho={handleAdicionarAoCarrinhoConfirmado}
      />
    </div>
  );
}