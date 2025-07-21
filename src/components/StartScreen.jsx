// src/components/StartScreen.jsx

// This component receives two functions, 'onPlayClick' and 'onVersusClick',
// from its parent component (App.jsx). These are passed as "props".
export default function StartScreen({ onPlayClick, onVersusClick }) {
  
  // The 'return' statement describes the HTML structure of this component.
  return (
    <div id="start-screen" className="screen">
      <div className="start-screen-content">
        <h1 className="game-logo">Trig Proof Racer</h1>
        <div className="menu-buttons">
          
          {/* When the PLAY button is clicked, it calls the onPlayClick function */}
          <button id="play-btn" className="button-primary button-large" onClick={onPlayClick}>
            PLAY
          </button>
          
          {/* When the VERSUS button is clicked, it calls the onVersusClick function */}
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