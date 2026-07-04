 import { useState } from 'react';

import type { FilterState } from '../../../pages/Busca/Busca';

import './SideBarBusca.css';


interface SideBarBuscaProps {

  isOpen: boolean;

  onClose: () => void;

  onApplyFilters: (filters: FilterState) => void;

}


export function SideBarBusca({ isOpen, onClose, onApplyFilters }: SideBarBuscaProps) {

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [brandSearch, setBrandSearch] = useState<string>('');

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

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

    setSelectedPriceRanges([]);

    setSelectedPayments([]);

    setSelectedAvailability(null);

    setSelectedRating(null);

    

    onApplyFilters({

      categories: [],

      brands: [],

      brandSearch: '',

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

        className={`sidebar-overlay-backdrop ${isOpen ? 'visible-active' : ''}`} 

        onClick={onClose}

      />

      

      <aside className={`sidebar-container ${isOpen ? 'drawer-open' : ''}`}>

        <div className="sidebar-header">

          <h2>Filtros</h2>

          {/* Botão de Fechar X exclusivo do mobile/tablet */}

          <button className="sidebar-close-drawer-btn" onClick={onClose}>

            &times;

          </button>

        </div>

        <hr className="sidebar-divider" />


        {/* Categoria */}

        <div className="filter-section">

          <h3 className="filter-title">Categoria</h3>

          <div className="pills-container">

            {['Ferramentas Elétricas', 'Ferramentas Manuais', 'Equipamentos de Jardinagem', 'Máquinas Pesadas'].map((cat) => (

              <button

                key={cat}

                className={`filter-pill ${selectedCategories.includes(cat) ? 'active' : ''}`}

                onClick={() => toggleCategory(cat)}

              >

                {cat}

              </button>

            ))}

          </div>

        </div>

        <hr className="sidebar-divider" />


        {/* Marca */}

        <div className="filter-section">

          <h3 className="filter-title">Marca</h3>

          <div className="brand-search-wrapper">

            <input

              type="text"

              placeholder="Marca"

              value={brandSearch}

              onChange={(e) => setBrandSearch(e.target.value)}

              className="brand-search-input"

            />

            <span className="search-icon">🔍</span>

          </div>

          <div className="pills-container">

            {['Bosch', 'Makita', 'DeWalt', 'Black & Decker'].map((brand) => (

              <button

                key={brand}

                className={`filter-pill ${selectedBrands.includes(brand) ? 'active' : ''}`}

                onClick={() => toggleBrand(brand)}

              >

                {brand}

              </button>

            ))}

          </div>

        </div>

        <hr className="sidebar-divider" />


        {/* Faixa de Preço */}

        <div className="filter-section">

          <h3 className="filter-title">Faixa de Preço</h3>

          <div className="pills-container">

            {['R$0 - R$50', 'R$51 - R$100', 'R$101 - R$200', 'R$201+'].map((range) => (

              <button

                key={range}

                className={`filter-pill ${selectedPriceRanges.includes(range) ? 'active' : ''}`}

                onClick={() => togglePriceRange(range)}

              >

                {range}

              </button>

            ))}

          </div>

        </div>

        <hr className="sidebar-divider" />


        {/* Formas de Pagamento */}

        <div className="filter-section">

          <h3 className="filter-title">Formas de Pagamento</h3>

          <div className="pills-container">

            {['Cartão de Crédito', 'Boleto Bancário', 'Pix', 'Transferência Bancária'].map((method) => (

              <button

                key={method}

                className={`filter-pill ${selectedPayments.includes(method) ? 'active' : ''}`}

                onClick={() => togglePayment(method)}

              >

                {method}

              </button>

            ))}

          </div>

        </div>

        <hr className="sidebar-divider" />


        {/* Disponibilidade */}

        <div className="filter-section">

          <h3 className="filter-title">Disponibilidade</h3>

          <div className="pills-container">

            {['Disponível para Aluguel', 'Indisponível para Aluguel'].map((status) => (

              <button

                key={status}

                className={`filter-pill ${selectedAvailability === status ? 'active' : ''}`}

                onClick={() => setSelectedAvailability(selectedAvailability === status ? null : status)}

              >

                {status}

              </button>

            ))}

          </div>

        </div>

        <hr className="sidebar-divider" />


        {/* Avaliação */}

        <div className="filter-section">

          <h3 className="filter-title">Avaliação</h3>

          <div className="pills-container">

            {[

              { label: '4 estrelas ou mais', value: 4 },

              { label: '3 estrelas ou mais', value: 3 },

              { label: '2 estrelas ou mais', value: 2 },

              { label: '1 estrela ou mais', value: 1 },

            ].map((ratingItem) => (

              <button

                key={ratingItem.value}

                className={`filter-pill ${selectedRating === ratingItem.value ? 'active' : ''}`}

                onClick={() => setSelectedRating(selectedRating === ratingItem.value ? null : ratingItem.value)}

              >

                {ratingItem.label}

              </button>

            ))}

          </div>

        </div>


        <div className="sidebar-actions">

          <button className="sidebar-btn-primary" onClick={handleApply}>

            Filtrar

          </button>

          <button className="sidebar-btn-secondary" onClick={handleClear}>

            Limpar Filtros

          </button>

        </div>

      </aside>

    </>

  );

} 