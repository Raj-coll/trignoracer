// src/contexts/MusicContext.jsx

import React, { createContext, useContext, useState, useCallback } from 'react';
// Import everything from your upgraded audioManager
import * as audioManager from '../utils/audioManager';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioManager.setMasterVolume(newMuted); // Call the master mute function
  }, [isMuted]);

  const playMusic = useCallback((trackKey) => {
    if (isMuted) return;
    audioManager.playMusic(trackKey);
  }, [isMuted]);

  const stopMusic = useCallback(() => {
    audioManager.stopMusic();
  }, []);
  
  // The value provided to consuming components
  const value = { isMuted, toggleMute, playMusic, stopMusic };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};