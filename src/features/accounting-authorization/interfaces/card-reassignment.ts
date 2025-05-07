export interface CardReassignment {
  cardNumber: string; // Numero de tarjeta (16 caracteres maximo)
  description: string; // Descripcion (40 caracteres maximo)
  sign: '+' | '-'; // Signo para incremento o decremento
  amount: number; // Monto (11 caracteres maximo)
  startDate: string; // Fecha de inicio (aaaammdd)
  endDate?: string; // Fecha de fin (aaaammdd), opcional
}

export interface ReassignmentControlRow {
  clientNumber: string; // Número de cliente (10 dígitos máximo)
  groupNumber: string; // Número de grupo proporcionado
  sendDate: string; // Fecha de envío (aaaammdd)
  totalAmount: number; // Suma total de los límites asignados
  recordCount: number; // Total de tarjetas a reasignar
}

export interface ReassignmentFileName {
  type: 'R'; // Constante R para reasignación
  month: string; // MM (mes)
  day: string; // DD (día)
  consecutive: string; // CC (consecutivo diario)
  groupNumber: string; // NNNNNNNNN (número de grupo)
  extension: '.csv'; // Extensión del archivo
}

export type CardStatus = 'APROBADA' | 'DISPERSADA';
