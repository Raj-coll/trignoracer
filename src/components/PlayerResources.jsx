// src/components/PlayerResources.jsx
import React from 'react';

// This is a dedicated, reusable component for the gems and hearts.
export default function PlayerResources() {
  return (
    <div className="player-resources">
      <span id="player-gems">💎 120</span>
      <div className="lives-container"> 
        <div id="player-lives">
          <span className="life-heart active">❤️</span>
          <span className="life-heart active">❤️</span>
          <span className="life-heart active">❤️</span>
          <span className="life-heart active">❤️</span>
          <span className="life-heart active">❤️</span>
        </div>
      </div>
    </div>
  );
}