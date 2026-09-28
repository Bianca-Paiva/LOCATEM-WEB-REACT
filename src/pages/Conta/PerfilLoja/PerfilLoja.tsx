import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, MapPin, Package, FileText, Star } from 'lucide-react';
import Header from '../../../components/Layout/Header/Header';
import Avatar from '../../../components/Shared/Avatar/Avatar';
import { ProductCard } from '../../../components/Ferramentas/ProductCard/ProductCard';
import type { Route } from '../../../router/useRouter';
import { getRouteQueryParam } from '../../../router/useRouter';
import {
  buscarFerramentasDoLocador,
  buscarPerfilPublicoLocador,
  normalizarUrlImagem,
  type FerramentaDisponivel,
  type PerfilPublicoLocador,
} from '../../../services/ferramentaservice';
import { ferramentaParaProdutoSelecionado } from '../../../services/ferramentaAdapters';
import { useProdutoStore } from '../../../hooks/Ferramentas/useProdutoStore';
import { extrairCategoriaTopo } from '../../../utils/Ferramentas/Catalago/categorias';
import styles from './PerfilLoja.module.css';
import { Icon } from '@iconify/react';

interface PerfilLojaProps {
  navigate: (route: Route) => void;
}

type FiltroCategoria = 'todas' | string;
type Ordenacao = 'relevantes' | 'menorPreco' | 'maiorPreco' | 'melhorAvaliacao';

function rotuloCategoria(categoria: string) {
  if (categoria.includes('Elétricas')) return 'Elétricas';
  if (categoria.includes('Construção')) return 'Construção';
  if (categoria.includes('Jardinagem')) return 'Jardinagem';
  if (categoria.includes('Limpeza')) return 'Limpeza';
  if (categoria.includes('Elevação')) return 'Elevação';
  if (categoria.includes('Manuais')) return 'Manuais';
  return categoria;
}

function montarLocalizacao(perfil: PerfilPublicoLocador) {
  return perfil.localizacao || 'Localização não informada';
}

function obterLocadorIdDaRota(): number | null {
  const valor = Number(getRouteQueryParam('usuarioId'));
  return Number.isInteger(valor) && valor > 0 ? valor : null;
}

export default function PerfilLoja({ navigate }: PerfilLojaProps) {
  const { setProdutoSelecionado } = useProdutoStore();
  const [perfil, setPerfil] = useState<PerfilPublicoLocador | null>(null);
  const [ferramentas, setFerramentas] = useState<FerramentaDisponivel[]>([]);
  const [filtro, setFiltro] = useState<FiltroCategoria>('todas');
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('relevantes');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [locadorId, setLocadorId] = useState<number | null>(() => obterLocadorIdDaRota());

  useEffect(() => {
    const atualizarId = () => {
      setLocadorId(obterLocadorIdDaRota());
    };

    window.addEventListener('hashchange', atualizarId);
    return () => window.removeEventListener('hashchange', atualizarId);
  }, []);

  useEffect(() => {
    if (!locadorId) return;
    let ativo = true;

    queueMicrotask(() => {
      if (!ativo) return;
      setCarregando(true);
      setErro('');
    });

    Promise.all([
      buscarPerfilPublicoLocador(locadorId),
      buscarFerramentasDoLocador(locadorId),
    ])
      .then(([perfilRecebido, ferramentasRecebidas]) => {
        if (!ativo) return;
        setPerfil(perfilRecebido);
        setFerramentas(ferramentasRecebidas);
        setFiltro('todas');
      })
      .catch((error) => {
        if (!ativo) return;
        setErro(error instanceof Error ? error.message : 'Não foi possível carregar a loja.');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [locadorId]);

  const erroLocadorAusente = !locadorId ? 'Não foi possível identificar o locador desta loja.' : '';
  const erroVisivel = erroLocadorAusente || erro;
  const carregandoTela = Boolean(locadorId && carregando);

  const categorias = useMemo(() => {
    const unicas = Array.from(
      new Set(ferramentas.map((ferramenta) => extrairCategoriaTopo(ferramenta.categoriaNome))),
    );

    return unicas.sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [ferramentas]);

  const ferramentasFiltradas = useMemo(() => {
    const filtradas = filtro === 'todas'
      ? [...ferramentas]
      : ferramentas.filter(
          (ferramenta) => extrairCategoriaTopo(ferramenta.categoriaNome) === filtro,
        );

    switch (ordenacao) {
      case 'menorPreco':
        return filtradas.sort((a, b) => a.diaria - b.diaria);
      case 'maiorPreco':
        return filtradas.sort((a, b) => b.diaria - a.diaria);
      case 'melhorAvaliacao':
        return filtradas.sort((a, b) => b.avaliacaoMedia - a.avaliacaoMedia);
      default:
        return filtradas.sort((a, b) => b.totalAvaliacoes - a.totalAvaliacoes);
    }
  }, [ferramentas, filtro, ordenacao]);

  const handleVerDetalhes = (ferramenta: FerramentaDisponivel) => {
    setProdutoSelecionado(ferramentaParaProdutoSelecionado(ferramenta));
    navigate('produtoDetalhe');
  };

  const fotoPerfil = perfil?.urlFoto ? normalizarUrlImagem(perfil.urlFoto) : undefined;

  if (carregandoTela) {
    return (
      <>
        <Header navigate={navigate} currentRoute="perfilLoja" />
        <main className={styles.pagina}><div className={styles.estado}>Carregando loja...</div></main>
      </>
    );
  }

  if (erroVisivel || !perfil) {
    return (
      <>
        <Header navigate={navigate} currentRoute="perfilLoja" />
        <main className={styles.pagina}>
          <div className={styles.estado}>
            <h1>Não foi possível carregar a loja</h1>
            <p>{erroVisivel || 'Locador não encontrado.'}</p>
            <button type="button" onClick={() => navigate('home')} className={styles.botaoVoltar}>Voltar para início</button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header navigate={navigate} currentRoute="perfilLoja" />

      <main className={styles.pagina}>
        <section className={styles.cabecalhoLoja}>
          <div className={styles.identidade}>
            <Avatar nome={perfil.nome} fotoUrl={fotoPerfil} size={116} />

            <div className={styles.infoLoja}>
             <div className={styles.nomeLinha}>
              <h1>{perfil.nome}</h1>

              <Icon
                icon="codicon:verified-filled"
                width={18}
                height={18}
                className={styles.logoVerificado}
                aria-label="Locador verificado"
              />
            </div>

              <p className={styles.desde}>Locador desde {perfil.desde}</p>

              <div className={styles.avaliacao}>
                <div className={styles.estrelas} aria-label={`Nota ${perfil.avaliacaoMedia.toFixed(1)}`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={18} fill={index < Math.round(perfil.avaliacaoMedia) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <strong>{perfil.avaliacaoMedia.toFixed(1)}</strong>
                <span>({perfil.totalAvaliacoes} avaliações)</span>
              </div>

              <p className={styles.localizacao}>
                <MapPin size={18} />
                {montarLocalizacao(perfil)}
              </p>
            </div>
          </div>

          <div className={styles.estatisticas}>
            <div className={styles.estatistica}>
              <Package size={28} />
              <strong>{perfil.ferramentasAnunciadas}</strong>
              <span>ferramentas<br />anunciadas</span>
            </div>
            <div className={styles.divisor} />
            <div className={styles.estatistica}>
              <FileText size={28} />
              <strong>{perfil.locacoesConcluidas}</strong>
              <span>locações<br />concluídas</span>
            </div>
          </div>
        </section>

        <section className={styles.listaSecao}>
          <div className={styles.tituloLinha}>
            <div>
              <h2>Ferramentas da loja</h2>
              <p>{ferramentasFiltradas.length} ferramentas disponíveis para locação</p>
            </div>

            <label className={styles.ordenacao}>
              <span>Ordenar por</span>
              <div className={styles.selectWrapper}>
                <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}>
                  <option value="relevantes">Mais relevantes</option>
                  <option value="menorPreco">Menor preço</option>
                  <option value="maiorPreco">Maior preço</option>
                  <option value="melhorAvaliacao">Melhor avaliação</option>
                </select>
                <ChevronDown size={17} />
              </div>
            </label>
          </div>

          <div className={styles.filtros}>
            <button
              type="button"
              className={`${styles.filtro} ${filtro === 'todas' ? styles.filtroAtivo : ''}`}
              onClick={() => setFiltro('todas')}
            >
              Todas
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria}
                type="button"
                className={`${styles.filtro} ${filtro === categoria ? styles.filtroAtivo : ''}`}
                onClick={() => setFiltro(categoria)}
              >
                {rotuloCategoria(categoria)}
              </button>
            ))}
          </div>

          {ferramentasFiltradas.length === 0 ? (
            <div className={styles.estadoLista}>
              <h3>Nenhuma ferramenta encontrada</h3>
              <p>Este filtro não possui ferramentas disponíveis para locação no momento.</p>
            </div>
          ) : (
            <div className={styles.grade}>
              {ferramentasFiltradas.map((ferramenta) => (
                <ProductCard
                  key={ferramenta.ferramentaId}
                  title={ferramenta.nome}
                  brand={ferramenta.usuarioNome}
                  price={Number(ferramenta.diaria ?? 0).toFixed(2).replace('.', ',')}
                  images={ferramenta.fotos.map((foto) => normalizarUrlImagem(foto.urlImagem)).filter(Boolean)}
                  rating={Number(ferramenta.avaliacaoMedia ?? 0)}
                  reviewCount={ferramenta.totalAvaliacoes ?? 0}
                  statusBadge={
                    <span className={`${styles.statusBadge} ${
                      (ferramenta.quantidadeDisponivel ?? 0) <= 1 ? styles.statusUltimaUnidade : styles.statusDisponivel
                    }`}>
                      {(ferramenta.quantidadeDisponivel ?? 0) <= 1 ? 'Última unidade' : 'Disponível'}
                    </span>
                  }
                  productId={ferramenta.ferramentaId}
                  showFavorite
                  showDetailsButton
                  className={styles.cardLoja}
                  onNavigate={() => handleVerDetalhes(ferramenta)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
