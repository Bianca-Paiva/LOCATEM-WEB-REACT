/**
 * Home do locador.
 * Resume indicadores, solicitações e próximos eventos relacionados às ferramentas anunciadas.
 */
import { useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import { Icon } from '@iconify/react';
import { Calendar, Clock, Banknote, Eye, Pencil } from 'lucide-react';

import Header from '../../../components/Layout/Header/Header';
import CabecalhoPagina from '../../../components/Layout/CabecalhoPagina/CabecalhoPagina';
import { EstrelasAvaliacao } from '../../../components/Avaliacoes/EstrelaAvaliacao/EstrelaAvaliacao';
import { ProductCard } from '../../../components/Ferramentas/ProductCard/ProductCard';
import StatusFerramentaBadge from '../../../components/Ferramentas/MinhasFerramentas/StatusFerramentaBadge/StatusFerramentaBadge';
import HomeLocadorResumoCard from '../../../components/Home/HomeLocador/HomeLocadorResumoCard/HomeLocadorResumoCard';
import HomeLocadorSolicitacaoItem from '../../../components/Home/HomeLocador/HomeLocadorSolicitacaoItem/HomeLocadorSolicitacaoItem';
import HomeLocadorAgendaItem from '../../../components/Home/HomeLocador/HomeLocadorAgendaItem/HomeLocadorAgendaItem';
import HomeLocadorCardNovaFerramenta from '../../../components/Home/HomeLocador/HomeLocadorCardNovaFerramenta/HomeLocadorCardNovaFerramenta';

import { useExigirPerfil } from '../../../hooks/Auth/useProtegerRotaPorPerfil';
import { useHomeLocador } from '../../../hooks/Home/useHomeLocador';
import { useCatalogoStore } from '../../../hooks/Ferramentas/useCatalogoStore';
import { useProdutoStore } from '../../../hooks/Ferramentas/useProdutoStore';
import { ferramentaParaProdutoHome, ferramentaParaProdutoSelecionado } from '../../../services/ferramentaAdapters';
import { formatarValorMonetario } from '../../../utils/Formatacao/valorMonetario';

import type { Route } from '../../../router/useRouter';
import type { StatusFerramenta } from '../../../types/Ferramentas/produto.types';
import type { FerramentaDisponivel } from '../../../services/ferramentaservice';

// Reaproveita a mesma grade/estilos de card e botões "Ver"/"Editar" já usados em "Minhas Ferramentas" (nenhum CSS novo para esse padrão).
import stylesFerramentas from '../../Ferramentas/MinhasFerramentas/MinhasFerramentas.module.css';
import styles from './HomeLocador.module.css';

interface HomeLocadorProps {
  navigate: (route: Route) => void;
}

/** Cor de destaque (amarelo/dourado da marca) usada nas estrelas — mesma sobrescrita já aplicada no card "Reputação" do Perfil. */
const ESTRELA_COR_MARCA = { '--star-active': '#F9C01A' } as CSSProperties;

function obterStatusFerramenta(ferramenta: FerramentaDisponivel): StatusFerramenta {
  if (ferramenta.disponibilidade === 4) return 'manutencao';
  if (ferramenta.disponibilidade === 2) return 'locada';
  if (ferramenta.status !== 1 || ferramenta.disponibilidade === 3) return 'indisponivel';
  return 'disponivel';
}

export default function HomeLocador({ navigate }: HomeLocadorProps) {
  const acessoPermitido = useExigirPerfil(navigate, 'locador', 'home');
  const { usuario, resumo, solicitacoesRecentes, agendaSemana, minhasFerramentas } =
    useHomeLocador();
  const { setFerramentaSelecionadaId } = useCatalogoStore();
  const { setProdutoSelecionado } = useProdutoStore();

  const scrollRef = useRef<HTMLDivElement>(null);

  const [arrastando, setArrastando] = useState(false);
  const [inicioX, setInicioX] = useState(0);
  const [scrollInicial, setScrollInicial] = useState(0);

  if (!acessoPermitido || !usuario) {
    return null;
  }

  const handleVerFerramenta = (produtoId: number) => {
    const ferramenta = minhasFerramentas.find((item) => item.ferramentaId === produtoId);

    if (!ferramenta) return;

    setProdutoSelecionado(ferramentaParaProdutoSelecionado(ferramenta));
    setFerramentaSelecionadaId(null);
    navigate('produtoDetalhe');
  };

  const handleEditarFerramenta = (produtoId: number) => {
    setFerramentaSelecionadaId(produtoId);
    navigate('cadastroFerramenta');
  };

  const handleCadastrarFerramenta = () => {
    setFerramentaSelecionadaId(null);
    navigate('cadastroFerramenta');
  };

  const handleVerDetalhesSolicitacao = () =>
    navigate('gerenciarLocacoes');

  const percentualFaturamento =
    resumo.faturamentoMesAnterior > 0
      ? Math.round(
        ((resumo.faturamentoMesAtual - resumo.faturamentoMesAnterior) /
          resumo.faturamentoMesAnterior) *
        100
      )
      : null;

  const iniciarArraste = (e: PointerEvent<HTMLDivElement>) => {
    const alvo = e.target as HTMLElement;

    // Não captura o ponteiro quando o usuário está clicando nos botões
    // internos dos cards. Sem essa proteção o scroll horizontal podia
    // impedir o click de Ver, Editar e Cadastrar nova ferramenta.
    if (alvo.closest('button, a, input, select, textarea')) return;

    if (!scrollRef.current) return;

    setArrastando(true);
    setInicioX(e.clientX);
    setScrollInicial(scrollRef.current.scrollLeft);

    scrollRef.current.setPointerCapture(e.pointerId);
  };

  const arrastar = (e: PointerEvent<HTMLDivElement>) => {
    if (!arrastando || !scrollRef.current) return;

    const deslocamento = e.clientX - inicioX;
    scrollRef.current.scrollLeft = scrollInicial - deslocamento;
  };

  const finalizarArraste = () => {
    setArrastando(false);
  };

  return (
    <>
      <Header navigate={navigate} currentRoute="homeLocador" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo={`Olá, ${usuario.nome.split(' ')[0]}!`}
          subtitulo='Aqui está um resumo das suas ferramentas, locações e desempenho da conta.'
        />

        {/* ── Cards de resumo ─────────────────────────────────────────── */}
        <section className={styles.gradeResumo} aria-label="Resumo da conta">
          <HomeLocadorResumoCard
            icone={<Icon icon="mdi:tools" width={22} height={22} />}
            corIcone="#005D75"
            fundoIcone="#EAF6FF"
            label="Ferramentas ativas"
            valor={String(resumo.ferramentasAtivas)}
            tendencia={
              resumo.ferramentasCadastradasEsteMes > 0
                ? `+${resumo.ferramentasCadastradasEsteMes} este mês`
                : undefined
            }
          />

          <HomeLocadorResumoCard
            icone={<Calendar size={22} strokeWidth={2} />}
            corIcone="#005D75"
            fundoIcone="#EAF6FF"
            label="Locações em andamento"
            valor={String(resumo.locacoesEmAndamento)}
            legenda={`de ${resumo.ferramentasAtivas} ferramentas ativas`}
          />

          <HomeLocadorResumoCard
            icone={<Clock size={22} strokeWidth={2} />}
            corIcone="#7A5A00"
            fundoIcone="#FFF4DD"
            label="Solicitações pendentes"
            valor={String(resumo.solicitacoesPendentes)}
            legenda="Aguardando sua resposta"
          />

          <HomeLocadorResumoCard
            icone={<Banknote size={22} strokeWidth={2} />}
            corIcone="#137333"
            fundoIcone="#E6F4EA"
            label="Faturamento do mês"
            valor={formatarValorMonetario(resumo.faturamentoMesAtual)}
            tendencia={
              percentualFaturamento !== null
                ? `${percentualFaturamento >= 0 ? '+' : ''}${percentualFaturamento}% em relação ao mês anterior`
                : undefined
            }
          />

          <HomeLocadorResumoCard
            icone={<Icon icon="mdi:star" width={22} height={22} />}
            corIcone="#F9C01A"
            fundoIcone="#FFF4DD"
            label="Avaliação média"
            valor={(usuario.reputacao?.rating ?? 0).toFixed(1)}
            extra={
              <div className={styles.estrelasAvaliacao} style={ESTRELA_COR_MARCA}>
                <EstrelasAvaliacao
                  notaAtual={usuario.reputacao?.rating ?? 0}
                  variante="lista"
                  descricaoContexto="reputação do locador"
                />
                <span className={styles.legenda}>({usuario.reputacao?.totalAvaliacoes ?? 0} avaliações)</span>
              </div>
            }
          />
        </section>

        <div className={styles.gradeSecoes}>
          {/* ── Solicitações Recentes ───────────────────────────────────── */}
          <section className={styles.cartaoSecao}>
            <div className={styles.cabecalhoSecao}>
              <div>
                <h2 className={styles.tituloSecao}>Solicitações Recentes</h2>
                <p className={styles.subtituloSecao}>Confira as últimas solicitações de locação das suas ferramentas.</p>
              </div>
              <button type="button" className={styles.linkVerMais} onClick={() => navigate('gerenciarLocacoes')}>
                Ver todas
                <Icon icon="mdi:arrow-right" width={16} height={16} />
              </button>
            </div>

            {solicitacoesRecentes.length === 0 ? (
              <p className={styles.estadoVazio}>Nenhuma solicitação por aqui ainda.</p>
            ) : (
              <ul className={styles.listaSolicitacoes}>
                {solicitacoesRecentes.map((solicitacao) => (
                  <HomeLocadorSolicitacaoItem
                    key={solicitacao.id}
                    solicitacao={solicitacao}
                    onVerDetalhes={handleVerDetalhesSolicitacao}
                  />
                ))}
              </ul>
            )}
          </section>

          {/* ── Agenda da Semana ────────────────────────────────────────── */}
          <section className={styles.cartaoSecao}>
            <div className={styles.cabecalhoSecao}>
              <div>
                <h2 className={styles.tituloSecao}>Agenda da Semana</h2>
                <p className={styles.subtituloSecao}>Próximos movimentos logísticos das suas ferramentas.</p>
              </div>
              {/* "Ver Mais" aparece no layout, mas ainda não existe uma página de agenda — sem navegação por enquanto. */}
              <span className={styles.linkVerMaisEstatico}>
                Ver agenda completa
                <Icon icon="mdi:arrow-right" width={16} height={16} />
              </span>
            </div>

            {agendaSemana.length === 0 ? (
              <p className={styles.estadoVazio}>Nenhum movimento logístico previsto no momento.</p>
            ) : (
              <ul className={styles.listaAgenda}>
                {agendaSemana.map((evento) => (
                  <HomeLocadorAgendaItem key={evento.id} evento={evento} />
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* ── Minhas Ferramentas ──────────────────────────────────────── */}
        <section className={`${styles.cartaoSecao} ${styles.cartaoSecaoFerramentas}`}>
          <div className={styles.cabecalhoSecao}>
            <div>
              <h2 className={styles.tituloSecao}>Minhas Ferramentas</h2>
              <p className={styles.subtituloSecao}>Acesse e gerencie suas ferramentas cadastradas.</p>
            </div>
            <button type="button" className={styles.linkVerMais} onClick={() => navigate('minhasFerramentas')}>
              Ver todas
              <Icon icon="mdi:arrow-right" width={16} height={16} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className={`${styles.gradeFerramentasScroll} ${arrastando ? styles.arrastando : ''
              }`}
            onPointerDown={iniciarArraste}
            onPointerMove={arrastar}
            onPointerUp={finalizarArraste}
            onPointerCancel={finalizarArraste}
          >
            <div className={stylesFerramentas.grade}>

              {/* define a quantidade de produtos que vai aparecer */}
              {minhasFerramentas.slice(0, 4).map((produtoCompleto) => {
                const produto = ferramentaParaProdutoHome(produtoCompleto);

                return (
                  <ProductCard
                    key={produto.id}
                    title={produto.title}
                    brand={produto.locador}
                    price={produto.price}
                    images={produto.images}
                    imageVerificado={produto.imageVerificado}
                    imageNota={produto.imageNota}
                    rating={produto.rating}
                    reviewCount={produto.reviewCount}
                    statusBadge={<StatusFerramentaBadge status={obterStatusFerramenta(produtoCompleto)} compacto />}
                    footerExtra={
                      <div className={stylesFerramentas.acoesCard}>
                        <button
                          type="button"
                          className={stylesFerramentas.botaoAcao}
                          onClick={() => handleVerFerramenta(produtoCompleto.ferramentaId)}
                        >
                          <Eye size={14} strokeWidth={2} />
                          Ver
                        </button>
                        <button
                          type="button"
                          className={stylesFerramentas.botaoAcao}
                          onClick={() => handleEditarFerramenta(produtoCompleto.ferramentaId)}
                        >
                          <Pencil size={14} strokeWidth={2} />
                          Editar
                        </button>
                      </div>
                    }
                  />
                );
              })}

              <HomeLocadorCardNovaFerramenta onClick={handleCadastrarFerramenta} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
