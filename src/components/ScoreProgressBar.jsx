// src/components/ScoreProgressBar.jsx

import React from 'react';

export default function ScoreProgressBar({ score, thresholds }) {
  // We still need the thresholds to check if a star is "active"
  const { oneStar, twoStars, threeStars } = thresholds;
  
  // The maximum score for the bar is still the 3-star threshold
  const maxScore = threeStars;

  // The fill percentage calculation remains the same
  const fillPercentage = Math.min((score / maxScore) * 100, 100);

  // === THIS IS THE KEY CHANGE ===
  // The star data now uses FIXED visual positions for even spacing,
  // but still uses the real thresholds to check if they are active.
  const stars = [
    { threshold: oneStar,    position: 23 }, // Positioned at the 1/3 point
    { threshold: twoStars,   position: 50 }, // Positioned at the 2/3 point
    { threshold: threeStars, position: 80 },   // Positioned at the end
  ];

  return (
    <div className="score-progress-bar-container">
      <div className="score-progress-bar-fill" style={{ width: `${fillPercentage}%` }}></div>
      
      {/* This JSX does not need to change, it will now use the new fixed positions */}
      {stars.map((star, index) => {
        const isActive = score >= star.threshold;
        return (
          <div
            key={index}
            className={`score-progress-bar-star ${isActive ? 'active' : ''}`}
            style={{ left: `${star.position}%` }}
          >
            ⭐
          </div>
        );
      })}
    </div>
  );
}