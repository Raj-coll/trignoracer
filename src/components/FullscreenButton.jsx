// src/components/FullscreenButton.jsx - UPDATED

import React, { useState, useEffect } from 'react';

const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // This function checks the current fullscreen state
  const onFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  // Add an event listener to update the state when it changes
  useEffect(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      }
    }
  };

  return (
    <button 
      onClick={toggleFullscreen} 
      style={{
        position: 'fixed', // Use 'fixed' to stay in the viewport
        top: '10px', 
        right: '10px', 
        zIndex: 2000,     // High z-index to be on top of everything
        padding: '8px 12px',
        fontSize: '14px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        border: '1px solid white',
        borderRadius: '8px',
        cursor: 'pointer'
      }}
    >
      {/* Change text based on current state */}
      {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
    </button>
  );
};

export default FullscreenButton;