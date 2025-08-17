// src/components/GameplayScreen.jsx 

import { useState, useEffect, useMemo, useCallback } from 'react';
import { problems, getFormulaById } from '../data/gameData';
import { toLatex } from '../utils/mathHelpers';
import { socket } from '../hooks/useSocket';
import ScoreProgressBar from './ScoreProgressBar';
import PlayerResources from './PlayerResources';
import OrientationLock from './OrientationLock';
import ProblemModal from './ProblemModal';
import StepsModal from './StepsModal';
import usePersistentState from '../hooks/usePersistentState';
import LevelCompleteModal from './LevelCompleteModal';
import LevelFailedModal from './LevelFailedModal';

// STEP 1: Add the import for the sound file at the top.
import victorySound from '../assets/sounds/level-complete-fanfare.mp3';


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
const BONUS_PER_MOVE = 250;

const EXPRESSION_INITIAL_FONT_SIZE = 1.0;
const EXPRESSION_FONT_STEP = 0.1;
const EXPRESSION_MIN_FONT_SIZE = 0.7;
const EXPRESSION_MAX_FONT_SIZE = 1.5;


export default function GameplayScreen({ levelId, mode, roomId, onGameEnd, onBack }) {
  const problem = problems[levelId];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStepsModalOpen, setIsStepsModalOpen] = useState(false);
  
  const [expressionFontSize, setExpressionFontSize] = usePersistentState(
    'expressionFontSize', 
    EXPRESSION_INITIAL_FONT_SIZE
  );
  
  const [isPaused, setIsPaused] = useState(false);
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

  const [showLevelCompleteModal, setShowLevelCompleteModal] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  
  const [showLevelFailedModal, setShowLevelFailedModal] = useState({ show: false, reason: null });


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
    if (isFinished || mode === 'versus' || isPaused) {
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        if (newTime > 60) setScoreMultiplier(2);
        else if (newTime > 30) setScoreMultiplier(1);
        else setScoreMultiplier(0.5);
        if (newTime <= 0) {
          clearInterval(timerId);
          setIsFinished(true);
          setShowLevelFailedModal({ show: true, reason: 'time' });
          return 0;
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [isFinished, mode, isPaused]);

  const calculateStars = useCallback((finalScore, thresholds) => {
    if (!thresholds) return 0;
    if (finalScore >= thresholds.threeStars) return 3;
    if (finalScore >= thresholds.twoStars) return 2;
    if (finalScore >= thresholds.oneStar) return 1;
    return 0;
  }, []);


  const runBonusScoreAnimation = async (baseScore, remainingMoves) => {
    setFeedback('Bonus Points!');
    let currentBonus = 0;
    for (let i = 0; i < remainingMoves; i++) {
      currentBonus += BONUS_PER_MOVE;
      setScore(baseScore + currentBonus);
      setMovesLeft(remainingMoves - 1 - i);
      await delay(100);
    }
    await delay(1000);
    
    const totalScore = baseScore + currentBonus;
    const starCount = calculateStars(totalScore, problem.scoreThresholds);
    setFinalResult({ totalScore, starCount });
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
        // STEP 2: Play the sound immediately when the final step is completed.
        const fanfareAudio = new Audio(victorySound);
        fanfareAudio.volume = 0.7;
        fanfareAudio.play();
        
        setIsFinished(true);
        setFeedback('Proof Complete!');
        await delay(1500);

        if (mode === 'solo' && newMovesLeft > 0) {
          await runBonusScoreAnimation(newScore, newMovesLeft);
        } else if (mode === 'solo') {
          const starCount = calculateStars(newScore, problem.scoreThresholds);
          setFinalResult({ totalScore: newScore, starCount });
        } else {
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
        setIsFinished(true);
        setShowLevelFailedModal({ show: true, reason: 'moves' });
      }
    }
  };

  useEffect(() => {
    if (finalResult) {
      setShowLevelCompleteModal(true);
    }
  }, [finalResult]);


  const handleNext = () => {
    onGameEnd({ win: true, ...finalResult });
  };

  const handleRetry = () => {
    setShowLevelCompleteModal(false);
    setShowLevelFailedModal({ show: false, reason: null });
    setFinalResult(null);
    setIsFinished(false);
    setIsAnswered(false);
    setScore(0);
    setCurrentStepIndex(0);
    setMovesLeft(problem.moves.medium);
    setDisplayedExpression(problem.steps[0].currentLHS);
    setTimeLeft(90);
    setFeedback('');
  };

  const handleHome = () => {
    onBack();
  };

  const handleDecreaseExpressionSize = () => setExpressionFontSize(prevSize => Math.max(EXPRESSION_MIN_FONT_SIZE, prevSize - EXPRESSION_FONT_STEP));
  const handleIncreaseExpressionSize = () => setExpressionFontSize(prevSize => Math.min(EXPRESSION_MAX_FONT_SIZE, prevSize + EXPRESSION_FONT_STEP));
  const handlePauseToggle = () => setIsPaused(prevIsPaused => !prevIsPaused);

  return (
    <div id="gameplay-screen" className="game-screen">
      <OrientationLock />

      <div className="map-ui-overlay">
        <div className="header-left-container">
          <button className="button-icon map-back-button" onClick={onBack}></button>
          <PlayerResources />
        </div>
        <h1 className="screen-title-on-map">{`Level ${levelId}`}</h1>
        <div className="header-right-container">
          <button className="button-icon map-quit-button" onClick={onBack}>X</button>
        </div>
      </div>

      {isPaused && ( <div className="pause-overlay"><div className="pause-modal"><h2>Paused</h2><button className="button-primary" onClick={handlePauseToggle}>Resume</button></div></div>)}
      {isModalOpen && (<ProblemModal problemTitle={problem.title} onClose={() => setIsModalOpen(false)} />)}
      {isStepsModalOpen && (<StepsModal steps={problem.steps} currentStepIndex={currentStepIndex} onClose={() => setIsStepsModalOpen(false)} />)}
      <div className="floating-score-container">{floatingScores.map(s => <div key={s.id} className="floating-score">{s.value}</div>)}</div>
      
      <main className="game-container">
        <div className="game-content">
          <div className="problem-area">
            <div className="problem-statement">
              <div className="problem-header"><h3>Problem:</h3><button className="view-full-problem-btn" onClick={() => setIsModalOpen(true)}>View Full</button></div>
              <p id="problem-title">{`\\[${toLatex(problem.title)}\\]`}</p>
            </div>
            <div className="current-expression">
              <div className="problem-header">
                <div className="header-left-group">
                  <h3>Current Expression (LHS):</h3>
                  <div className="font-controls font-controls-inline">
                    <button onClick={handleDecreaseExpressionSize} disabled={expressionFontSize <= EXPRESSION_MIN_FONT_SIZE} aria-label="Decrease font size">A-</button>
                    <span className="font-size-indicator">{Math.round((expressionFontSize / EXPRESSION_INITIAL_FONT_SIZE) * 100)}%</span>
                    <button onClick={handleIncreaseExpressionSize} disabled={expressionFontSize >= EXPRESSION_MAX_FONT_SIZE} aria-label="Increase font size">A+</button>
                  </div>
                </div>
                <button className="view-full-problem-btn" onClick={() => setIsStepsModalOpen(true)}>Show Steps</button>
              </div>
              <div 
                id="current-lhs" 
                className="expression-container" 
                aria-live="polite"
                style={{ fontSize: `${expressionFontSize}rem` }}
              >
                {displayedExpression ? `\\[${toLatex(displayedExpression)}\\]` : ''}
              </div>
              <p id="step-explanation" className="explanation-text">{isFinished ? 'Proof Complete!' : `Hint: ${currentStep?.explanation}`}</p>
            </div>
          </div>
          <div className="choices-area">
            {mode === 'solo' && problem.scoreThresholds && (<ScoreProgressBar score={score} thresholds={problem.scoreThresholds} />)}
            <div id="gameplay-header-info">
              <div className="stat-item">Moves<span>{movesLeft}</span></div>
              <div className="stat-item time">Time<span>{timeLeft}</span></div>
              <div className="stat-item">Score<span>{score}</span></div>
              <button id="pause-btn" className="button-icon" onClick={handlePauseToggle}>||</button>
            </div>
            <div className="multiplier-display">{scoreMultiplier > 0.5 && !isFinished && `${scoreMultiplier}x Score Bonus!`}</div>
            <p id="feedback-text" aria-live="polite">{feedback}</p>
            <div id="choices-container">{choices.map((formula) => (<button key={formula.id} className="button-secondary" onClick={() => handleChoice(formula.id)} disabled={isAnswered || isFinished || isPaused}>{`\\(${toLatex(formula.text)}\\)`}</button>))}</div>
          </div>
        </div>
      </main>

      {showLevelCompleteModal && (
        <LevelCompleteModal
          result={finalResult}
          problem={problem}
          onNext={handleNext}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      )}
      
      {showLevelFailedModal.show && (
        <LevelFailedModal
          reason={showLevelFailedModal.reason}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      )}
    </div>
  );
}