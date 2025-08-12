// src/components/StepsModal.jsx

import React, { useEffect } from 'react';
// 1. Import our custom hook for persistent state
import usePersistentState from '../hooks/usePersistentState';
import { toLatex } from '../utils/mathHelpers';
import './StepsModal.css';

// 2. Define constants for font size control
const INITIAL_FONT_SIZE = 1.0; // Let's make the default a bit smaller for this view
const FONT_STEP = 0.15;
const MIN_FONT_SIZE = 0.7;
const MAX_FONT_SIZE = 2.0;

const StepsModal = ({ steps, currentStepIndex, onClose }) => {
  // 3. Use the persistent state hook with a NEW, UNIQUE key
  const [fontSize, setFontSize] = usePersistentState('stepsModalFontSize', INITIAL_FONT_SIZE);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [steps, currentStepIndex]);
  
  // 4. Add handler functions to change the font size
  const handleDecreaseSize = () => {
    setFontSize((prevSize) => Math.max(MIN_FONT_SIZE, prevSize - FONT_STEP));
  };

  const handleIncreaseSize = () => {
    setFontSize((prevSize) => Math.min(MAX_FONT_SIZE, prevSize + FONT_STEP));
  };

  const completedSteps = steps.slice(0, currentStepIndex + 1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="steps-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2>Your Progress</h2>

        {/* 5. Add the font control buttons UI */}
        <div className="font-controls">
          <button
            onClick={handleDecreaseSize}
            disabled={fontSize <= MIN_FONT_SIZE}
            aria-label="Decrease font size"
          >
            A-
          </button>
          <span className="font-size-indicator">
            {Math.round((fontSize / INITIAL_FONT_SIZE) * 100)}%
          </span>
          <button
            onClick={handleIncreaseSize}
            disabled={fontSize >= MAX_FONT_SIZE}
            aria-label="Increase font size"
          >
            A+
          </button>
        </div>

        <div 
          className="steps-container"
          // 6. Apply the dynamic font size to the main container
          style={{ fontSize: `${fontSize}rem` }}
        >
          {completedSteps && completedSteps.length > 0 ? (
            <ol className="steps-list">
              <li>
                <p className="step-math">{`\\[${toLatex(steps[0].currentLHS)}\\]`}</p>
                <p className="step-explanation-text">Starting Expression</p>
              </li>
              {completedSteps.slice(0, currentStepIndex).map((step, index) => (
                <li key={index}>
                  <p className="step-math">{`\\[${toLatex(step.nextLHS)}\\]`}</p>
                  <p className="step-explanation-text">
                    Applied: {step.explanation}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p>You haven't completed any steps yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepsModal;