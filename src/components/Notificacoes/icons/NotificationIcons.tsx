import type { SVGProps } from 'react';

/**
 * Ícones SVG usados na tela de Notificações e no modal de detalhes.
 * Componentes simples (sem lib externa) para evitar dependências extras.
 */

export const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const WarningIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TruckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M1 3H15V16H1V3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 8H19L23 12V16H15V8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
    <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const ClockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 7V12L15.5 14.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DocumentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M6 2H14L20 8V20A2 2 0 0 1 18 22H6A2 2 0 0 1 4 20V4A2 2 0 0 1 6 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const RefreshIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M21 2V8H15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 12A9 9 0 0 1 20.49 8M3 12A9 9 0 0 0 20.49 16M3 12V18M3 18H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrashIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M3 6H21M8 6V4A2 2 0 0 1 10 2H14A2 2 0 0 1 16 4V6M19 6V20A2 2 0 0 1 17 22H7A2 2 0 0 1 5 20V6H19Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BellOffIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M18 8A6 6 0 0 0 6 8C6 14 3 16 3 16H16M13.73 21A2 2 0 0 1 10.27 21M2 2L22 22"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Usado no botão de fechar do modal de detalhes
export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Usado no botão "Pagar agora" do modal de detalhes
export const WalletIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M3 7A2 2 0 0 1 5 5H17A2 2 0 0 1 19 7V8H21V17A2 2 0 0 1 19 19H5A2 2 0 0 1 3 17V7Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M15 13H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);