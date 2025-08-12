// src/App.jsx - UPDATED

// --- Core React and Game Logic Imports ---
import { useState, useEffect, useCallback } from 'react';
import { useSocket, socket } from './hooks/useSocket';
import StartScreen from './components/StartScreen';
import LevelSelectionScreen from './components/LevelSelectionScreen';
import GameplayScreen from './components/GameplayScreen';
import AdminPage from './components/AdminPage';
import WaitingScreen from './components/WaitingScreen';
import LevelCompleteModal from './components/LevelCompleteModal';
import { problems } from './data/gameData';
import './components/GameplayScreen.css';
import FullscreenButton from './components/FullscreenButton';

function App() {
  // --- All your state and handlers are unchanged ---
  const [currentScreen, setCurrentScreen] = useState('start');
  const [activeLevel, setActiveLevel] = useState(null);
  const [gameMode, setGameMode] = useState('solo');
  const [roomId, setRoomId] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  const handleGameStart = useCallback((data) => {
    setRoomId(data.room);
    setActiveLevel(data.levelId);
    setCurrentScreen('gameplay');
  }, []);

  const handleGameOver = useCallback((data) => {
    const amIWinner = socket.id === data.winnerId;
    setGameResult({ winner: amIWinner });
  }, []);

  useSocket('game_start', handleGameStart);
  useSocket('game_over', handleGameOver);

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setCurrentScreen('admin');
    }
  }, []);

  const handlePlayClick = () => {
    setGameMode('solo');
    setCurrentScreen('level_select');
  };

  const handleLevelSelect = (levelId) => {
    setActiveLevel(levelId);
    setGameResult(null);
    setCurrentScreen('gameplay');
  };

  const handleVersusClick = () => {
    setGameMode('versus');
    setGameResult(null);
    setCurrentScreen('waiting');
    socket.emit('find_match');
  };

  const handleCancelMatchmaking = () => {
    socket.emit('cancel_matchmaking');
    setCurrentScreen('start');
  };

  const handleSoloGameEnd = (result) => {
    const levelThresholds = problems[activeLevel].scoreThresholds;
    const finalResult = {
      ...result,
      thresholds: levelThresholds,
    };
    setGameResult(finalResult);
  };

  const handleGoToMainMenu = () => {
    setGameResult(null);
    setCurrentScreen('level_select');
  };

  const handleGoBack = () => {
    if (currentScreen === 'level_select') setCurrentScreen('start');
    if (currentScreen === 'gameplay') setCurrentScreen('level_select');
  };

  const renderScreens = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen onPlayClick={handlePlayClick} onVersusClick={handleVersusClick} />;
      case 'level_select':
        return <LevelSelectionScreen onLevelSelect={handleLevelSelect} onBackClick={handleGoBack} />;
      case 'gameplay':
        // --- THIS IS THE CAREFUL UPDATE ---
        // Pass the handleGoBack function as the 'onBack' prop.
        // This connects the back button in GameplayScreen to the logic in App.jsx.
        return (
          <GameplayScreen
            levelId={activeLevel}
            mode={gameMode}
            roomId={roomId}
            onGameEnd={handleSoloGameEnd}
            onBack={handleGoBack}
          />
        );
      case 'waiting':
        return <WaitingScreen onCancel={handleCancelMatchmaking} />;
      case 'admin':
        return <AdminPage />;
      default:
        return <StartScreen onPlayClick={handlePlayClick} onVersusClick={handleVersusClick} />;
    }
  };

  return (
    <>
      <FullscreenButton />
      
      {renderScreens()}

      {gameResult && gameMode === 'solo' && gameResult.win && (
        <LevelCompleteModal
          result={gameResult}
          onMainMenu={handleGoToMainMenu}
        />
      )}
      {gameResult && gameMode === 'solo' && !gameResult.win && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Game Over</h2>
            <p>You ran out of moves or time!</p>
            <button className="button-primary" onClick={handleGoToMainMenu}>Try Again</button>
          </div>
        </div>
      )}
      {gameResult && gameMode === 'versus' && (
         <div className="modal-backdrop">
            <div className="modal-content">
              <h2>{gameResult.winner ? "You Win!" : "You Lost"}</h2>
              <p>{gameResult.winner ? 'You solved it first!' : 'Your opponent was faster!'}</p>
              <button className="button-primary" onClick={() => {
                setGameResult(null);
                setCurrentScreen('start');
              }}>Main Menu</button>
            </div>
          </div>
      )}
    </>
  );
}

export default App;