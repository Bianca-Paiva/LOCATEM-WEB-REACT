import { useState, useMemo } from 'react';
import Header from '../../components/Header/Header';
import { ImagemCarrossel } from '../../components/ProdutoDetalhe/ImagemCarrossel/ImagemCarrossel';
import { ProdutoInfo } from '../../components/ProdutoDetalhe/ProdutoInfo/ProdutoInfo';
import { ProdutosSemelhantes } from '../../components/ProdutoDetalhe/ProdutosSemelhantes/ProdutosSemelhantes';
import { Descricao } from '../../components/ProdutoDetalhe/Descricao/Descricao';
import { EspecificacoesTecnicas } from '../../components/ProdutoDetalhe/EspecificacoesTecnicas/EspecificacoesTecnicas';
import { Acessorios } from '../../components/ProdutoDetalhe/Acessorios/Acessorios';
import { InfoVendedor } from '../../components/ProdutoDetalhe/InfoVendedor/InfoVendedor';
import { AvaliacaoSection } from '../../components/ProdutoDetalhe/AvaliacaoSection/AvaliacaoSection';
import { BannerLateral } from '../../components/ProdutoDetalhe/BannerLateral/BannerLateral';
import SolicitarLocacaoModal from '../../components/SolicitarLocacao/SolicitarLocacaoModal/SolicitarLocacaoModal';
import SuccessModal from '../../components/SuccessModal/SucessesModal';
import { useProdutoStore } from '../../hooks/useProdutoStore';
import { useCatalogoStore } from '../../hooks/useCatalogoStore';
import { useLocacaoStore } from '../../hooks/Locacoes/useLocacaoStore';
import { useNotificationStore } from '../../hooks/Locacoes/useNotificationStore';
import { useCarrinhoStore } from '../../hooks/useCarrinhoStore';
import { getLocadorByNome } from '../../mocks/locadores.mock';
import { toProdutoSemelhante, toProdutoSelecionado } from '../../mocks/produtos.adapters';
import { montarLocacaoPendente, montarNotificacaoSolicitacaoEnviada } from '../../utils/montarLocacaoData';
import type { ProdutoSelecionado } from '../../context/ProdutoContext';
import type { Route } from '../../router/useRouter';
import type { DadosLocacaoModal, ModoAberturaModal } from '../../components/SolicitarLocacao/SolicitarLocacaoModal/SolicitarLocacaoModal.types';
import { FALLBACK_PRODUTO } from './ProdutoDetalhe.mock';
import styles from './ProdutoDetalhe.module.css';

interface ProdutoDetalheProps {
  navigate: (route: Route) => void;
}

export default function ProdutoDetalhe({ navigate }: ProdutoDetalheProps) {
  const { produtoSelecionado, setProdutoSelecionado } = useProdutoStore();
  const { produtos } = useCatalogoStore();
  const { adicionarLocacao } = useLocacaoStore();
  const { adicionarNotificacao } = useNotificationStore();
  const { adicionarItem } = useCarrinhoStore();

  // Usa os dados do produto clicado; caso acesse direto via hash, usa fallback
  const produto: ProdutoSelecionado = produtoSelecionado ?? FALLBACK_PRODUTO;

  // Ferramentas semelhantes: calculadas dinamicamente a partir da categoria do produto atual (ex: furadeira → outras furadeiras/parafusadeiras), sempre sobre o catálogo completo — nunca uma lista fixa por produto.
  const produtosSemelhantes = useMemo(
    () =>
      produtos
        .filter((p) => p.categoria === produto.categoria && p.id !== produto.id)
        .map(toProdutoSemelhante),
    [produtos, produto.categoria, produto.id],
  );

  // Ao clicar num card semelhante: o card só carrega um recorte do produto (ProdutoSemelhante), então buscamos o produto completo no catálogo pra levar adiante os dados reais da ferramenta (descrição, especificações, acessórios, avaliações etc.), salvamos no store e forçamos re-render no topo.
  const handleSemelhante = (p: ProdutoSelecionado) => {
    const produtoCompleto = produtos.find((item) => item.id === p.id);
    setProdutoSelecionado(produtoCompleto ? toProdutoSelecionado(produtoCompleto) : p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dados do locador vêm sempre do catálogo, buscados pelo nome salvo no produto.
  const locador = getLocadorByNome(produto.locador);

  // ── Modal de Solicitação de Locação ──────────────────────────────────────
  // Aberto tanto por "Locar" quanto por "Adicionar ao carrinho"; o `modo` controla o rótulo/ação do botão de confirmação dentro do modal.
  const [modalAberto, setModalAberto] = useState(false);
  const [modoModal, setModoModal] = useState<ModoAberturaModal>('locar');

  // Mensagem de sucesso exibida quando a locação exige aprovação manual do locador (fluxo: Locar → Modal → Modal de sucesso → Minhas Locações).
  const [successAberto, setSuccessAberto] = useState(false);

  // Quantidade/diárias/tensão já escolhidos pelo usuário na própria página do produto (via ProdutoInfo), usados para pré-preencher o modal — ex: "3 unidades + 2 diárias" já entra pronto no modal.
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

  const handleContinuar = (dados: DadosLocacaoModal) => {
    setProdutoSelecionado(produto);
    setModalAberto(false);

    if (produto.tipoAprovacao === 'manual') {
      // Aprovação manual: cria a solicitação como "Aguardando aprovação", notifica o locatário do prazo de 24h e mostra o modal de sucesso — nada de pagamento nem confirmação automática aqui.
      const novaLocacao = adicionarLocacao(montarLocacaoPendente(produto, dados));
      adicionarNotificacao(
        montarNotificacaoSolicitacaoEnviada(produto, novaLocacao.id, novaLocacao.periodo),
      );
      setSuccessAberto(true);
    } else {
      // Aprovação automática: não cria solicitação pendente nem notificação de aprovação — segue direto para o pagamento.
      // TODO: integrar com a etapa de pagamento assim que existir no projeto.
      // navigate('pagamento');
    }
  };

  const handleFecharSuccess = () => {
    setSuccessAberto(false);
    navigate('minhasLocacoes');
  };

  const handleAdicionarAoCarrinhoConfirmado = (dados: DadosLocacaoModal) => {
    // Apenas adiciona a ferramenta ao carrinho (datas, horários e quantidade) — não cria solicitação, notificação nem dispara fluxo de aprovação/pagamento algum.
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
                    brand={produto.locador}
                    imageVerificado={produto.imageVerificado}
                    imageNota={produto.imageNota}
                    estoqueDisponivel={produto.estoqueDisponivel}
                    voltagem={produto.voltagem}
                    onAlugar={handleAlugar}                          // <-- abre o modal em modo "locar"
                    onLocar={handleAlugar}                        // <-- mantido por compatibilidade; use handleAlugar
                    onAddCarrinho={handleAdicionarCarrinho}          // <-- abre o modal em modo "carrinho"
                    onSelecaoChange={setSelecaoProduto}              // <-- eleva quantidade/diárias/tensão para o modal
                  />
                </div>

              </div>
            </section>

            {/* ── PRODUTOS SEMELHANTES ── */}
            <section className={styles.produtoSectionPadded}>
              <ProdutosSemelhantes
                produtos={produtosSemelhantes}
                onCardClick={(p) => handleSemelhante(p as unknown as ProdutoSelecionado)}
              />
            </section>

            {/* ── GRID INFERIOR ── */}
            <div className={styles.produtoGridInferior}>

              <div className={styles.produtoDescVendedorRow}>
                <div className={styles.produtoDescCol}>
                  <Descricao
                    texto={produto.descricao ?? 'Descrição não informada pelo locador.'}
                  />
                </div>
                {/* Oculto no Mobile/Tablet, Visível no Desktop */}
                <div className={`${styles.produtoVendedorCol} ${styles.vendedorDesktop}`}>
                  <InfoVendedor
                    nome={locador.nome}
                    logoUrl={locador.logoUrl}
                    rating={locador.rating}
                    reviewCount={locador.reviewCount}
                    locacoes={locador.locacoes}
                    verificado={locador.verificado}
                    imageNota={produto.imageNota}
                  />
                </div>
              </div>

              {produto.especificacoes && produto.especificacoes.length > 0 && (
                <EspecificacoesTecnicas especificacoes={produto.especificacoes} />
              )}

              {produto.acessorios && produto.acessorios.length > 0 && (
                <Acessorios itens={produto.acessorios} />
              )}

              {/* Visível no Mobile/Tablet (depois de Acessórios), Oculto no Desktop */}
              <div className={styles.vendedorMobile}>
                <InfoVendedor
                  nome={locador.nome}
                  logoUrl={locador.logoUrl}
                  rating={locador.rating}
                  reviewCount={locador.reviewCount}
                  locacoes={locador.locacoes}
                  verificado={locador.verificado}
                  imageNota={produto.imageNota}
                />
              </div>

              <AvaliacaoSection
                mediaGeral={produto.rating}
                totalAvaliacoes={produto.reviewCount}
                distribuicao={produto.distribuicaoAvaliacoes ?? [0, 0, 0, 0, 0]}
                avaliacoes={produto.avaliacoes ?? []}
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

      <SolicitarLocacaoModal
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