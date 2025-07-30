// src/components/GameplayScreen.jsx
import { useState, useEffect, useMemo } from 'react';
import { problems, getFormulaById } from '../data/gameData';
import { toLatex } from '../utils/mathHelpers';
import { socket } from '../hooks/useSocket';
import ScoreProgressBar from './ScoreProgressBar';

// Helper function to create a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to shuffle arrays
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function GameplayScreen({ levelId, mode, roomId, onGameEnd }) {
  const problem = problems[levelId];

  // State variables
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // === KEY CHANGE: State for the expression the user sees ===
  const [displayedExpression, setDisplayedExpression] = useState(problem.steps[0].currentLHS);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(problem.moves.medium);
  const [feedback, setFeedback] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [floatingScores, setFloatingScores] = useState([]);

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

  // This is the new, corrected async game logic function
  const handleChoice = async (selectedId) => {
    if (isAnswered || isFinished) return;

    setIsAnswered(true);
    setMovesLeft(prev => prev - 1);

    if (selectedId === currentStep.correctFormulaId) {
      setFeedback('Correct!');
      const points = 1000;
      const newScore = score + points;
      setScore(newScore);
      
      const newScoreAnimation = { id: Date.now(), value: `+${points}` };
      setFloatingScores(prev => [...prev, newScoreAnimation]);
      setTimeout(() => {
        setFloatingScores(prev => prev.filter(s => s.id !== newScoreAnimation.id));
      }, 1500);

      // === KEY CHANGE: Update the displayed expression immediately to show the result of the move ===
      setDisplayedExpression(currentStep.nextLHS);

      // Wait 1 second for the player to read "Correct!"
      await delay(1000);

      const isFinalStep = currentStepIndex >= problem.steps.length - 1;

      if (isFinalStep) {
        // We've already shown the final answer, so we just wait for the player to see it
        await delay(1500);

        // Then, end the level
        setIsFinished(true);
        setFeedback('Proof Complete!');
        if (mode === 'versus') {
          socket.emit('proof_completed', { room: roomId });
        } else if (onGameEnd) {
          onGameEnd({ win: true, score: newScore, movesLeft });
        }
      } else {
        // If it's not the final step, advance the step index to load the next set of choices
        setCurrentStepIndex(prev => prev + 1);
        setFeedback('');
        setIsAnswered(false);
      }
    } else {
      setFeedback('Incorrect.');
      await delay(1500);
      setFeedback('');
      setIsAnswered(false);
      if (movesLeft - 1 <= 0 && mode === 'solo') {
        onGameEnd({ win: false });
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
                {/* === KEY CHANGE: This now uses the new state variable === */}
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
              <div className="score-display">Score: <span>{score}</span></div>
              <button id="pause-btn" className="button-icon">||</button>
            </div>
            <p id="feedback-text" aria-live="polite">{feedback}</p>
            <div id="choices-container">
              {choices.map((formula) => (
                <button
                  key={formula.id}
                  className="button-secondary"
                  onClick={() => handleChoice(formula.id)}
                  disabled={isAnswered}
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