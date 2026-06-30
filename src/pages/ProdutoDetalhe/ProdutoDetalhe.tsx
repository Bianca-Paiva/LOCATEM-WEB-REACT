import Header from '../../components/Header/Header';
import { ImagemCarrossel } from '../../components/ProdutoDetalhe/ImagemCarrossel/ImagemCarrossel';
import { ProdutoInfo } from '../../components/ProdutoDetalhe/ProdutoInfo/ProdutoInfo';
import { ProdutosSemelhantes } from '../../components/ProdutoDetalhe/ProdutosSemelhantes/ProdutosSemelhantes';
import { Descricao } from '../../components/ProdutoDetalhe/Descricao/Descricao';
import { EspecificacoesTecnicas } from '../../components/ProdutoDetalhe/EspecificacoesTecnicas/EspecificacoesTecnicas';
import { InfoVendedor } from '../../components/ProdutoDetalhe/InfoVendedor/InfoVendedor';
import { AvaliacaoSection } from '../../components/ProdutoDetalhe/AvaliacaoSection/AvaliacaoSection';
import { BannerLateral } from '../../components/ProdutoDetalhe/BannerLateral/BannerLateral';
import { useProdutoStore } from '../../store/produtoStore';
import type { ProdutoSelecionado } from '../../store/produtoStore';
import type { Route } from '../../router/useRouter';
import './ProdutoDetalhe.css';

interface ProdutoDetalheProps {
  navigate: (route: Route) => void;
}

// ── Dados estáticos de fallback (exibidos quando não há produto no store) ──────
const FALLBACK_PRODUTO = {
  title: 'Furadeira Parafusadeira Sem Fio A Bateria Tb-12e 12v 3/8 10mm Com Maleta E Acessórios The Black Tools',
  brand: 'The Black Tools',
  price: '15',
  rating: 4.8,
  reviewCount: 100,
  image: 'src/assets/Furadeira1.webp',
  imageVerificado: 'src/assets/verificado.png',
  imageNota: 'src/assets/StarFull.png',
};

const MOCK_SEMELHANTES = [
  {
    id: 10,
    title: 'Aparador De Grama Bipartido Equip. Tramontina',
    brand: 'Tramontina',
    price: '35,00',
    image: 'src/assets/aparadorGrama.webp',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.6,
    reviewCount: 28,
  },
  {
    id: 11,
    title: 'Pistola de Pintura Profissional',
    brand: 'Black & Decker',
    price: '30,00',
    image: 'src/assets/pistolaPintura.png',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.2,
    reviewCount: 87,
  },
  {
    id: 12,
    title: 'Parafusadeira Furadeira de Impacto Hanabi',
    brand: 'Makita',
    price: '28,00',
    image: 'src/assets/Furadeira3.webp',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.7,
    reviewCount: 201,
  },
  {
    id: 13,
    title: 'Serra Tico-Tico de Bancada',
    brand: 'Bosch',
    price: '50,00',
    image: 'src/assets/parafusadeira-furadeira-WAP.webp',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.4,
    reviewCount: 76,
  },
  {
    id: 14,
    title: 'Furadeira Parafusadeira Impacto 1/2',
    brand: 'Bosch',
    price: '45,00',
    image: 'src/assets/Furadeira1.webp',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.5,
    reviewCount: 124,
  },
  {
    id: 15,
    title: 'Parafusadeira e Furadeira WAP 12V',
    brand: 'WAP',
    price: '18,00',
    image: 'src/assets/Furadeira4.webp',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.3,
    reviewCount: 62,
  },
  {
    id: 16,
    title: 'Cortador de Grama Dirigível',
    brand: 'Black & Decker',
    price: '210,00',
    image: 'src/assets/parafusadeira-wap.png',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 2.9,
    reviewCount: 27,
  },
  {
    id: 17,
    title: 'Aparador De Grama Bipartido',
    brand: 'DeWalt',
    price: '85,00',
    image: 'src/assets/aparadorGrama.webp',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.1,
    reviewCount: 45,
  },
];

const MOCK_ESPECIFICACOES = [
  { label: 'Potência de saída', valor: 'Bateria de Íon-lítio de 18V máx' },
  { label: 'Torque máximo', valor: '65 Nm' },
  { label: 'Tamanho do mandril', valor: '13mm Sem chave' },
  { label: 'Acessórios incluídos', valor: '2 baterias, carregador, estojo rígido, conjunto de 10 bits' },
];

const MOCK_AVALIACOES = [
  {
    nome: 'João Silva',
    rating: 5,
    tempo: 'Há 2 dias',
    texto: 'Furadeira muito boa, usei pra montar um guarda-roupa inteiro. Super potente e a bateria durou o projeto todo.',
    fotos: ['src/assets/Furadeira1.webp', 'src/assets/Furadeira1.webp', 'src/assets/Furadeira1.webp'],
    utilCount: 12,
  },
  {
    nome: 'Maria Souza',
    rating: 5,
    tempo: 'Há 1 semana',
    texto: 'O equipamento foi perfeito. O atendimento na retirada foi excelente também.',
    fotos: [],
    utilCount: 5,
  },
  {
    nome: 'Pedro Ribeiro',
    rating: 4,
    tempo: 'Há 2 semanas',
    texto: 'Máquina limpa e pronta para uso. Recomendo.',
    fotos: [],
    utilCount: 2,
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function ProdutoDetalhe({ navigate }: ProdutoDetalheProps) {
  const { produtoSelecionado, setProdutoSelecionado } = useProdutoStore();

  // Usa os dados do produto clicado; caso acesse direto via hash, usa fallback
  const produto: ProdutoSelecionado = produtoSelecionado ?? FALLBACK_PRODUTO;

  // Ao clicar num card semelhante: salva no store e força re-render no topo
  const handleSemelhante = (p: ProdutoSelecionado) => {
    setProdutoSelecionado(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="produto-detalhe-container">
      <Header navigate={navigate} currentRoute="home" />

      <main className="produto-detalhe-main">

        {/* ── LAYOUT: conteúdo (esquerda) + banner alto (direita, desktop) ── */}
        <div className="produto-layout-desktop">

          <div className="produto-col-conteudo">

            {/* ── SEÇÃO HERO ── */}
            <section className="produto-hero-section">
              <div className="produto-hero-inner">

                <div className="produto-col-imagem">
                  <ImagemCarrossel
                    images={[produto.image, produto.image, produto.image]}
                    title={produto.title}
                  />
                </div>

                <div className="produto-col-info">
                  <ProdutoInfo
                    title={produto.title}
                    price={produto.price}
                    rating={produto.rating}
                    reviewCount={produto.reviewCount}
                    brand={produto.brand}
                    imageVerificado={produto.imageVerificado}
                    imageNota={produto.imageNota}
                  />
                </div>

              </div>
            </section>

            {/* ── PRODUTOS SEMELHANTES ── */}
            <section className="produto-section-padded">
              <ProdutosSemelhantes
                produtos={MOCK_SEMELHANTES}
                onCardClick={handleSemelhante}
              />
            </section>

            {/* ── GRID INFERIOR ── */}
            <div className="produto-grid-inferior">

              <div className="produto-desc-vendedor-row">
                <div className="produto-desc-col">
                  <Descricao
                    texto="Ideal para uso doméstico e profissional leve. Perfeita para montagem de móveis, instalações e pequenos reparos. Compacta, potente e fácil de manusear — resolve o problema sem complicação."
                  />
                </div>
                <div className="produto-vendedor-col">
                  <InfoVendedor
                    nome="HomeFix Pro Store"
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
          <div className="produto-col-banner">
            <BannerLateral />
          </div>

        </div>

        {/* Banner inline — visível só no mobile, abaixo de todo o conteúdo */}
        <div className="produto-col-banner-mobile">
          <BannerLateral />
        </div>

      </main>
    </div>
  );
}