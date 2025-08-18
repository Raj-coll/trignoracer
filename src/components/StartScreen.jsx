// src/components/StartScreen.jsx

import './StartScreen.css';
import FullscreenButton from './FullscreenButton';

export default function StartScreen({ onPlayClick, onVersusClick }) {
  
  return (
    <div id="start-screen" className="screen">
      <FullscreenButton /> 

      <div className="start-screen-content">
        <h1 className="game-logo">Trig Proof Racer</h1>
        <div className="menu-buttons">
          <button id="play-btn" className="button-primary button-large" onClick={onPlayClick}>
            PLAY
          </button>
          <button id="versus-btn" className="button-secondary" onClick={onVersusClick}>
            VERSUS
          </button>
        </div>
        <div className="start-screen-footer">
          <button id="settings-btn" className="button-icon">⚙️</button>
          <button id="profile-btn" className="button-icon">👤</button>
        </div>
      </div>
    </div>
  );
}