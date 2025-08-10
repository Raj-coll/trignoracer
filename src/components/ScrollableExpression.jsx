// src/components/ScrollableExpression.jsx

import React, { useEffect } from 'react';
import { toLatex } from '../utils/mathHelpers';

const ScrollableExpression = ({ expression }) => {
  // Ensure MathJax re-renders when the expression changes
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [expression]);

  return (
    // This is the outer, styled box. It does NOT scroll.
    <div className="expression-container">
      {/* This is the inner box. ITS ONLY JOB IS TO SCROLL. */}
      <div className="scroller">
        {expression ? `\\[${toLatex(expression)}\\]` : ''}
      </div>
    </div>
  );
};

export default ScrollableExpression;