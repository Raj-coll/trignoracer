// src/components/LevelSelectionScreen.jsx
    
export default function LevelSelectionScreen({ onLevelSelect }) {
  return (
    <div id="level-selection-screen" className="screen">
      <div className="level-map">
        {/* Level 1 (completed) - Unchanged */}
        <div className="level-marker completed" onClick={() => onLevelSelect(1)}>
          <span>1</span><div className="stars">★★★</div>
        </div>

        {/* Level 2 (completed) - Unchanged */}
        <div className="level-marker completed" onClick={() => onLevelSelect(2)}>
          <span>2</span><div className="stars">★☆☆</div>
        </div>

        {/* Level 3 (unlocked) - This is your new, working level */}
        <div className="level-marker unlocked" onClick={() => onLevelSelect(3)}>
          <span>3</span>
        </div>

        {/* Level 4 (locked) - Unchanged */}
        <div className="level-marker locked">
          <span>🔒</span>
        </div>

        {/* === CHANGE: Restored Level 5 to match the original design === */}
        <div className="level-marker locked">
          <span>🔒</span>
        </div>
      </div>
    </div>
  );
}