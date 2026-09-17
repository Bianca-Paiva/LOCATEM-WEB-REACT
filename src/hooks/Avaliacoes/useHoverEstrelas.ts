import { useState } from 'react';

/**
 * Controla o preview visual ao passar o mouse sobre uma fileira de estrelas.
 * Reaproveitado tanto no card da lista quanto nas sub-avaliações do modal.
 *
 * - valorHover: nota "temporária" exibida durante o hover (null = sem hover)
 * - aoPassarMouse: chamar no onMouseEnter de cada estrela (índice 0-based)
 * - aoSairMouse: chamar no onMouseLeave da fileira, volta a mostrar a nota salva
 */
export function useHoverEstrelas() {
    const [valorHover, setValorHover] = useState<number | null>(null);

    const aoPassarMouse = (indice: number) => setValorHover(indice + 1);
    const aoSairMouse = () => setValorHover(null);

    return { valorHover, aoPassarMouse, aoSairMouse };
}