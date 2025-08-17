// src/components/CoordinateFinder.jsx
// A temporary developer tool to easily find coordinates on the level map.

import React from 'react';
import levelMap from '../assets/images/level-map-landscape.png'; // Import your map

const finderStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 9999,
  cursor: 'crosshair',
};

const imageStyles = {
  width: '100%',
  height: '100%',
  objectFit: 'cover', // This must match your game's CSS (cover, contain, etc.)
};

export default function CoordinateFinder() {
  const handleClick = (e) => {
    // Get the bounding box of the image we clicked on
    const rect = e.target.getBoundingClientRect();

    // Calculate the click position relative to the image's top-left corner
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert the pixel coordinates to percentages
    const xPercent = ((x / rect.width) * 100).toFixed(2);
    const yPercent = ((y / rect.height) * 100).toFixed(2);

    // Log the result to the console in a copy-paste-friendly format
    console.log(`pos: { x: ${xPercent}, y: ${yPercent} }`);
  };

  return (
    <div style={finderStyles}>
      <img
        src={levelMap}
        alt="Coordinate Finder"
        style={imageStyles}
        onClick={handleClick}
      />
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', backgroundColor: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '5px', fontSize: '1.2rem' }}>
        Click anywhere on the map to get its coordinates in the developer console.
      </div>
    </div>
  );
}