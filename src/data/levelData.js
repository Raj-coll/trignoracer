// src/data/levelData.js - UPDATED WITH NEW COORDINATES FOR THE CANDY MAP

// The 'pos' coordinates have been carefully updated to follow the new path.
// The path starts at the bottom and winds its way to the top.
// Feel free to tweak these percentage values to get the perfect placement!
export const initialLevels = [
  // These first 5 levels match your original game state, but with new positions
  { id: 1, status: 'completed', stars: 3, pos: { x: 40.65, y: 93.28} },
  { id: 2, status: 'completed', stars: 1, pos: { x: 45.22, y: 82.59 } },
  { id: 3, status: 'unlocked',  stars: 0, pos: { x: 50.11, y: 75.77 } },
  { id: 4, status: 'locked',    stars: 0, pos: { x: 57.22, y: 70.83 } },
  { id: 5, status: 'locked',    stars: 0, pos: { x: 58.61, y: 56.91 } },

  // New positions for the rest of your levels
  { id: 6, status: 'locked',    stars: 0, pos: { x: 52.33, y: 50.04 } },
  { id: 7, status: 'locked',    stars: 0, pos: { x: 45.11, y: 45.11 } },
  { id: 8, status: 'locked',    stars: 0, pos: { x: 40.56, y: 37.16 } },
  { id: 9, status: 'locked',    stars: 0, pos: { x: 49.11, y: 31.23 } },
  { id: 10, status: 'locked',   stars: 0, pos: { x: 56.33, y: 25.30 } },
];