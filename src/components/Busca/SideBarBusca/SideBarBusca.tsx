import { useState } from 'react';
import { Search } from 'lucide-react';

import type { FilterState } from '../../../pages/Busca/Busca.types';
import { OPCOES_FONTE_ALIMENTACAO, CATEGORIAS_FERRAMENTA } from '../../../pages/CadastroFerramenta/CadastroFerramenta.types';
import styles from './SideBarBusca.module.css';


interface SideBarBuscaProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
}


export function SideBarBusca({ isOpen, onClose, onApplyFilters }: SideBarBuscaProps) {

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [brandSearch, setBrandSearch] = useState<string>('');

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const [selectedVoltagens, setSelectedVoltagens] = useState<string[]>([]);

  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null);

  const [selectedRating, setSelectedRating] = useState<number | null>(null);


  const toggleCategory = (category: string) => {

    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };


  const toggleBrand = (brand: string) => {

    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleVoltagem = (voltagem: string) => {

    setSelectedVoltagens(prev =>
      prev.includes(voltagem) ? prev.filter(v => v !== voltagem) : [...prev, voltagem]
    );
  };

  const togglePriceRange = (range: string) => {

    setSelectedPriceRanges(prev =>
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const togglePayment = (method: string) => {

    setSelectedPayments(prev =>
      prev.includes(method) ? prev.filter(p => p !== method) : [...prev, method]
    );
  };

  const handleApply = () => {

    onApplyFilters({
      categories: selectedCategories,
      brands: selectedBrands,
      brandSearch: brandSearch,
      voltagens: selectedVoltagens,
      priceRanges: selectedPriceRanges,
      paymentMethods: selectedPayments,
      availability: selectedAvailability,
      minRating: selectedRating,
    });
  };


  const handleClear = () => {

    setSelectedCategories([]);
    setBrandSearch('');
    setSelectedBrands([]);
    setSelectedVoltagens([]);
    setSelectedPriceRanges([]);
    setSelectedPayments([]);
    setSelectedAvailability(null);
    setSelectedRating(null);

    onApplyFilters({
      categories: [],
      brands: [],
      brandSearch: '',
      voltagens: [],
      priceRanges: [],
      paymentMethods: [],
      availability: null,
      minRating: null,
    });
  };


  return (
    <>

      {/* Fundo escurecido que fecha o menu ao ser clicado */}
      <div
        className={`${styles.sidebarOverlayBackdrop} ${isOpen ? styles.visibleActive : ''}`}
        onClick={onClose}
      />

      <aside className={`${styles.sidebarContainer} ${isOpen ? styles.drawerOpen : ''}`}>

        <div className={styles.sidebarHeader}>

          <h2>Filtros</h2>

          {/* Botão de Fechar X exclusivo do mobile/tablet */}
          <button className={styles.sidebarCloseDrawerBtn} onClick={onClose}>
            &times;
          </button>

        </div>

        <hr className={styles.sidebarDivider} />

        {/* Categoria */}
        <div className={styles.filterSection}>

          <h3 className={styles.filterTitle}>Categoria</h3>

          <div className={styles.pillsContainer}>

            {CATEGORIAS_FERRAMENTA.map((cat) => (

              <button
                key={cat}
                className={`${styles.filterPill} ${selectedCategories.includes(cat) ? styles.active : ''}`}
                onClick={() => toggleCategory(cat)}
              >
                {cat}
              </button>
            ))}

          </div>

        </div>

        <hr className={styles.sidebarDivider} />

        {/* Marca */}
        <div className={styles.filterSection}>

          <h3 className={styles.filterTitle}>Marca</h3>

          <div className={styles.brandSearchWrapper}>

            <input
              type="text"
              placeholder="Marca"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className={styles.brandSearchInput}
            />

            <Search className={styles.searchIcon} size={14} strokeWidth={2} />

          </div>

          <div className={styles.pillsContainer}>

            {['DeWalt', 'Bosch', 'Makita', 'Hanabi', 'WAP', 'Black+Decker', 'Tramontina', 'Vonder'].map((brand) => (

              <button
                key={brand}
                className={`${styles.filterPill} ${selectedBrands.includes(brand) ? styles.active : ''}`}
                onClick={() => toggleBrand(brand)}
              >
                {brand}
              </button>
            ))}
          </div>

        </div>

        <hr className={styles.sidebarDivider} />

        {/* Voltagem */}
        <div className={styles.filterSection}>

          <h3 className={styles.filterTitle}>Voltagem</h3>

          <div className={styles.pillsContainer}>

            {OPCOES_FONTE_ALIMENTACAO.map((voltagem) => (

              <button
                key={voltagem}
                className={`${styles.filterPill} ${selectedVoltagens.includes(voltagem) ? styles.active : ''}`}
                onClick={() => toggleVoltagem(voltagem)}
              >
                {voltagem}
              </button>
            ))}
          </div>

        </div>

        <hr className={styles.sidebarDivider} />


        {/* Faixa de Preço */}
        <div className={styles.filterSection}>

          <h3 className={styles.filterTitle}>Faixa de Preço</h3>

          <div className={styles.pillsContainer}>

            {['R$0 - R$50', 'R$51 - R$100', 'R$101 - R$200', 'R$201+'].map((range) => (

              <button
                key={range}
                className={`${styles.filterPill} ${selectedPriceRanges.includes(range) ? styles.active : ''}`}
                onClick={() => togglePriceRange(range)}
              >
                {range}

              </button>
            ))}
          </div>

        </div>

        <hr className={styles.sidebarDivider} />


        {/* Formas de Pagamento */}
        <div className={styles.filterSection}>

          <h3 className={styles.filterTitle}>Formas de Pagamento</h3>

          <div className={styles.pillsContainer}>

            {['Cartão de Crédito', 'Cartão de Débito', 'Pix'].map((method) => (

              <button
                key={method}
                className={`${styles.filterPill} ${selectedPayments.includes(method) ? styles.active : ''}`}
                onClick={() => togglePayment(method)}
              >
                {method}
              </button>
            ))}
          </div>

        </div>

        <hr className={styles.sidebarDivider} />


        {/* Disponibilidade */}
        <div className={styles.filterSection}>

          <h3 className={styles.filterTitle}>Disponibilidade</h3>

          <div className={styles.pillsContainer}>

            {['Disponível para Aluguel', 'Indisponível para Aluguel'].map((status) => (

              <button
                key={status}
                className={`${styles.filterPill} ${selectedAvailability === status ? styles.active : ''}`}
                onClick={() => setSelectedAvailability(selectedAvailability === status ? null : status)}
              >
                {status}
              </button>
            ))}
          </div>

        </div>

        <hr className={styles.sidebarDivider} />


        {/* Avaliação */}
        <div className={styles.filterSection}>

          <h3 className={styles.filterTitle}>Avaliação</h3>

          <div className={styles.pillsContainer}>

            {[
              { label: '4 estrelas ou mais', value: 4 },
              { label: '3 estrelas ou mais', value: 3 },
              { label: '2 estrelas ou mais', value: 2 },
              { label: '1 estrela ou mais', value: 1 },
            ].map((ratingItem) => (

              <button
                key={ratingItem.value}
                className={`${styles.filterPill} ${selectedRating === ratingItem.value ? styles.active : ''}`}
                onClick={() => setSelectedRating(selectedRating === ratingItem.value ? null : ratingItem.value)}
              >
                {ratingItem.label}
              </button>
            ))}
          </div>

        </div>

        <div className={styles.sidebarActions}>

          <button className={styles.sidebarBtnPrimary} onClick={handleApply}>
            Pesquisar
          </button>

          <button className={styles.sidebarBtnSecondary} onClick={handleClear}>
            Limpar Filtros
          </button>

        </div>
      </aside>
    </>
  );
}