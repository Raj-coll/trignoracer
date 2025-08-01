// src/components/GameplayScreen.jsx
import { useState, useEffect, useMemo } from 'react';
import { problems, getFormulaById } from '../data/gameData';
import { toLatex } from '../utils/mathHelpers';
import { socket } from '../hooks/useSocket';
import ScoreProgressBar from './ScoreProgressBar';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
const BONUS_PER_MOVE = 250; // Define bonus points here for consistency

export default function GameplayScreen({ levelId, mode, roomId, onGameEnd }) {
  const problem = problems[levelId];

  // State variables
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayedExpression, setDisplayedExpression] = useState(problem.steps[0].currentLHS);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(problem.moves.medium);
  const [feedback, setFeedback] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [floatingScores, setFloatingScores] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [scoreMultiplier, setScoreMultiplier] = useState(2);

  const currentStep = problem.steps[currentStepIndex];

  const choices = useMemo(() => {
    if (!currentStep || isFinished) return [];
    const correctFormula = getFormulaById(currentStep.correctFormulaId);
    const distractorFormulas = currentStep.distractorFormulaIds.map(id => getFormulaById(id));
    return shuffleArray([correctFormula, ...distractorFormulas]);
  }, [currentStep, isFinished]);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [displayedExpression, choices]);

  useEffect(() => {
    if (isFinished || mode === 'versus') return;
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        if (newTime > 60) setScoreMultiplier(2);
        else if (newTime > 30) setScoreMultiplier(1);
        else setScoreMultiplier(0.5);
        if (newTime <= 0) {
          clearInterval(timerId);
          onGameEnd({ win: false, score, movesLeft });
          return 0;
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [isFinished, mode, onGameEnd, score, movesLeft]);

  // === NEW: Function to handle the bonus score animation on this screen ===
  const runBonusScoreAnimation = async (baseScore, remainingMoves) => {
    setFeedback('Bonus Points!'); // Show a new feedback message
    let currentBonus = 0;
    
    for (let i = 0; i < remainingMoves; i++) {
      currentBonus += BONUS_PER_MOVE;
      setScore(baseScore + currentBonus); // This update will fill the progress bar
      setMovesLeft(remainingMoves - 1 - i); // This will make the moves counter tick down
      await delay(100); // Adjust the speed of the animation here
    }

    await delay(1000); // Pause for a moment to see the final score and stars
    
    // Now that the animation is done, call onGameEnd with the final results
    onGameEnd({ win: true, baseScore: baseScore, totalScore: baseScore + currentBonus });
  };

  const handleChoice = async (selectedId) => {
    if (isAnswered || isFinished) return;

    setIsAnswered(true);
    const newMovesLeft = movesLeft - 1;
    setMovesLeft(newMovesLeft);

    if (selectedId === currentStep.correctFormulaId) {
      setFeedback('Correct!');
      const basePoints = 500;
      const points = basePoints * scoreMultiplier;
      const newScore = score + points;
      setScore(newScore);
      
      const newScoreAnimation = { id: Date.now(), value: `+${Math.round(points)}` };
      setFloatingScores(prev => [...prev, newScoreAnimation]);
      setTimeout(() => setFloatingScores(prev => prev.filter(s => s.id !== newScoreAnimation.id)), 1500);

      setDisplayedExpression(currentStep.nextLHS);
      await delay(1000);

      const isFinalStep = currentStepIndex >= problem.steps.length - 1;

      if (isFinalStep) {
        setIsFinished(true); // Mark as finished to stop timers and disable buttons
        setFeedback('Proof Complete!');
        await delay(1500); // Wait for the player to read "Proof Complete!"
        
        // === UPDATED: Start the bonus animation instead of ending the game directly ===
        if (mode === 'solo' && newMovesLeft > 0) {
          await runBonusScoreAnimation(newScore, newMovesLeft);
        } else if (mode === 'solo') { // If solo mode but no moves left for bonus
          onGameEnd({ win: true, baseScore: newScore, totalScore: newScore });
        } else { // For versus mode, end immediately
          socket.emit('proof_completed', { room: roomId });
        }

      } else {
        setCurrentStepIndex(prev => prev + 1);
        setFeedback('');
        setIsAnswered(false);
      }
    } else {
      setFeedback('Incorrect.');
      await delay(1500);
      setFeedback('');
      setIsAnswered(false);
      if (newMovesLeft <= 0 && mode === 'solo') {
        onGameEnd({ win: false, score, movesLeft: newMovesLeft });
      }
    }
  };

  return (
    <div id="gameplay-screen" className="screen">
      <div className="floating-score-container">
        {floatingScores.map(s => <div key={s.id} className="floating-score">{s.value}</div>)}
      </div>
      <main className="game-container">
        <div className="game-content">
          <div className="problem-area">
            <div className="problem-statement">
              <h3>Problem:</h3>
              <p id="problem-title">{`\\[${toLatex(problem.title)}\\]`}</p>
            </div>
            <div className="current-expression">
              <h3>Current Expression (LHS):</h3>
              <div id="current-lhs" className="expression-box" aria-live="polite">
                {displayedExpression ? `\\[${toLatex(displayedExpression)}\\]` : ''}
              </div>
              <p id="step-explanation" className="explanation-text">
                {isFinished ? 'Proof Complete!' : `Hint: ${currentStep?.explanation}`}
              </p>
            </div>
          </div>
          <div className="choices-area">
            {mode === 'solo' && problem.scoreThresholds && (
              <ScoreProgressBar score={score} thresholds={problem.scoreThresholds} />
            )}
            <div id="gameplay-header-info">
              <div className="level-objective">Moves: <span>{movesLeft}</span></div>
              <div className="timer-display">Time: <span>{timeLeft}</span></div>
              <div className="score-display">Score: <span>{score}</span></div>
              <button id="pause-btn" className="button-icon">||</button>
            </div>
            <div className="multiplier-display">
              {scoreMultiplier > 0.5 && !isFinished && `${scoreMultiplier}x Score Bonus!`}
            </div>
            <p id="feedback-text" aria-live="polite">{feedback}</p>
            <div id="choices-container">
              {choices.map((formula) => (
                <button
                  key={formula.id}
                  className="button-secondary"
                  onClick={() => handleChoice(formula.id)}
                  disabled={isAnswered || isFinished} // Also disable buttons when finished
                >
                  {`\\(${toLatex(formula.text)}\\)`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}