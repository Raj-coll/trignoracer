// src/App.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSocket, socket } from './hooks/useSocket';
import StartScreen from './components/StartScreen';
import LevelSelectionScreen from './components/LevelSelectionScreen';
import GlobalHeader from './components/GlobalHeader';
import GameplayScreen from './components/GameplayScreen';
import AdminPage from './components/AdminPage';
import WaitingScreen from './components/WaitingScreen';
// === CHANGE: Corrected casing for the StarDisplay import ===
import StarDisplay from './components/starDisplay';
import { problems } from './data/gameData';

function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [activeLevel, setActiveLevel] = useState(null);
  const [gameMode, setGameMode] = useState('solo');
  const [roomId, setRoomId] = useState(null);
  const [gameOverState, setGameOverState] = useState(null);

  // --- SOCKET EVENT HANDLERS ---
  const handleGameStart = useCallback((data) => {
    console.log('"game_start" event received:', data);
    setRoomId(data.room);
    setActiveLevel(data.levelId);
    setCurrentScreen('gameplay');
  }, []);

  const handleGameOver = useCallback((data) => {
    console.log('"game_over" event received:', data);
    const amIWinner = socket.id === data.winnerId;
    setGameOverState({ winner: amIWinner });
    setCurrentScreen('game_over');
  }, []);

  useSocket('game_start', handleGameStart);
  useSocket('game_over', handleGameOver);

  // This effect for the /admin route is unchanged
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setCurrentScreen('admin');
    }
  }, []);


  // --- GAME FLOW HANDLERS ---
  const handlePlayClick = () => {
    setGameMode('solo');
    setCurrentScreen('level_select');
  };

  const handleLevelSelect = (levelId) => {
    setActiveLevel(levelId);
    setGameOverState(null);
    setCurrentScreen('gameplay');
  };

  const handleVersusClick = () => {
    setGameMode('versus');
    setGameOverState(null);
    setCurrentScreen('waiting');
    socket.emit('find_match');
  };

  const handleCancelMatchmaking = () => {
    socket.emit('cancel_matchmaking');
    setCurrentScreen('start');
  };

  const handleSoloGameEnd = (result) => {
    setGameOverState({ winner: result.win, score: result.score, movesLeft: result.movesLeft });
    setCurrentScreen('game_over');
  };

  const handleGoBack = () => {
    if (currentScreen === 'level_select') {
      setCurrentScreen('start');
    }
    if (currentScreen === 'gameplay') {
      setCurrentScreen('level_select');
    }
  };


  // --- RENDER LOGIC ---
  const renderCurrentScreen = () => {
    if (currentScreen === 'admin') return <AdminPage />;
    
    switch (currentScreen) {
      case 'start':
        return <StartScreen onPlayClick={handlePlayClick} onVersusClick={handleVersusClick} />;
      case 'level_select':
        return <LevelSelectionScreen onLevelSelect={handleLevelSelect} />;
      case 'gameplay':
        return (
          <GameplayScreen
            levelId={activeLevel}
            mode={gameMode}
            roomId={roomId}
            onGameEnd={handleSoloGameEnd}
          />
        );
      case 'waiting':
        return <WaitingScreen onCancel={handleCancelMatchmaking} />;
      case 'game_over': {
        if (!gameOverState) return null;

        let starsEarned = 0;
        let bonusScore = 0;
        let totalScore = gameOverState.score || 0;
        let title = gameOverState.winner ? "Level Complete!" : "Out of Moves";

        if (gameMode === 'solo' && gameOverState.winner) {
          const thresholds = problems[activeLevel].scoreThresholds;
          bonusScore = (gameOverState.movesLeft || 0) * 500;
          totalScore += bonusScore;

          if (totalScore >= thresholds.oneStar) starsEarned = 1;
          if (totalScore >= thresholds.twoStars) starsEarned = 2;
          if (totalScore >= thresholds.threeStars) starsEarned = 3;
        }

        if (gameMode === 'versus') {
            title = gameOverState.winner ? "You Win!" : "You Lost";
        }

        return (
          <div className="screen" style={{justifyContent: 'center'}}>
            <div className="modal-content">
              <h2>{title}</h2>
              {gameMode === 'solo' && gameOverState.winner && <StarDisplay starsEarned={starsEarned} />}
              {gameMode === 'solo' && gameOverState.winner && (
                <div id="final-score-breakdown">
                  <p>Base Score: <span>{gameOverState.score}</span></p>
                  <p>Bonus Moves: <span>{bonusScore}</span></p>
                  <p className="final-score">Total: <span>{totalScore}</span></p>
                </div>
              )}
              <p>
                {gameMode === 'versus' 
                  ? (gameOverState.winner ? 'You solved it first!' : 'Your opponent was faster!') 
                  : (gameOverState.winner ? `You earned ${starsEarned} star(s)!` : 'Try again!')}
              </p>
              <button className="button-primary" onClick={() => setCurrentScreen('start')}>
                Main Menu
              </button>
            </div>
          </div>
        );
      }
      default:
        return <StartScreen onPlayClick={handlePlayClick} onVersusClick={handleVersusClick} />;
    }
  };

  return (
    <div>
      {currentScreen !== 'start' && currentScreen !== 'admin' && currentScreen !== 'waiting' && currentScreen !== 'game_over' && (
        <GlobalHeader onBackClick={handleGoBack} />
      )}
      {renderCurrentScreen()}
    </div>
  );
}

export default App;