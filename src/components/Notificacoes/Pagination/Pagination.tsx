import { ChevronLeftIcon, ChevronRightIcon } from '../icons/NotificationIcons';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onPrev,
  onNext,
}: PaginationProps) {
  // Com 1 página ou menos não há o que paginar
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={styles.pagination} aria-label="Paginação de notificações">
      <button
        type="button"
        className={styles.arrowButton}
        onClick={onPrev}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <ChevronLeftIcon />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`${styles.pageButton} ${page === currentPage ? styles.pageButtonActive : ''}`}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className={styles.arrowButton}
        onClick={onNext}
        disabled={currentPage === totalPages}
        aria-label="Próxima página"
      >
        <ChevronRightIcon />
      </button>
    </nav>
  );
}