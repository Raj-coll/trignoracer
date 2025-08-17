// src/components/LevelSelectionScreen.jsx - FINAL VERSION

import React, { useState } from 'react';
import { initialLevels } from '../data/levelData';
import PlayerResources from './PlayerResources';
import './LevelSelectionScreen.css';

const renderStars = (starCount) => {
  return '★'.repeat(starCount) + '☆'.repeat(3 - starCount);
};

export default function LevelSelectionScreen({ onLevelSelect, onBackClick }) {
  const [levels, setLevels] = useState(initialLevels);

  return (
    <div id="level-selection-screen">
      {/* The <div className="map-viewport"> has been removed for a cleaner structure */}
      <div className="level-map">

        <div className="map-ui-overlay">
          <PlayerResources />
          <h1 className="screen-title-on-map">Select Level</h1>
          <button className="button-icon map-back-button" onClick={onBackClick}></button>
        </div>

        {/* The level markers logic is unchanged */}
        {levels.map((level) => (
          <div
            key={level.id}
            className={`level-marker ${level.status}`}
            style={{
              top: `${level.pos.y}%`,
              left: `${level.pos.x}%`,
            }}
            onClick={() => level.status !== 'locked' && onLevelSelect(level.id)}
          >
            {level.status === 'locked' && <span>🔒</span>}
            {level.status !== 'locked' && <span>{level.id}</span>}
            {level.status === 'completed' && (
              <div className="stars">{renderStars(level.stars)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}