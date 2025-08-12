// src/components/FullscreenButton.jsx

import React, { useState, useEffect } from 'react';
// 1. Import the new CSS file
import './FullscreenButton.css';

const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // 2. Build the className string dynamically
  // It always has "fullscreen-button".
  // If `isFullscreen` is true, it ALSO gets "fullscreen-active".
  const buttonClass = `fullscreen-button ${isFullscreen ? 'fullscreen-active' : ''}`;

  return (
    // 3. Use the dynamic className. Aria-label improves accessibility.
    <button 
      onClick={toggleFullscreen} 
      className={buttonClass}
      aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
    />
  );
};

export default FullscreenButton;