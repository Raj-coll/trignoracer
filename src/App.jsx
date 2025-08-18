// src/App.jsx - FINAL UPDATED VERSION

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
import { playButtonClickSound, TRACKS } from './utils/audioManager'; // <-- MODIFIED: Added TRACKS
import { MusicProvider, useMusic } from './contexts/MusicContext';   // <-- NEW: Import the context provider and hook

// Your entire original App component is now renamed to AppContent
function AppContent() {
  // --- All your state and handlers are unchanged ---
  const [currentScreen, setCurrentScreen] = useState('start');
  const [activeLevel, setActiveLevel] = useState(null);
  const [gameMode, setGameMode] = useState('solo');
  const [roomId, setRoomId] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  // <-- NEW: Get the music controller function from our context
  const { playMusic } = useMusic();

  // <-- NEW: This useEffect hook controls the background music based on the screen
  useEffect(() => {
    switch (currentScreen) {
      case 'start':
      case 'level_select':
        playMusic(TRACKS.MENU);
        break;
      case 'gameplay':
        if (gameMode === 'solo') {
          playMusic(TRACKS.SOLO);
        } else {
          playMusic(TRACKS.VERSUS);
        }
        break;
      case 'waiting':
        playMusic(TRACKS.VERSUS);
        break;
      default:
        // By default, we let music continue playing through modals, which is a good user experience.
        break;
    }
  }, [currentScreen, gameMode, playMusic]); // This runs when the screen or mode changes


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

  // --- Handlers with Sound Added ---
  const handlePlayClick = () => {
    playButtonClickSound();
    setGameMode('solo');
    setCurrentScreen('level_select');
  };

  const handleLevelSelect = (levelId) => {
    playButtonClickSound();
    setActiveLevel(levelId);
    setGameResult(null);
    setCurrentScreen('gameplay');
  };

  const handleVersusClick = () => {
    playButtonClickSound();
    setGameMode('versus');
    setGameResult(null);
    setCurrentScreen('waiting');
    socket.emit('find_match');
  };

  const handleCancelMatchmaking = () => {
    playButtonClickSound();
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
    playButtonClickSound();
    setGameResult(null);
    setCurrentScreen('level_select');
  };

  const handleGoBack = () => {
    playButtonClickSound();
    if (currentScreen === 'level_select') setCurrentScreen('start');
    if (currentScreen === 'gameplay') setCurrentScreen('level_select');
  };

  // --- The rest of the file is unchanged ---
  const renderScreens = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen onPlayClick={handlePlayClick} onVersusClick={handleVersusClick} />;
      case 'level_select':
        return <LevelSelectionScreen onLevelSelect={handleLevelSelect} onBackClick={handleGoBack} />;
      case 'gameplay':
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
     {currentScreen === 'start' && <FullscreenButton />}
      
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
                playButtonClickSound();
                setGameResult(null);
                setCurrentScreen('start');
              }}>Main Menu</button>
            </div>
          </div>
      )}
    </>
  );
}

// <-- NEW: The final exported App component is now a simple wrapper
// that provides the music context to AppContent and all its children.
export default function App() {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
}
