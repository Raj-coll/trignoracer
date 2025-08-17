// src/components/StarDisplay.jsx
import React from 'react';

/**
 * A simple display component that renders three stars and triggers
 * a CSS animation based on the number of stars earned.
 */
export default function StarDisplay({ starCount }) {
  // Creates a class name like "stars stars-3" to trigger CSS animations.
  const containerClasses = `stars stars-${starCount || 0}`;

  return (
    <div className={containerClasses}>
      {/* These empty divs are styled into stars by the CSS */}
      <div className="star"></div>
      <div className="star"></div>
      <div className="star"></div>
    </div>
  );
}