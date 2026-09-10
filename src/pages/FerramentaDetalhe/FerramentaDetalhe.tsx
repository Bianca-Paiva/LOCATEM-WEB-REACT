import { useEffect, useMemo, useState } from 'react';
import { Pencil, Pause, Play, Trash2, Star } from 'lucide-react';

import Header from '../../components/Header/Header';
import CabecalhoPagina from '../../components/CabecalhoPagina/CabecalhoPagina';
import { ImagemCarrossel } from '../../components/ProdutoDetalhe/ImagemCarrossel/ImagemCarrossel';
import { Descricao } from '../../components/ProdutoDetalhe/Descricao/Descricao';
import { EspecificacoesTecnicas } from '../../components/ProdutoDetalhe/EspecificacoesTecnicas/EspecificacoesTecnicas';
import StatusFerramentaBadge from '../../components/MinhasFerramentas/StatusFerramentaBadge/StatusFerramentaBadge';
import InfoListCard from '../../components/FerramentaDetalhe/InfoListCard/InfoListCard';
import RemoverFerramentaModal from '../../components/FerramentaDetalhe/RemoverFerramentaModal/RemoverFerramentaModal';

import { useCatalogoStore } from '../../hooks/Catalago/useCatalogoStore';
import { useLocacaoStore } from '../../hooks/Locacoes/useLocacaoStore';
import { useAuth } from '../../hooks/Auth/useAuth';
import { paraNumero, formatarValorMonetario } from '../../utils/Locacao/valorMonetario';
import styles from './FerramentaDetalhe.module.css';

import type { Route } from '../../router/useRouter';

interface FerramentaDetalheProps {
  navigate: (route: Route) => void;
}

export default function FerramentaDetalhe({ navigate }: FerramentaDetalheProps) {
  const { usuario } = useAuth();
  const { produtos, atualizarProduto, removerProduto, ferramentaSelecionadaId, setFerramentaSelecionadaId } =
    useCatalogoStore();
  const { locacoes } = useLocacaoStore();

  const [modalRemoverAberto, setModalRemoverAberto] = useState(false);

  const produto = useMemo(
    () =>
      ferramentaSelecionadaId !== null
        ? produtos.find((p) => p.id === ferramentaSelecionadaId && p.locadorId === usuario?.locadorId)
        : undefined,
    [produtos, ferramentaSelecionadaId, usuario],
  );

  // Sem ferramenta selecionada (ex: acesso direto à rota) ou fora do catálogo do locador logado, volta pra listagem.
  useEffect(() => {
    if (!usuario || usuario.tipo !== 'locador' || !produto) {
      navigate('minhasFerramentas');
    }
  }, [usuario, produto, navigate]);

  if (!usuario || usuario.tipo !== 'locador' || !produto) {
    return null;
  }

  // Desempenho da ferramenta: calculado a partir das locações reais desta ferramenta (não valores fixos).
  const locacoesDaFerramenta = locacoes.filter((l) => l.produtoId === produto.id);
  const locacoesRealizadas = locacoesDaFerramenta.filter((l) =>
    ['finalizada', 'emAndamento', 'aguardandoDevolucao', 'devolucaoEmTransporte'].includes(l.status),
  ).length;
  const receitaGerada = locacoesDaFerramenta
    .filter((l) => l.status === 'finalizada')
    .reduce((total, l) => total + paraNumero(l.valor.replace('R$', '').trim()), 0);


  const handleEditar = () => {
    navigate('cadastroFerramenta');
  };

  const handlePausarReativar = () => {
    if (produto.status === 'indisponivel') {
      atualizarProduto(produto.id, { status: 'disponivel', available: true });
    } else {
      atualizarProduto(produto.id, { status: 'indisponivel', available: false });
    }
  };

  const handleConfirmarRemocao = () => {
    removerProduto(produto.id);
    setFerramentaSelecionadaId(null);
    setModalRemoverAberto(false);
    navigate('minhasFerramentas');
  };

  const anuncioPausado = produto.status === 'indisponivel';
  const podePausarOuReativar = produto.status === 'disponivel' || produto.status === 'indisponivel';

  return (
    <>
      <Header navigate={navigate} currentRoute="minhasFerramentas" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo={produto.title}
          subtitulo={`Cadastrada em ${produto.cadastradoEm ?? '—'} · Aprovação ${
            produto.tipoAprovacao === 'automatica' ? 'automática' : 'manual'
          }`}
          acao={<StatusFerramentaBadge status={produto.status} />}
        />

        <div className={styles.grid}>
          {/* ── Coluna esquerda ── */}
          <div className={styles.coluna}>
            <ImagemCarrossel images={produto.images} title={produto.title} />

            <EspecificacoesTecnicas especificacoes={produto.especificacoes ?? []} />

            <Descricao texto={produto.descricao ?? ''} />
          </div>

          {/* ── Coluna direita ── */}
          <div className={styles.coluna}>
            <InfoListCard
              titulo="Preços e condições"
              linhas={[
                { label: 'Diária', valor: `R$ ${produto.price}`, destaque: true },
                { label: 'Caução', valor: produto.caucao ? `R$ ${produto.caucao}` : 'Não exigida' },
                { label: 'Estoque disponível', valor: `${produto.estoqueDisponivel} unidades` },
                { label: 'Aprovação', valor: produto.tipoAprovacao === 'automatica' ? 'Automática' : 'Manual' },
              ]}
            />

            <InfoListCard
              titulo="Desempenho desta ferramenta"
              linhas={[
                { label: 'Locações realizadas', valor: `${locacoesRealizadas}` },
                { label: 'Receita gerada (total)', valor: formatarValorMonetario(receitaGerada) },
                { 
                  label: 'Avaliação média', 
                  valor: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} fill="#FFCA00" color="#FFCA00" />
                      {produto.rating.toFixed(1)} ({produto.reviewCount} avaliações)
                    </span>
                  )
                },
              ]}
            />

            <div className={styles.acoes}>
              <button type="button" className={styles.botaoPrimario} onClick={handleEditar}>
                <Pencil size={17} strokeWidth={2.2} />
                Editar ferramenta
              </button>

              {podePausarOuReativar && (
                <button type="button" className={styles.botaoSecundario} onClick={handlePausarReativar}>
                  {anuncioPausado ? <Play size={17} strokeWidth={2.2} /> : <Pause size={17} strokeWidth={2.2} />}
                  {anuncioPausado ? 'Reativar anúncio' : 'Pausar anúncio'}
                </button>
              )}

              <button
                type="button"
                className={styles.botaoPerigo}
                onClick={() => setModalRemoverAberto(true)}
              >
                <Trash2 size={17} strokeWidth={2.2} />
                Remover ferramenta
              </button>
            </div>
          </div>
        </div>
      </main>

      <RemoverFerramentaModal
        open={modalRemoverAberto}
        nomeFerramenta={produto.title}
        onConfirmar={handleConfirmarRemocao}
        onCancelar={() => setModalRemoverAberto(false)}
      />
    </>
  );
}
