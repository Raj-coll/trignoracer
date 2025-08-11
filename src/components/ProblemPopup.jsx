// src/components/ProblemPopup.jsx
import React from 'react';
import './ProblemPopup.css';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const ProblemPopup = ({ problemData, onClose, isVisible }) => {
  // If there's no data or it's not visible, render nothing.
  if (!problemData) {
    return null;
  }

  return (
    <MathJaxContext>
      <div 
        className={`popup-overlay ${isVisible ? 'visible' : ''}`} 
        onClick={onClose} // Close when clicking the dark background
      >
        <div 
          className="popup-content" 
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the popup
        >
          <h2>{problemData.title.replace('Prove: ', '')}</h2>
          
          <div className="popup-steps-container">
            <ul>
              {problemData.steps.map((step, index) => (
                <li key={index}>
                  <span className="step-number">Step {index + 1}:</span>
                  <div className="step-expression">
                    <MathJax inline>{`\\(${step.currentLHS}\\)`}</MathJax>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
};

export default ProblemPopup;