// src/components/Mascot.jsx
import React from 'react';

// Import all the different emotion images
import mascotHappy from '../assets/images/mascot-happy.png';
import mascotSad from '../assets/images/mascot-sad.png';
// import mascotIdle from '../assets/images/mascot-idle.png'; // Uncomment if you have an idle version

import './Mascot.css'; // We will create this CSS file next

// This component will take an 'emotion' prop ('happy', 'sad', 'idle', or null)
export default function Mascot({ emotion }) {
  // If there's no emotion, don't render anything
  if (!emotion) {
    return null;
  }

  let mascotImageSrc;
  
  // Choose the correct image based on the emotion prop
  switch (emotion) {
    case 'happy':
      mascotImageSrc = mascotHappy;
      break;
    case 'sad':
      mascotImageSrc = mascotSad;
      break;
    // case 'idle':
    //   mascotImageSrc = mascotIdle;
    //   break;
    default:
      return null; // Don't show anything for other cases
  }

  // The 'emotion' is also used as a class to trigger the animation
  const containerClasses = `mascot-container ${emotion}`;

  return (
    <div className={containerClasses}>
      <img src={mascotImageSrc} alt={`Mascot feeling ${emotion}`} className="mascot-image" />
    </div>
  );
}