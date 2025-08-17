// src/utils/audioManager.js - UPDATED FOR INSTANT TRANSITIONS

// --- Import All Sound Assets ---
// Sound Effects (SFX)
import waterFillSound from '../assets/sounds/water-fill-single.mp3';
import starAchievedSound from '../assets/sounds/star-achieved.mp3';
import buttonClickSound from '../assets/sounds/button-click.mp3';

// Background Music (BGM)
import menuMusic from '../assets/sounds/music-calm-4m.mp3';
import soloMusic1 from '../assets/sounds/music-focus-4m.mp3';
import soloMusic2 from '../assets/sounds/music-epic-4m.mp3';
import versusMusic from '../assets/sounds/music-tense-2m.mp3';


// ============================================================================
// === SOUND EFFECTS (SFX) LOGIC (Unchanged) ==================================
// ============================================================================

const sfx = {
  fill: new Audio(waterFillSound),
  star: new Audio(starAchievedSound),
  buttonClick: new Audio(buttonClickSound),
};

sfx.fill.volume = 0.7;
sfx.star.volume = 0.8;
sfx.buttonClick.volume = 0.6;

export const playFillSound = () => {
  sfx.fill.currentTime = 0;
  sfx.fill.play().catch(e => console.error("SFX play failed:", e));
};

export const playStarSound = () => {
  sfx.star.currentTime = 0;
  sfx.star.play().catch(e => console.error("SFX play failed:", e));
};

export const playButtonClickSound = () => {
  sfx.buttonClick.currentTime = 0;
  sfx.buttonClick.play().catch(e => console.error("SFX play failed:", e));
};


// ============================================================================
// === BACKGROUND MUSIC (BGM) LOGIC (Modified) ================================
// ============================================================================

export const TRACKS = {
  MENU: 'MENU',
  SOLO: 'SOLO',
  VERSUS: 'VERSUS',
};

const bgm = {
  MENU: new Audio(menuMusic),
  SOLO_1: new Audio(soloMusic1),
  SOLO_2: new Audio(soloMusic2),
  VERSUS: new Audio(versusMusic),
};

const soloPlaylist = [bgm.SOLO_1, bgm.SOLO_2];
let currentSoloTrackIndex = 0;
soloPlaylist.forEach((track, index) => {
  track.addEventListener('ended', () => {
    currentSoloTrackIndex = (index + 1) % soloPlaylist.length;
    soloPlaylist[currentSoloTrackIndex].play();
  });
});

Object.values(bgm).forEach(track => {
  track.loop = false;
});
bgm.MENU.loop = true;
bgm.VERSUS.loop = true;

let currentTrackKey = null;
let currentAudio = null;
let masterVolume = 0.5;

// --- REMOVED ---
// The entire 'fade' function and its related variables (fadeTime, fadeInterval) have been removed.

// --- Public BGM Control Functions (MODIFIED) ---

export const playMusic = (trackKey) => {
  if (trackKey === currentTrackKey) return;

  // --- MODIFIED: Instant Stop ---
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  if (trackKey === TRACKS.SOLO) {
    currentAudio = soloPlaylist[currentSoloTrackIndex];
  } else if (trackKey === TRACKS.MENU) {
    currentAudio = bgm.MENU;
  } else if (trackKey === TRACKS.VERSUS) {
    currentAudio = bgm.VERSUS;
  } else {
    currentAudio = null;
  }

  currentTrackKey = trackKey;

  // --- MODIFIED: Instant Play ---
  if (currentAudio) {
    currentAudio.volume = masterVolume; // Set volume directly
    currentAudio.currentTime = 0;
    currentAudio.play().catch(e => console.error("Music play failed", e));
  }
};

export const stopMusic = () => {
  // --- MODIFIED: Instant Stop ---
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentTrackKey = null;
  currentAudio = null;
};

// --- Master Mute/Volume Controls (Unchanged, but now works instantly) ---
export const setMasterVolume = (isMuted) => {
    const newVolume = isMuted ? 0 : 0.5;
    masterVolume = newVolume;
    if(currentAudio) {
        currentAudio.volume = masterVolume;
    }

    Object.values(sfx).forEach(sound => {
        sound.muted = isMuted;
    });
};