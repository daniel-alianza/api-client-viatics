import { useState, useEffect } from 'react';

export const useFormAnimation = (isVisible = true, delay = 0) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isVisible) {
      setShouldRender(true);
      timeout = setTimeout(() => {
        setIsAnimating(true);
      }, delay);
    } else {
      setIsAnimating(false);
      timeout = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Animation duration
    }

    return () => clearTimeout(timeout);
  }, [isVisible, delay]);

  return { shouldRender, isAnimating };
};
