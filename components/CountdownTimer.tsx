import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string; // ISO string format "YYYY-MM-DDTHH:MM:SS"
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, expired: false };
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (timeRemaining.expired) {
    return (
      <div className="bg-red-700 text-white p-3 text-center text-lg sm:text-xl font-bold rounded-t-xl animate-pulse" role="timer" aria-live="polite">
        Oferta a expirat!
      </div>
    );
  }

  const TimeSegment: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <span className="text-3xl sm:text-4xl font-extrabold text-orange-400 leading-none" aria-label={`${value} ${label}`}>
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs sm:text-sm uppercase text-gray-200 mt-1">{label}</span>
    </div>
  );

  return (
    <div className="bg-black p-4 sm:p-5 text-center rounded-t-xl shadow-inner mb-6" role="timer" aria-live="off">
      <p className="text-sm sm:text-base font-semibold mb-3 text-white uppercase tracking-wide">
        OFERTA Black Friday expiră în:
      </p>
      <div className="flex justify-center space-x-4 sm:space-x-6">
        <TimeSegment value={timeRemaining.days} label="Zile" />
        <TimeSegment value={timeRemaining.hours} label="Ore" />
        <TimeSegment value={timeRemaining.minutes} label="Minute" />
        <TimeSegment value={timeRemaining.seconds} label="Secunde" />
      </div>
    </div>
  );
};

export default CountdownTimer;