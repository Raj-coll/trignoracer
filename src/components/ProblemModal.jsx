// src/components/ProblemModal.jsx

import React, { useEffect } from 'react';
// Import our new custom hook
import usePersistentState from '../hooks/usePersistentState';
import { toLatex } from '../utils/mathHelpers';
import './ProblemModal.css';

// Define constants for font size control for easy adjustments
const INITIAL_FONT_SIZE = 1.2; // in rem units
const FONT_STEP = 0.2;
const MIN_FONT_SIZE = 0.8;
const MAX_FONT_SIZE = 2.4;

const ProblemModal = ({ problemTitle, onClose }) => {
  // ---- THE ONLY LOGIC CHANGE IS THIS ONE LINE ----
  // Replace useState with our custom hook.
  // It will now automatically read from and save to localStorage under the key 'problemFontSize'.
  const [fontSize, setFontSize] = usePersistentState('problemFontSize', INITIAL_FONT_SIZE);
  // ------------------------------------------------

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [problemTitle]);

  const handleDecreaseSize = () => {
    setFontSize((prevSize) => Math.max(MIN_FONT_SIZE, prevSize - FONT_STEP));
  };

  const handleIncreaseSize = () => {
    setFontSize((prevSize) => Math.min(MAX_FONT_SIZE, prevSize + FONT_STEP));
  };

  const processedTitle = toLatex(problemTitle, { forModal: true });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2>Full Problem</h2>

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

        <p
          className="modal-problem-text"
          style={{ fontSize: `${fontSize}rem` }}
        >
          {`\\[${processedTitle}\\]`}
        </p>
      </div>
    </div>
  );
};

export default ProblemModal;