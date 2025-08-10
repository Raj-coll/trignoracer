// src/components/LevelCompleteModal.jsx
import React from 'react';
import StarDisplay from './StarDisplay';

export default function LevelCompleteModal({ result, onMainMenu }) {
  
  // Get 'thresholds' directly from the 'result' object.
  const { baseScore, totalScore, thresholds } = result;
  
  const bonusScore = totalScore - baseScore;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Level Complete!</h2>
        
        {/* Pass the correct, "locked-in" thresholds to StarDisplay */}
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