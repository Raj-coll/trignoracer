// src/components/LevelFailedModal.jsx

import React, { useEffect } from 'react';
import './LevelFailedModal.css';
import Mascot from './Mascot';
import timesUpSound from '../assets/sounds/times-up-music.mp3';
import outOfMovesSound from '../assets/sounds/out-of-moves-music.mp3';

// ==================================================================
// STEP 1: Create the audio objects ONCE, outside the component.
// This makes them persistent and avoids browser autoplay issues on retry.
// ==================================================================
const timesUpAudio = new Audio(timesUpSound);
timesUpAudio.volume = 0.6;

const outOfMovesAudio = new Audio(outOfMovesSound);
outOfMovesAudio.volume = 0.6;


export default function LevelFailedModal({ reason, onRetry, onHome }) {
  const title = reason === 'time' ? "Time's Up!" : "Out of Moves!";
  const message = reason === 'time' 
    ? "The clock ran out. Try to be a bit quicker next time!"
    : "You've used all your moves. Think carefully about each step!";

  useEffect(() => {
    // ==================================================================
    // STEP 2: Select and play the PRE-EXISTING audio object.
    // ==================================================================
    let currentAudio;

    if (reason === 'time') {
      currentAudio = timesUpAudio;
    } else if (reason === 'moves') {
      currentAudio = outOfMovesAudio;
    }

    if (currentAudio) {
      // Always rewind the sound to the beginning before playing
      currentAudio.currentTime = 0;
      // The .catch() is good practice to prevent crashes if the browser still blocks audio
      currentAudio.play().catch(error => console.error("Audio play failed:", error));
    }

    // ==================================================================
    // STEP 3: The cleanup function now pauses BOTH sounds.
    // This is the most robust way to ensure no sound leaks when the modal closes.
    // ==================================================================
    return () => {
      timesUpAudio.pause();
      outOfMovesAudio.pause();
    };
  }, [reason]); // Effect still runs when the modal appears or reason changes

  // The JSX remains exactly the same
  return (
    <div className="level-failed-overlay open"> 
      <div className="level-failed-card">
        <div className="failed-icon">!</div>
        <h2 className="level-title">{title}</h2>
        <p className="failed-message">{message}</p>

        <div className="actions">
          <button className="btn retry" onClick={onRetry}>Retry</button>
          <button className="btn home" onClick={onHome}>Home</button>
        </div>
      </div>
      
      <Mascot emotion="sad" />
    </div>
  );
}