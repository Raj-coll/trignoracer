// src/components/Fireworks.jsx
import React, { useState, useEffect } from 'react';
import './Fireworks.css';

// Sound files needed for this component
import fireworkLaunchSound from '../assets/sounds/firework-launch.mp3';
import fireworkBurstSound from '../assets/sounds/firework-burst.mp3';
// REMOVED: The fanfare sound is no longer imported.
// import victorySound from '../assets/sounds/level-complete-fanfare.mp3'; 
import youWinVoice from '../assets/sounds/you-win-voice.mp3';


export default function Fireworks() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  // This effect handles ALL sound logic
  useEffect(() => {
    // Play the "You Win" voice when the component appears.
    const voiceAudio = new Audio(youWinVoice);
    voiceAudio.volume = 1.0;
    voiceAudio.play();

    // REMOVED: The logic to play the fanfare sound has been deleted.
    // const fanfareAudio = new Audio(victorySound);
    // fanfareAudio.volume = 0.7;
    // fanfareAudio.play();

    const fireworkTimings = [0, 1200, 2500, 3800, 5000];

    // Play the firework launch and burst sounds in a single sequence.
    fireworkTimings.forEach(delay => {
      // Play the launch sound at its scheduled time
      setTimeout(() => {
        const launchAudio = new Audio(fireworkLaunchSound);
        launchAudio.volume = 0.3;
        launchAudio.play();
      }, delay);

      // Play the burst sound slightly after the launch
      setTimeout(() => {
        const burstAudio = new Audio(fireworkBurstSound);
        burstAudio.volume = 0.5;
        burstAudio.play();
      }, delay + 400); // 400ms after the "launch"
    });

    // The empty array [] ensures this effect runs only once.
  }, []);


  // The JSX structure remains unchanged
  const particleWrappers = Array.from({ length: 12 }).map((_, i) => (
    <div key={i} className="particle-wrapper"></div>
  ));

  return (
    <div className={`fireworks-container ${isAnimating ? 'animate' : ''}`}>
      <div className="firework">{particleWrappers}</div>
      <div className="firework">{particleWrappers}</div>
      <div className="firework">{particleWrappers}</div>
      <div className="firework">{particleWrappers}</div>
      <div className="firework">{particleWrappers}</div>
    </div>
  );
}