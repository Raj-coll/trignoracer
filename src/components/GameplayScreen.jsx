// src/components/GameplayScreen.jsx
import { useState, useEffect, useMemo } from 'react';
import { problems, getFormulaById } from '../data/gameData';
import { toLatex } from '../utils/mathHelpers';
import { socket } from '../hooks/useSocket';
// === NEW: Import the ScoreProgressBar component ===
import ScoreProgressBar from './ScoreProgressBar';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function GameplayScreen({ levelId, mode, roomId, onGameEnd }) {
  const problem = problems[levelId];

  // All your existing state variables are correct.
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(problem.moves.medium);
  const [feedback, setFeedback] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  // === NEW: Add state to manage the floating score animations ===
  const [floatingScores, setFloatingScores] = useState([]);

  const currentStep = problem.steps[currentStepIndex];

  // This logic is unchanged.
  const expressionToShow = isFinished
    ? problem.steps[problem.steps.length - 1].nextLHS
    : currentStep?.currentLHS;

  // This logic is unchanged.
  const choices = useMemo(() => {
    if (!currentStep || isFinished) return [];
    const correctFormula = getFormulaById(currentStep.correctFormulaId);
    const distractorFormulas = currentStep.distractorFormulaIds.map(id => getFormulaById(id));
    return shuffleArray([correctFormula, ...distractorFormulas]);
  }, [currentStep, isFinished]);

  // This effect is unchanged.
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [expressionToShow, choices]);

  // The game logic is updated to add the floating score.
  const handleChoice = (selectedId) => {
    if (isAnswered || isFinished) return;

    setIsAnswered(true);
    setMovesLeft(prev => prev - 1);

    if (selectedId === currentStep.correctFormulaId) {
      setFeedback('Correct!');
      const points = 1000;
      setScore(prev => prev + points);
      
      // === NEW: Logic to create and clean up a floating score animation ===
      const newScoreAnimation = { id: Date.now(), value: `+${points}` };
      setFloatingScores(prev => [...prev, newScoreAnimation]);
      // Remove the score from the array after its animation finishes (1.5s)
      setTimeout(() => {
        setFloatingScores(prev => prev.filter(s => s.id !== newScoreAnimation.id));
      }, 1500);
      
      // The rest of the game logic is unchanged.
      if (currentStepIndex < problem.steps.length - 1) {
        setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1);
          setFeedback('');
          setIsAnswered(false);
        }, 1000);
      } else {
        setTimeout(() => {
          setIsFinished(true);
          setFeedback('Proof Complete!');
          if (mode === 'versus') {
            socket.emit('proof_completed', { room: roomId });
          } else {
            if (onGameEnd) {
              onGameEnd({ win: true, score: score + 1000, movesLeft });
            }
          }
        }, 1000);
      }
    } else {
      setFeedback('Incorrect.');
      setTimeout(() => {
        setFeedback('');
        setIsAnswered(false);
      }, 1500);
      if (movesLeft - 1 <= 0 && mode === 'solo') {
        if (onGameEnd) {
          setTimeout(() => onGameEnd({ win: false }), 1500);
        }
      }
    }
  };

  // The JSX is updated to include the new UI elements.
  return (
    <div id="gameplay-screen" className="screen">
      {/* === NEW: Container to render the floating scores === */}
      <div className="floating-score-container">
        {floatingScores.map(s => <div key={s.id} className="floating-score">{s.value}</div>)}
      </div>

      <main className="game-container">
        <div className="game-content">
          <div className="problem-area">
            {/* This section is unchanged */}
            <div className="problem-statement">
              <h3>Problem:</h3>
              <p id="problem-title">{`\\[${toLatex(problem.title)}\\]`}</p>
            </div>
            <div className="current-expression">
              <h3>Current Expression (LHS):</h3>
              <div id="current-lhs" className="expression-box" aria-live="polite">
                {expressionToShow ? `\\[${toLatex(expressionToShow)}\\]` : ''}
              </div>
              <p id="step-explanation" className="explanation-text">
                {isFinished ? 'Proof Complete!' : `Hint: ${currentStep?.explanation}`}
              </p>
            </div>
          </div>
          <div className="choices-area">
            {/* === NEW: Add the ScoreProgressBar component at the top === */}
            {/* It only shows in solo mode and if the level has thresholds defined */}
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