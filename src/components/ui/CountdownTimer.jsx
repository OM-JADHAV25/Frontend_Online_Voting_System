import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ expiryTimestamp }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(expiryTimestamp) - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearTimeout(timer);
  });

  const timeItems = Object.entries(timeLeft).map(([interval, value]) => ({
    label: interval.toUpperCase(),
    value: String(value).padStart(2, '0'),
  }));

  return (
    <div className="bg-blue-900/50 border border-blue-700/30 rounded-lg p-4">
      <div className="text-sm font-semibold text-blue-300 mb-3">VOTING PERIOD REMAINING</div>
      <div className="flex justify-center space-x-2 md:space-x-4">
        {timeItems.map((item) => (
          <div key={item.label} className="text-center">
            <div className="bg-blue-800 text-white rounded px-3 py-2 min-w-[50px] md:min-w-[60px]">
              <div className="text-2xl font-mono font-bold">{item.value}</div>
              <div className="text-xs opacity-90">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}