// src/components/WaitingScreen.jsx

// We receive an onCancel function to let the user go back to the start screen.
export default function WaitingScreen({ onCancel }) {
  return (
    <div id="waiting-screen" className="screen">
      <div className="modal-content">
        <h2>Finding Opponent...</h2>
        <div className="spinner">
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>
        <p>Please wait while we find another player.</p>
        <button id="cancel-matchmaking-btn" className="button-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}