// Función para extraer el número de tarjeta del memo
export const extractCardNumber = (memo: string): string => {
  // Buscar un patrón de 16 dígitos en el memo
  const cardPattern = /\b\d{16}\b/;
  const match = memo.match(cardPattern);
  return match ? match[0] : '-';
};
