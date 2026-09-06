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
import ModalLoginNecessario from '../../components/Carrinho/ModalLoginNecessario/ModalLoginNecessario';
import { useProdutoStore } from '../../hooks/Produto/useProdutoStore';
import { useCatalogoStore } from '../../hooks/Catalago/useCatalogoStore';
import { useLocacaoStore } from '../../hooks/Locacoes/useLocacaoStore';
import { useNotificationStore } from '../../hooks/Locacoes/useNotificationStore';
import { useCarrinhoStore } from '../../hooks/Carrinho/useCarrinhoStore';
import { useAuth } from '../../hooks/Auth/useAuth';
import { getLocadorByNome } from '../../mocks/locadores.mock';
import { toProdutoSemelhante, toProdutoSelecionado } from '../../mocks/produtos.adapters';
import { montarLocacaoPendente, montarNotificacaoSolicitacaoEnviada } from '../../utils/Locacao/montarLocacaoData';
import { salvarValorPagamento, salvarItemPagamentoAvulso } from '../../utils/Pagamento/pagamentoStorage';
import { salvarRedirectAposLogin } from '../../utils/Auth/redirectAposLogin';
import {
  salvarLocacaoModalPendente,
  lerLocacaoModalPendente,
  limparLocacaoModalPendente,
} from '../../utils/Locacao/locacaoModalPendenteStorage';
import type { LocacaoModalPendente } from '../../utils/Locacao/locacaoModalPendenteStorage';
import type { ProdutoSelecionado } from '../../context/Produto/ProdutoContext';
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
  const { isAuthenticated } = useAuth();

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

  // Lido e removido do sessionStorage uma única vez, na primeira renderização: se o
  // usuário acabou de voltar do Login com um formulário de "Detalhes da Locação"
  // pendente para este mesmo produto, usamos esses dados para a página já nascer com
  // o modal reaberto e preenchido — sem depender de um efeito disparando setState.
  const [pendenteInicial] = useState<LocacaoModalPendente | null>(() => {
    if (!isAuthenticated) return null;

    const pendente = lerLocacaoModalPendente();
    if (!pendente || pendente.produtoId !== produto.id) return null;

    limparLocacaoModalPendente();
    return pendente;
  });

  // ── Modal de Solicitação de Locação ──────────────────────────────────────
  // Aberto tanto por "Locar" quanto por "Adicionar ao carrinho"; o `modo` controla o rótulo/ação do botão de confirmação dentro do modal. Já nasce aberto quando há dados pendentes restaurados do login.
  const [modalAberto, setModalAberto] = useState(() => pendenteInicial !== null);
  const [modoModal, setModoModal] = useState<ModoAberturaModal>('locar');

  // Mensagem de sucesso exibida quando a locação exige aprovação manual do locador (fluxo: Locar → Modal → Modal de sucesso → Minhas Locações).
  const [successAberto, setSuccessAberto] = useState(false);

  // Quantidade/diárias/tensão já escolhidos pelo usuário na própria página do produto (via ProdutoInfo), usados para pré-preencher o modal — ex: "3 unidades + 2 diárias" já entra pronto no modal.
  const [selecaoProduto, setSelecaoProduto] = useState<{
    quantidade: number;
    diarias: number | null;
    tensao: string | null;
  }>(() => ({ quantidade: pendenteInicial?.quantidade ?? 1, diarias: null, tensao: null }));

  // Modal exibido quando um usuário deslogado clica em "Continuar" no modal de Detalhes
  // da Locação — mesma regra já aplicada no Carrinho ao avançar para o pagamento.
  const [modalLoginAberto, setModalLoginAberto] = useState(false);

  // Dados do modal de Detalhes da Locação restaurados após o login (quando o usuário
  // precisou se autenticar no meio do preenchimento); usados só para pré-preencher o
  // modal outra vez, sem que nada digitado antes se perca.
  const [dadosRestaurados, setDadosRestaurados] = useState<LocacaoModalPendente | null>(pendenteInicial);

  const handleAlugar = () => {
    setModoModal('locar');
    setModalAberto(true);
  };

  const handleAdicionarCarrinho = () => {
    setModoModal('carrinho');
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setDadosRestaurados(null);
  };

  const handleContinuar = (dados: DadosLocacaoModal) => {
    // Locação exige usuário autenticado para seguir ao pagamento — mesma regra já
    // aplicada no Carrinho ao clicar em "Continuar para Pagamento". Sem sessão, guarda
    // o que já foi preenchido no modal e pede o login, sem perder nada.
    if (!isAuthenticated) {
      salvarLocacaoModalPendente({
        produtoId: produto.id,
        quantidade: dados.quantidade,
        dataEntrega: dados.dataEntrega,
        horarioEntrega: dados.horarioEntrega,
        dataDevolucao: dados.dataDevolucao,
        horarioDevolucao: dados.horarioDevolucao,
      });
      setModalAberto(false);
      setModalLoginAberto(true);
      return;
    }

    setProdutoSelecionado(produto);
    setModalAberto(false);
    setDadosRestaurados(null);

    if (produto.tipoAprovacao === 'manual') {
      // Aprovação manual: cria a solicitação como "Aguardando aprovação", notifica o locatário do prazo de 24h e mostra o modal de sucesso — nada de pagamento nem confirmação automática aqui.
      const novaLocacao = adicionarLocacao(montarLocacaoPendente(produto, dados));
      adicionarNotificacao(
        montarNotificacaoSolicitacaoEnviada(produto, novaLocacao.id, novaLocacao.periodo),
      );
      setSuccessAberto(true);
    } else {
      // Aprovação automática: não cria solicitação pendente nem notificação de aprovação — segue direto para o pagamento.
      // Persiste o valor total da locação (aluguel + frete, já calculado pelo modal) na mesma chave lida por
      // "Método de Pagamento" e por todo o restante do fluxo — mesmo padrão usado pelo Carrinho ao avançar para o pagamento.
      salvarValorPagamento(dados.resumo.valor);
      // Essa locação não passa pelo CarrinhoContext, então "Pagamento Aprovado" não teria de onde ler o item alugado.
      // Persiste esse item avulso para que a tela exiba "Itens alugados" do mesmo jeito que já funciona vindo do Carrinho.
      salvarItemPagamentoAvulso({
        id: String(produto.id ?? produto.title),
        nome: produto.title,
        imagem: produto.images[0] ?? '',
        dias: dados.resumo.diarias,
        unidades: dados.quantidade,
        dataEntregaFormatada: dados.resumo.dataEntregaFormatada,
        horarioEntregaFormatado: dados.resumo.entregaHorarioFormatado,
      });
      navigate('metodoPagamento');
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
    setDadosRestaurados(null);
  };

  // Ação do botão "Entrar na minha conta" do modal: marca para onde o usuário deve
  // voltar (a própria página do produto, com os dados do modal preservados via
  // sessionStorage) e leva para o Login — mesmo padrão usado no Carrinho.
  const handleEntrarNaMinhaConta = () => {
    salvarRedirectAposLogin('produtoDetalhe');
    setModalLoginAberto(false);
    navigate('login');
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
        dataEntregaInicial={dadosRestaurados?.dataEntrega}
        dataDevolucaoInicial={dadosRestaurados?.dataDevolucao}
        horarioEntregaInicial={dadosRestaurados?.horarioEntrega}
        horarioDevolucaoInicial={dadosRestaurados?.horarioDevolucao}
        tensaoSelecionada={selecaoProduto.tensao}
        onClose={handleFecharModal}
        onContinuar={handleContinuar}
        onAdicionarCarrinho={handleAdicionarAoCarrinhoConfirmado}
      />

      <ModalLoginNecessario
        open={modalLoginAberto}
        onClose={() => setModalLoginAberto(false)}
        onEntrar={handleEntrarNaMinhaConta}
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