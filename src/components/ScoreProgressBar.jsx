// src/components/ScoreProgressBar.jsx

export default function ScoreProgressBar({ score, thresholds }) {
  const { oneStar, twoStars, threeStars } = thresholds;
  const fillPercentage = Math.min((score / threeStars) * 100, 100);

  return (
    <div className="score-progress-bar-container">
      <div className="score-progress-bar-fill" style={{ width: `${fillPercentage}%` }}></div>
      <span className={`score-progress-bar-star ${score >= oneStar ? 'active' : ''}`} style={{ left: `${(oneStar / threeStars) * 100}%` }}>★</span>
      <span className={`score-progress-bar-star ${score >= twoStars ? 'active' : ''}`} style={{ left: `${(twoStars / threeStars) * 100}%` }}>★</span>
      <span className={`score-progress-bar-star ${score >= threeStars ? 'active' : ''}`} style={{ left: '95%' }}>★</span>
    </div>
  );
}