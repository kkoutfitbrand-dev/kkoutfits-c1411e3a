import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if already loaded
    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => console.error('Failed to load Razorpay script');
    document.body.appendChild(script);

    return () => {
      // Cleanup if component unmounts before script loads
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return { isLoaded };
};
