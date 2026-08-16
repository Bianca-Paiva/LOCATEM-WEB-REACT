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
import SuccessModal from '../../components/SuccessModal/SucessesModal';
import { useProdutoStore } from '../../hooks/useProdutoStore';
import { useReservaStore } from '../../hooks/Reservas/useReservaStore';
import { useNotificationStore } from '../../hooks/Reservas/useNotificationStore';
import { useCarrinhoStore } from '../../hooks/useCarrinhoStore';
import { getLocadorByNome } from '../../mocks/locadores.mock';
import { montarReservaPendente, montarNotificacaoSolicitacaoEnviada } from '../../utils/montarReservaData';
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
  const { adicionarReserva } = useReservaStore();
  const { adicionarNotificacao } = useNotificationStore();
  const { adicionarItem } = useCarrinhoStore();

  // Usa os dados do produto clicado; caso acesse direto via hash, usa fallback
  const produto: ProdutoSelecionado = produtoSelecionado ?? FALLBACK_PRODUTO;

  // Ao clicar num card semelhante: salva no store e força re-render no topo
  const handleSemelhante = (p: ProdutoSelecionado) => {
    setProdutoSelecionado(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dados do locador vêm sempre do catálogo, buscados pelo nome salvo no produto.
  const locador = getLocadorByNome(produto.locador);

  // ── Modal de Solicitação de Locação ──────────────────────────────────────
  // Aberto tanto por "Locar" quanto por "Adicionar ao carrinho"; o `modo`
  // controla o rótulo/ação do botão de confirmação dentro do modal.
  const [modalAberto, setModalAberto] = useState(false);
  const [modoModal, setModoModal] = useState<ModoAberturaModal>('locar');

  // Mensagem de sucesso exibida quando a locação exige aprovação manual do
  // locador (fluxo: Locar → Modal → Modal de sucesso → Minhas Locações).
  const [successAberto, setSuccessAberto] = useState(false);

  // Quantidade/diárias/tensão já escolhidos pelo usuário na própria página do
  // produto (via ProdutoInfo), usados para pré-preencher o modal — ex:
  // "3 unidades + 2 diárias" já entra pronto no modal.
  const [selecaoProduto, setSelecaoProduto] = useState<{
    quantidade: number;
    diarias: number | null;
    tensao: string | null;
  }>({ quantidade: 1, diarias: null, tensao: null });

  const handleAlugar = () => {
    setModoModal('locar');
    setModalAberto(true);
  };

  const handleAdicionarCarrinho = () => {
    setModoModal('carrinho');
    setModalAberto(true);
  };

  const handleFecharModal = () => setModalAberto(false);

  const handleContinuar = (dados: DadosReservaModal) => {
    setProdutoSelecionado(produto);
    setModalAberto(false);

    if (produto.tipoAprovacao === 'manual') {
      // Aprovação manual: cria a solicitação como "Aguardando aprovação",
      // notifica o locatário do prazo de 24h e mostra o modal de sucesso —
      // nada de pagamento nem confirmação automática aqui.
      const novaReserva = adicionarReserva(montarReservaPendente(produto, dados));
      adicionarNotificacao(
        montarNotificacaoSolicitacaoEnviada(produto, novaReserva.id, novaReserva.periodo),
      );
      setSuccessAberto(true);
    } else {
      // Aprovação automática: não cria solicitação pendente nem notificação
      // de aprovação — segue direto para o pagamento.
      // TODO: integrar com a etapa de pagamento assim que existir no projeto.
      // navigate('pagamento');
    }
  };

  const handleFecharSuccess = () => {
    setSuccessAberto(false);
    navigate('minhasReservas');
  };

  const handleAdicionarAoCarrinhoConfirmado = (dados: DadosReservaModal) => {
    // Apenas adiciona a ferramenta ao carrinho (datas, horários e
    // quantidade) — não cria solicitação, notificação nem dispara
    // fluxo de aprovação/pagamento algum.
    adicionarItem(produto, dados);
    setModalAberto(false);
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
                    onAlugar={handleAlugar}                          // <-- abre o modal em modo "locar"
                    onReservar={handleAlugar}                        // <-- mantido por compatibilidade; use handleAlugar
                    onAddCarrinho={handleAdicionarCarrinho}          // <-- abre o modal em modo "carrinho"
                    onSelecaoChange={setSelecaoProduto}              // <-- eleva quantidade/diárias/tensão para o modal
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
        quantidadeInicial={selecaoProduto.quantidade}
        duracaoInicial={selecaoProduto.diarias ?? undefined}
        tensaoSelecionada={selecaoProduto.tensao}
        onClose={handleFecharModal}
        onContinuar={handleContinuar}
        onAdicionarCarrinho={handleAdicionarAoCarrinhoConfirmado}
      />

      <SuccessModal
        open={successAberto}
        title="Solicitação enviada!"
        message="Sua solicitação de locação foi enviada ao locador, que tem até 24h para responder. Você pode acompanhar o status em Minhas Locações."
        buttonText="Ver Minhas Locações"
        onConfirm={handleFecharSuccess}
      />
    </div>
  );
}
