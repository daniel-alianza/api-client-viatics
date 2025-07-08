export const useUtils = () => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  const extractCardNumber = (memo: string) => {
    const match = memo.match(/\*\d{4}/);
    return match ? match[0] : memo;
  };

  return {
    formatDate,
    extractCardNumber,
  };
};
