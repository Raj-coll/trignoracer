// src/components/LevelCompleteModal.jsx

import React from 'react';
// We import StarDisplay, which contains the correct logic for calculating stars.
import StarDisplay from './StarDisplay';

export default function LevelCompleteModal({ result, onMainMenu }) {
  
  // Get the final score and the correct thresholds from the result object.
  const { baseScore, totalScore, thresholds } = result;
  
  const bonusScore = totalScore - baseScore;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Level Complete!</h2>
        
        {/*
          THIS IS THE KEY:
          We pass the final totalScore and the correct thresholds to StarDisplay.
          StarDisplay will then perform the exact same calculation as the progress bar:
          - if (totalScore >= thresholds.oneStar) -> 1 star
          - if (totalScore >= thresholds.twoStars) -> 2 stars
          - if (totalScore >= thresholds.threeStars) -> 3 stars
          This guarantees they will always match.
        */}
        <StarDisplay score={totalScore} thresholds={thresholds} />
        
        <div className="score-breakdown">
          <p>Base Score: <span>{baseScore}</span></p>
          <p>Moves Bonus: <span>+ {bonusScore}</span></p>
          <hr />
          <p className="total-score">Total: <span>{totalScore}</span></p>
        </div>

        <button className="button-primary" onClick={onMainMenu}>
          Main Menu
        </button>
      </div>
    </div>
  );
}