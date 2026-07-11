import type { ReservaData } from './MinhasReservas.types';

import furadeiraBosch from '../../assets/ProdutosImg/FuradeiraBosch.png';
import pistolaPintura from '../../assets/ProdutosImg/pistolaPintura.png';
import furadeiraBlackTools from '../../assets/ProdutosImg/FuradeiraTheBlackTools.png';
import aparadorGrama from '../../assets/ProdutosImg/aparadorGrama.png';
import furadeiraWap from '../../assets/ProdutosImg/FuradeiraWapPreta.png';
import lixadeiraOrbital from '../../assets/ProdutosImg/lixadeiraEletrica.png';

// Mock de reservas. Estrutura pensada para mapear diretamente a resposta futura da API.
export const mockReservas: ReservaData[] = [
  {
    id: '1',
    produto: 'Furadeira Bosch GSB 13 RE',
    imagem: furadeiraBosch,
    periodo: '15 Jul – 18 Jul 2025',
    locador: 'Carlos Silva',
    status: 'pendente',
    mensagemStatus: 'Aguardando aprovação do locador',
  },
  {
    id: '2',
    produto: 'Pistola Pintura Sucção 1000ml 3 Bicos 1.2 1.5 1.8 BTPT1100 Profissional The Black Tools',
    imagem: pistolaPintura,
    periodo: '10 Jul – 12 Jul 2025',
    locador: 'João Ferreira',
    status: 'aprovada',
    mensagemStatus: 'Reserva aprovada',
  },
  {
    id: '3',
    produto: 'Furadeira Parafusadeira Sem Fio A Bateria Tb-12e 12v 3/8 10mm Com Maleta E Acessórios The Black Tools',
    imagem: furadeiraBlackTools,
    periodo: '05 Jul – 07 Jul 2025',
    locador: 'Maria Oliveira',
    status: 'recusada',
    mensagemStatus: 'Reserva recusada pelo locador',
  },
  {
    id: '4',
    produto: 'Aparador De Grama Bipartido Tramontina Apb1500t Cor Laranja Escuro 220v',
    imagem: aparadorGrama,
    periodo: '01 Jul – 03 Jul 2025',
    locador: 'Ana Souza',
    status: 'cancelada',
    mensagemStatus: 'Reserva cancelada',
  },
  {
    id: '5',
    produto: 'Parafusadeira E Furadeira A Bateria Li-ion Wap Wf 12k3.2 Carregador Com Maleta E Kit De 11 Acessórios',
    imagem: furadeiraWap,
    periodo: '20 Jul – 25 Jul 2025',
    locador: 'Ricardo Gomes',
    status: 'pendente',
    mensagemStatus: 'Aguardando aprovação do locador',
  },
  {
    id: '6',
    produto: 'Lixadeira Orbital Bosch GSS 140',
    imagem: lixadeiraOrbital,
    periodo: '22 Jul – 24 Jul 2025',
    locador: 'Carlos Silva',
    status: 'aprovada',
    mensagemStatus: 'Reserva aprovada',
  },
];
