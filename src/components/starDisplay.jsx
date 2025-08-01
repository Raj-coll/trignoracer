// src/components/StarDisplay.jsx

import React from 'react';

// This is the new, "smarter" version of the component
export default function StarDisplay({ score, thresholds, starsEarned }) {
  let calculatedStars = 0;

  // If score and thresholds are provided, calculate the stars.
  // This is for the LevelCompleteModal and ScoreProgressBar.
  if (score !== undefined && thresholds) {
    if (score >= thresholds.oneStar) calculatedStars = 1;
    if (score >= thresholds.twoStars) calculatedStars = 2;
    if (score >= thresholds.threeStars) calculatedStars = 3;
  } 
  // Otherwise, use the pre-calculated starsEarned prop.
  // This is for your old code, so nothing breaks.
  else if (starsEarned !== undefined) {
    calculatedStars = starsEarned;
  }

  return (
    <div className="star-display">
      {/* Create an array of 3 elements to map over */}
      {[...Array(3)].map((_, index) => {
        const starNumber = index + 1;
        const isActive = starNumber <= calculatedStars;
        
        return (
          <span key={starNumber} className={`star ${isActive ? 'active' : ''}`}>
            ⭐
          </span>
        );
      })}
    </div>
  );
}