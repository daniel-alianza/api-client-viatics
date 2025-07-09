import { useState, useEffect } from 'react';
import { getInspirationQuotes } from '../../../services/phraseService';
import type { InspirationQuote } from '@/interfaces/phraseInterfece';

export const useDailyQuote = () => {
  const [randomQuote, setRandomQuote] = useState<InspirationQuote | null>(null);

  useEffect(() => {
    const fetchDailyQuote = async () => {
      try {
        const response = await getInspirationQuotes();
        if (response.success && response.data.length > 0) {
          // Obtener la fecha actual en formato YYYY-MM-DD
          const today = new Date();
          const dateString = today.toISOString().split('T')[0];

          // Usar la fecha como semilla para seleccionar la frase
          const seed = dateString.split('-').join('');
          const randomIndex = parseInt(seed) % response.data.length;

          setRandomQuote(response.data[randomIndex]);
        }
      } catch (error) {
        console.error('Error al obtener la frase:', error);
      }
    };

    fetchDailyQuote();
  }, []);

  return { randomQuote };
};
