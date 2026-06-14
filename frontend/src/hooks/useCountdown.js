import { useEffect, useState } from 'react';

// Returns { days, hours, minutes, seconds, expired, total } counting down to target ISO date
export default function useCountdown(targetDate) {
  const calc = () => {
    const total = new Date(targetDate).getTime() - Date.now();
    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true, total: 0 };
    }
    return {
      total,
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((total / (1000 * 60)) % 60),
      seconds: Math.floor((total / 1000) % 60),
      expired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return timeLeft;
}
