import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function useDailyConsecutive() {
  const [consecutive, setConsecutive] = useState('01');
  const storageKey = 'reassignment_consecutive';

  useEffect(() => {
    const today = format(new Date(), 'yyyyMMdd');
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      const { date, count } = JSON.parse(stored);
      if (date === today) {
        setConsecutive(count.toString().padStart(2, '0'));
      } else {
        // Si es un nuevo día, reiniciar el consecutivo
        localStorage.setItem(
          storageKey,
          JSON.stringify({ date: today, count: '01' }),
        );
        setConsecutive('01');
      }
    } else {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ date: today, count: '01' }),
      );
    }
  }, []);

  const incrementConsecutive = () => {
    const today = format(new Date(), 'yyyyMMdd');
    const currentCount = parseInt(consecutive);
    const nextCount = (currentCount + 1).toString().padStart(2, '0');

    localStorage.setItem(
      storageKey,
      JSON.stringify({ date: today, count: nextCount }),
    );
    setConsecutive(nextCount);

    return nextCount;
  };

  return {
    consecutive,
    incrementConsecutive,
  };
}
