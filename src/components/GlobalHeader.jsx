// src/components/GlobalHeader.jsx

// === CHANGE 1: Receive the 'onBackClick' function as a prop ===
// We list the props we expect to receive inside the curly braces {}.
export default function GlobalHeader({ onBackClick }) {
  return (
    <header id="global-header" className="game-header">
      {/* === CHANGE 2: Attach the function to the button's onClick event === */}
      {/* Now, when this button is clicked, it will call the handleGoBack function from App.jsx. */}
      <button id="global-back-btn" className="button-icon" onClick={onBackClick}>
        ◄
      </button>
      
      {/* The rest of your component is unchanged. */}
      <div id="header-title" className="header-title">Level Select</div>
      <div className="player-resources">
        <span id="player-gems">💎 120</span>
        <div className="lives-container"> 
          <div id="player-lives">
            {/* We'll make these hearts dynamic later */}
            <span className="life-heart active">❤️</span>
            <span className="life-heart active">❤️</span>
            <span className="life-heart active">❤️</span>
            <span className="life-heart active">❤️</span>
            <span className="life-heart active">❤️</span>
          </div>
        </div>
      </div>
    </header>
  );
}