// src/components/ScoreProgressBar.jsx

import React, { useEffect, useRef, useMemo } from 'react';
import './ScoreProgressBar.css';
import waterFillSound from '../assets/sounds/water-fill-single.mp3';
import starAchievedSound from '../assets/sounds/star-achieved.mp3';

// The helper function for formatting labels remains the same.
const formatScoreLabel = (num) => {
  if (num >= 10000) return `${Math.round(num / 1000)}k`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace('.0', '')}k`;
  return num;
};

// Create the audio objects ONCE, outside the component for reliability.
const fillAudio = new Audio(waterFillSound);
fillAudio.volume = 0.7;

const starAudio = new Audio(starAchievedSound);
starAudio.volume = 0.8;


export default function ScoreProgressBar({ score, thresholds }) {
  const { oneStar, twoStars, threeStars } = thresholds;
  const maxScore = threeStars;

  const prevScoreRef = useRef(score);

  // MODIFIED: The 'stars' array now uses fixed, equidistant positions for a clean visual layout.
  // The score thresholds are still used for the activation logic, but not for positioning.
  // This provides the best of both worlds: a consistent UI and data-driven game logic.
  const stars = useMemo(() => {
    return [
      { threshold: oneStar,    position: 25 }, // 1st star at 25%
      { threshold: twoStars,   position: 50 }, // 2nd star at 50% (center)
      { threshold: threeStars, position: 75 }, // 3rd star at 75%
    ];
    // The dependencies ensure this array is updated if the level's thresholds change.
  }, [oneStar, twoStars, threeStars]);


  // The useEffect hook for sound remains unchanged and works perfectly.
  useEffect(() => {
    const prevScore = prevScoreRef.current;

    if (score > prevScore) {
      fillAudio.currentTime = 0;
      fillAudio.play().catch(error => console.error("Fill audio play failed:", error));
    }

    stars.forEach(star => {
      if (prevScore < star.threshold && score >= star.threshold) {
        starAudio.currentTime = 0;
        starAudio.play().catch(error => console.error("Star audio play failed:", error));
      }
    });
    
    prevScoreRef.current = score;
  }, [score, stars]);


  // The rest of the component's visual logic remains the same.
  const fillPercentage = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;

  const marks = [];
  if (maxScore > 0) {
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxScore)) - 1);
    let interval = Math.ceil(maxScore / 5 / magnitude) * magnitude;
    if (interval === 0) interval = magnitude > 0 ? magnitude : 1000;
    for (let markValue = interval; markValue < maxScore * 0.95; markValue += interval) {
      marks.push(markValue);
    }
  }

  return (
    <div className="new-progress-container" role="progressbar">
      <div className="new-progress-fill" style={{ width: `${fillPercentage}%` }}></div>
      <div className="new-progress-marks-container">
        {marks.map((markValue) => {
          const position = (markValue / maxScore) * 100;
          return (
            <div key={markValue} className="new-progress-mark" style={{ left: `${position}%` }}>
              <div className="new-progress-mark-line"></div>
              <span className="new-progress-mark-label">{formatScoreLabel(markValue)}</span>
            </div>
          );
        })}
      </div>
      <div className="new-progress-stars-container">
        {stars.map((star, index) => {
          const isActive = score >= star.threshold;
          return (
            <div
              key={index}
              className={`new-progress-star ${isActive ? 'active' : ''}`}
              style={{ left: `${star.position}%` }}
            >
              ⭐
            </div>
          );
        })}
      </div>
    </div>
  );
}