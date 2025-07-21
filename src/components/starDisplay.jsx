// src/components/StarDisplay.jsx
import { useState, useEffect } from 'react';

export default function StarDisplay({ starsEarned = 0 }) {
  const [animatedStars, setAnimatedStars] = useState(0);

  // Animate the stars appearing one by one
  useEffect(() => {
    if (starsEarned > 0) {
      const timers = [];
      for (let i = 1; i <= starsEarned; i++) {
        timers.push(setTimeout(() => setAnimatedStars(i), i * 400));
      }
      return () => timers.forEach(clearTimeout);
    }
  }, [starsEarned]);

  return (
    <div className="star-display">
      <span className={`star ${animatedStars >= 1 ? 'active' : ''}`}>★</span>
      <span className={`star ${animatedStars >= 2 ? 'active' : ''}`}>★</span>
      <span className={`star ${animatedStars >= 3 ? 'active' : ''}`}>★</span>
    </div>
  );
}