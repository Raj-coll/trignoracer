// src/components/ScoreProgressBar.jsx

import React from 'react';
import './ScoreProgressBar.css'; // 1. IMPORT THE NEW CSS

// The helper function for formatting labels remains the same.
const formatScoreLabel = (num) => {
  if (num >= 10000) return `${Math.round(num / 1000)}k`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace('.0', '')}k`;
  return num;
};

// We keep all your existing logic exactly as it was.
export default function ScoreProgressBar({ score, thresholds }) {
  const { oneStar, twoStars, threeStars } = thresholds;
  const maxScore = threeStars;

  const fillPercentage = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;

  const stars = [
    { threshold: oneStar,    position: 23 },
    { threshold: twoStars,   position: 50 },
    { threshold: threeStars, position: 78 },
  ];

  const marks = [];
  if (maxScore > 0) {
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxScore)) - 1);
    let interval = Math.ceil(maxScore / 5 / magnitude) * magnitude;
    if (interval === 0) interval = magnitude > 0 ? magnitude : 1000;
    for (let markValue = interval; markValue < maxScore * 0.95; markValue += interval) {
      marks.push(markValue);
    }
  }

  // 2. UPDATE THE JSX WITH THE NEW CLASS NAMES
  return (
    <div className="new-progress-container">
      {/* The fill bar moves accurately behind the stars and marks */}
      <div className="new-progress-fill" style={{ width: `${fillPercentage}%` }}></div>

      {/* The score marks are rendered on top (styled to be below the bar) */}
      <div className="new-progress-marks-container">
        {marks.map((markValue) => {
          const position = (markValue / maxScore) * 100;
          return (
            <div key={markValue} className="new-progress-mark" style={{ left: `${position}%` }}>
              <div className="new-progress-mark-line"></div>
              <span className="new-progress-mark-label">{formatScoreLabel(markValue)}</span>
            </div>
          );
        })}
      </div>
      
      {/* The stars are rendered at their fixed visual positions */}
      <div className="new-progress-stars-container">
        {stars.map((star, index) => {
          const isActive = score >= star.threshold;
          return (
            <div
              key={index}
              className={`new-progress-star ${isActive ? 'active' : ''}`}
              style={{ left: `${star.position}%` }}
            >
              ⭐
            </div>
          );
        })}
      </div>
    </div>
  );
}