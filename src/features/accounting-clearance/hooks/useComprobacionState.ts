import { useState } from 'react';

export const useComprobacionState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [taxIndicator, setTaxIndicator] = useState('');
  const [distributionRule, setDistributionRule] = useState('');
  const [comment, setComment] = useState('');

  return {
    isOpen,
    setIsOpen,
    category,
    setCategory,
    taxIndicator,
    setTaxIndicator,
    distributionRule,
    setDistributionRule,
    comment,
    setComment,
  };
};
