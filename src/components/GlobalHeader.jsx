// src/components/GlobalHeader.jsx

// The component now only needs the 'title' prop.
export default function GlobalHeader({ title }) {
  return (
    <header id="global-header" className="game-header">
      
      {/* The header now ONLY contains the title. */}
      <div id="header-title" className="header-title">{title}</div>
      
      {/* The player resources div has been completely removed from this component. */}

    </header>
  );
}