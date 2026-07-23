/**
 * Converte um horário de início (ex: "09:00") no intervalo de 3 horas usado
 * como janela de entrega/coleta da ferramenta (ex: "09:00 às 12:00").
 *
 * Usado tanto no resumo da solicitação de reserva quanto nos avisos de status
 * (em transporte / aguardando devolução), garantindo que o mesmo horário
 * escolhido gere sempre a mesma janela de 3h em qualquer tela.
 */
export function formatarIntervaloHorario(horario: string): string {
    if (!horario) return '';

    const [horaStr] = horario.split(':');
    const horaInicio = parseInt(horaStr, 10);

    if (Number.isNaN(horaInicio)) return horario;

    const horaFim = String(horaInicio + 3).padStart(2, '0');
    return `${horario} às ${horaFim}:00`;
}