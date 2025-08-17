import { useEffect } from 'react';

type BackgroundColor = 'green' | 'black';

export const usePageBackground = (color: BackgroundColor) => {
  useEffect(() => {
    const root = document.documentElement;
    
    switch (color) {
      case 'black':
        root.style.setProperty('--page-background', '#000000');
        break;
      case 'green':
      default:
        root.style.setProperty('--page-background', '#16a34a');
        break;
    }

    // Cleanup function to reset background when component unmounts
    return () => {
      root.style.setProperty('--page-background', '#16a34a');
    };
  }, [color]);
};
