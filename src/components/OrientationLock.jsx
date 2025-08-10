import React from 'react';
import './OrientationLock.css';

// A simple SVG icon for rotation.
const RotateIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 2v6h6M21.5 22v-6h-6" />
    <path d="M22 11.5A10 10 0 0 0 3.5 12.5" />
    <path d="M2 12.5a10 10 0 0 0 18.5-1" />
  </svg>
);

export default function OrientationLock() {
  return (
    <div className="orientation-lock-overlay">
      <div className="orientation-lock-message">
        <RotateIcon />
        <h1>Please Rotate Your Device</h1>
        <p>This game is best played in landscape mode.</p>
      </div>
    </div>
  );
}