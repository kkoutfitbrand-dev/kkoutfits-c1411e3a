import { useState, useEffect } from 'react';

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: 'coming-soon' | 'countdown' | 'ended';
}

// Summer Sale 2026 — June 1, 2026 at 12:00 PM (noon)
const TARGET_DATE = new Date('2026-06-01T12:00:00');
const COUNTDOWN_START_DAYS = 7;

export function useSummerCountdown(): CountdownState {
  const [state, setState] = useState<CountdownState>(() => calculateState());

  function calculateState(): CountdownState {
    const now = new Date();
    const diff = TARGET_DATE.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'ended' };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > COUNTDOWN_START_DAYS) {
      return { days, hours, minutes, seconds, status: 'coming-soon' };
    }

    return { days, hours, minutes, seconds, status: 'countdown' };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setState(calculateState());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return state;
}
