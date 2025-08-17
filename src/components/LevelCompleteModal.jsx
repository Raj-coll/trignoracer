// src/components/LevelCompleteModal.jsx
import React from 'react';
import StarDisplay from './StarDisplay';
import './LevelCompleteModal.css';
import Mascot from './Mascot';

// ==================================================================
// STEP 1: Import the new Fireworks component
// ==================================================================
import Fireworks from './Fireworks';

export default function LevelCompleteModal({ result, problem, onNext, onRetry, onHome }) {
  const { totalScore, starCount } = result;
  
  // The dynamic progress bar logic remains unchanged and correct.
  const { oneStar, twoStars, threeStars } = problem.scoreThresholds;
  const calculateProgress = () => {
    if (starCount === 3) return 100;
    if (starCount === 2) {
      const range = threeStars - twoStars;
      const progress = totalScore - twoStars;
      return range > 0 ? (progress / range) * 100 : 0;
    }
    if (starCount === 1) {
      const range = twoStars - oneStar;
      const progress = totalScore - oneStar;
      return range > 0 ? (progress / range) * 100 : 0;
    }
    const range = oneStar;
    const progress = totalScore;
    return range > 0 ? (progress / range) * 100 : 0;
  };
  const progressPercent = Math.min(calculateProgress(), 100);

  return (
    <div className="level-complete-overlay open"> 
      {/* ================================================================== */}
      {/* STEP 2: Add the Fireworks component here. */}
      {/* It sits inside the overlay so it appears behind the modal card. */}
      {/* ================================================================== */}
      <Fireworks />

      <div className="level-complete-card">
        {/* The content of the card remains the same */}
        <h2 className="level-title">Level Complete!</h2>
        
        <StarDisplay starCount={starCount} />

        <div className="progress">
          <div 
            className="progress-bar" 
            style={{ transform: `scaleX(${progressPercent / 100})` }}
          ></div>
        </div>

        <div className="score-wrap">
          <div className="score">{totalScore}</div>
          <div className="score-label">Total Score</div>
        </div>

        <div className="actions">
          <button className="btn retry" onClick={onRetry}>Retry</button>
          <button className="btn home" onClick={onHome}>Home</button>
          <button className="btn next" onClick={onNext}>Next</button>
        </div>
      </div>
      
      {/* The Mascot component remains in its correct position */}
      <Mascot emotion="happy" />
    </div>
  );
}